import { notFound } from "next/navigation";
import recipes from "@/data/recipes.json";
import SmartImage from "@/components/SmartImage";

type PageProps = { params: { id: string } };

export default function RecipePage({ params }: PageProps) {
  const all = recipes as any[];
  const recipe = all.find((r) => r.id === params.id);
  if (!recipe) notFound();

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <div className="flex flex-col md:flex-row gap-5">
          <SmartImage
            src={recipe.image}
            alt={recipe.title}
            className="w-full md:w-80 h-56 object-cover rounded-2xl border"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-black">{recipe.title}</h1>
            <div className="mt-1 text-sm text-gray-700">
              {recipe.cuisine} • {recipe.difficulty} • ⏱ {recipe.time}m • 👥 {recipe.servings}
            </div>
            {recipe.diet?.length ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {recipe.diet.map((d: string) => (
                  <span key={d} className="badge bg-green-100 text-green-800">{d}</span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="text-xl font-semibold mb-3 text-black">Ingredients</h2>
          <ul className="list-disc pl-5 space-y-1 text-black">
            {recipe.ingredients.map((line: string, i: number) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>

        <div className="card p-5">
          <h2 className="text-xl font-semibold mb-3 text-black">Steps</h2>
          <ol className="list-decimal pl-5 space-y-2 text-black">
            {recipe.steps.map((step: string, i: number) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      <div className="card p-5">
        <h2 className="text-xl font-semibold mb-3 text-black">Nutrition (per serving)</h2>
        <div className="flex flex-wrap gap-3 text-black">
          <span className="badge bg-orange-100 text-orange-800">Calories: {recipe.nutrition.calories}</span>
          <span className="badge bg-orange-100 text-orange-800">Protein: {recipe.nutrition.protein} g</span>
          <span className="badge bg-orange-100 text-orange-800">Carbs: {recipe.nutrition.carbs} g</span>
          <span className="badge bg-orange-100 text-orange-800">Fat: {recipe.nutrition.fat} g</span>
        </div>
      </div>
    </div>
  );
}
