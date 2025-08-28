"use client";
import Link from "next/link";
import { useRecipeStore } from "@/lib/store";
import RatingStars from "./RatingStars";
import { Recipe } from "@/lib/types";
import useHydrateStore from "@/lib/useHydrateStore";
import { Heart } from "lucide-react"; // if you added lucide-react

export default function RecipeCard({ recipe, style }: { recipe: Recipe; style?: React.CSSProperties }) {
  // read persisted pieces via hydration-safe hook
  const favorites = useHydrateStore(useRecipeStore, s => s.favorites) ?? [];
  const ratings   = useHydrateStore(useRecipeStore, s => s.ratings)   ?? {};
  const toggleFavorite = useRecipeStore(s => s.toggleFavorite);
  const rate           = useRecipeStore(s => s.rate);

  const isFav = favorites.includes(recipe.id);

  return (
    <div className="card p-4 flex flex-col group animate-fade-in" style={style}>
      <div className="relative">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-48 object-cover rounded-xl transition-transform duration-300 group-hover:scale-105"
        />

        {/* Only render after hydration data is available */}
        {favorites && (
          <button
            onClick={() => toggleFavorite(recipe.id)}
            aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
            className="absolute top-3 right-3 rounded-full bg-white/90 p-2 shadow hover:shadow-md transition-all active:scale-95"
          >
            {/* If you didn’t install lucide-react, swap for ❤️ / 🤍 */}
            <Heart size={22} className={isFav ? "fill-red-500 stroke-red-500" : "stroke-gray-700"} />
          </button>
        )}
      </div>

      <Link href={`/recipe/${recipe.id}`} className="mt-4 font-bold text-lg text-dark group-hover:text-primary transition-colors">
        {recipe.title}
      </Link>

      <div className="text-sm text-gray-600 mt-1">{recipe.cuisine} • ⏱ {recipe.time}m</div>

      <div className="mt-auto pt-4">
        {/* Also guard stars until ratings are hydrated */}
        {ratings && (
          <RatingStars value={ratings[recipe.id] ?? 0} onChange={(v) => rate(recipe.id, v)} />
        )}
      </div>
    </div>
  );
}
