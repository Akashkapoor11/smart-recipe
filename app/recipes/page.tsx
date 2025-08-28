"use client";

import recipes from "@/data/recipes.json";
import RecipeCard from "@/components/RecipeCard";
import { useState } from "react";

export default function AllRecipes() {
  const [q, setQ] = useState("");

  const filtered = recipes.filter(
    (r) =>
      r.title.toLowerCase().includes(q.toLowerCase()) ||
      r.cuisine.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-4 overflow-x-hidden">
      <div className="card p-4 flex items-center gap-3">
        <input
          className="input w-full"
          placeholder="🔍 Search by recipe name or cuisine…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length > 0 ? (
          filtered.map((r) => <RecipeCard key={r.id} recipe={r} />)
        ) : (
          <div className="col-span-full text-center text-gray-500 card p-10">
            No recipes found. Try another search!
          </div>
        )}
      </div>
    </div>
  );
}
