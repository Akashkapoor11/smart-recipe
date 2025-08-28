"use client";
import { useEffect, useMemo, useState } from "react";
import IngredientInput from "@/components/IngredientInput";
import ImageRecognizer from "@/components/ImageRecognizer";
import RecipeCard from "@/components/RecipeCard";
import Filters from "@/components/Filters";
import { useRecipeStore } from "@/lib/store";
import { FilterState } from "@/lib/types";

export default function Home() {
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [diet, setDiet] = useState<string[]>([]);
  const [recognized, setRecognized] = useState<string[]>([]);
  const [filters, setFilters] = useState<FilterState>({ difficulty: "any", maxTime: 120 });
  const { ratings } = useRecipeStore();

  const allIngredients = useMemo(
    () => Array.from(new Set([...ingredients, ...recognized].map((s) => s.toLowerCase()))),
    [ingredients, recognized]
  );

  const [exact, setExact] = useState<any[]>([]);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let aborted = false;

    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ingredients: allIngredients, diet, filters, ratings }),
        });
        const data = await res.json().catch(() => ({ exact: [], suggestions: [] }));
        if (!aborted) {
          setExact(data.exact || []);
          setSuggestions(data.suggestions || []);
        }
      } catch {
        if (!aborted) {
          setExact([]);
          setSuggestions([]);
        }
      } finally {
        if (!aborted) setLoading(false);
      }
    })();

    return () => {
      aborted = true;
    };
  }, [allIngredients, diet, filters, ratings]);

  return (
    <div className="space-y-6 overflow-x-hidden">
      <section className="p-8 rounded-2xl bg-gradient-to-r from-orange-50 to-yellow-50 shadow-sm border">
        <h1 className="text-4xl font-extrabold mb-4 text-black">🍳 Find recipes from what you have</h1>
        <p className="text-sm text-gray-700 mb-4">Type ingredients or snap a photo. Pick dietary preferences and filters.</p>

        <div className="grid md:grid-cols-2 gap-4">
          <IngredientInput value={ingredients} onChange={setIngredients} diet={diet} setDiet={setDiet} />
          <ImageRecognizer onRecognized={setRecognized} />
        </div>

        <div className="mt-4">
          <Filters value={filters} onChange={setFilters} />
        </div>

        <div className="mt-2 text-sm text-gray-700">
          Using {allIngredients.length ? <b>{allIngredients.join(", ")}</b> : "no ingredients yet"}
          {diet.length ? ` • Diet: ${diet.join(", ")}` : ""}
        </div>
      </section>

      {/* Results */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full card p-10 text-center text-gray-500">Looking for recipes…</div>
        ) : exact.length > 0 ? (
          exact.map((r) => <RecipeCard key={r.id} recipe={r} />)
        ) : suggestions.length > 0 ? (
          <>
            <div className="col-span-full card p-6 text-black">
              <div className="font-bold text-lg mb-1">No exact matches yet</div>
              <div className="text-sm mb-3">These are close. Try adding onion, tomato or garlic to improve matches.</div>
            </div>
            {suggestions.map((r) => <RecipeCard key={r.id} recipe={r} />)}
          </>
        ) : (
          <div className="col-span-full card p-10 text-center text-gray-500">
            No matches yet. Add ingredients or relax filters.
          </div>
        )}
      </section>
    </div>
  );
}
