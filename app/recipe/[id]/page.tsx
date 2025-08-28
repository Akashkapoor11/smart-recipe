import { notFound } from "next/navigation";
import recipes from "@/data/recipes.json";
import SmartImage from "@/components/SmartImage";

type PageProps = { params: { id: string } };

export default function Page({ params }: PageProps) {
  const all = recipes as any[];
  const r = all.find((x) => String(x.id) === String(params.id));
  if (!r) notFound();

  return (
    <div className="space-y-6">
      <div className="card p-5">
        <div className="flex flex-col md:flex-row gap-5">
          <SmartImage
            src={r.image}
            alt={r.title}
            className="w-full md:w-80 h-56 object-cover rounded-2xl border"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-black">{r.title}</h1>
            <div className="mt-1 text-sm text-gray-700">
              {r.cuisine} • {r.difficulty} • ⏱ {r.time}m • 👥 {r.servings}
            </div>
            {Array.isArray(r.diet) && r.diet.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {r.diet.map((d: string) => (
                  <span key={d} className="badge bg-green-100 text-green-800">
                    {d}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="text-xl font-semibold mb-3 text-black">Ingredients</h2>
          <ul className="list-disc pl-5 space-y-1 text-black">
            {r.ingredients.map((line: string, i: number) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <h2 className="text-xl font-semibold mb-3 text-black">Steps</h2>
          <ol className="list-decimal pl-5 space-y-2 text-black">
            {r.steps.map((step: string, i: number) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
