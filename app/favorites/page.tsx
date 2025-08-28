"use client";
import { useRecipeStore } from "@/lib/store";
import recipes from "@/data/recipes.json";
import RecipeCard from "@/components/RecipeCard";
import useHydrateStore from "@/lib/useHydrateStore";

export default function Favorites() {
  const favorites = useHydrateStore(useRecipeStore, (state) => state.favorites);

  if (!favorites) {
    return <div className="card p-8 text-gray-500 text-center animate-pulse-slow">Loading favorites...</div>;
  }

  const favs = recipes.filter((r) => favorites.includes(r.id));

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-dark">Your Favorite Recipes</h1>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {favs.length > 0 ? (
          favs.map((r, i) => <RecipeCard key={r.id} recipe={r} style={{ animationDelay: `${i * 100}ms` }}/>)
        ) : (
          <div className="col-span-full card p-10 text-center text-gray-500">
            You haven't favorited any recipes yet.
          </div>
        )}
      </div>
    </div>
  );
}
