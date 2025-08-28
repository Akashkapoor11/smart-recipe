import { Recipe, FilterState } from "./types";
import { SUBS } from "@/data/substitutions";

// words we never want to match on
const STOP = new Set([
  "plate","bowl","pan","pot","pots","frying pan","spoon","fork","knife","cup","glass","tray","table",
  "napkin","board","cutting board","dish","dishes","hot pot","fondue","carbonara"
]);

const norm = (s: string) =>
  s.toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .replace(/\s+/g, " ")
    .trim();

function tokenize(s: string): string[] {
  return norm(s).split(" ").filter(Boolean);
}

function expand(ings: string[]) {
  const out = new Set<string>();
  for (const raw of ings) {
    const k = norm(raw);
    if (!k || STOP.has(k)) continue;
    out.add(k);
    // add synonyms
    for (const [base, alts] of Object.entries(SUBS)) {
      if (k.includes(base) || alts.some((a) => k.includes(norm(a)))) {
        out.add(base);
        alts.forEach((a) => out.add(norm(a)));
      }
    }
  }
  return Array.from(out);
}

function recipeTokenSet(r: Recipe): Set<string> {
  const set = new Set<string>();
  r.keywords.forEach((k) => tokenize(k).forEach((t) => !STOP.has(t) && set.add(t)));
  r.ingredients.forEach((line) => {
    // strip numbers/units then tokenize
    const cleaned = line.replace(/([\d/.]+\s*)?(cup|cups|tsp|tbsp|g|kg|ml|l|cloves?|slices?|pieces?)\b/gi, "");
    tokenize(cleaned).forEach((t) => !STOP.has(t) && set.add(t));
  });
  return set;
}

export function matchRecipes({
  recipes,
  ingredients,
  diet,
  filters,
  ratings,
}: {
  recipes: Recipe[];
  ingredients: string[];
  diet: string[];
  filters: FilterState;
  ratings: Record<string, number>;
}) {
  const user = expand(ingredients);

  const relevant = recipes
    .filter((r) => (filters.difficulty === "any" || r.difficulty === filters.difficulty))
    .filter((r) => r.time <= (filters.maxTime || 999))
    .filter((r) => diet.every((d) => r.diet.includes(d)));

  const scored = relevant.map((r) => {
    const tok = recipeTokenSet(r);
    const overlaps = user.filter((u) => tok.has(u) || Array.from(tok).some((k) => k.includes(u) || u.includes(k)));
    const base = overlaps.length;

    const ratingBonus = (ratings[r.id] || 0) * 0.3;
    const staple = ["salt","oil","onion","garlic","tomato","chili","pepper","butter","cumin","turmeric","ginger"];
    const stapleBonus = user.some((u) => staple.includes(u)) ? 0.5 : 0;

    // looser overlap count for suggestions
    const loose = user.filter((u) => Array.from(tok).some((k) => k.includes(u) || u.includes(k)));
    const looseCount = loose.length;

    return { r, strictCount: overlaps.length, looseCount, score: base + ratingBonus + stapleBonus };
  });

  // “exact” – at least one strict overlap OR show everything if user list is empty
  const exact = scored
    .filter((x) => x.strictCount > 0 || user.length === 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.r);

  // “suggestions” – no strict hit, but at least one loose overlap
  const suggestions = scored
    .filter((x) => x.strictCount === 0 && x.looseCount > 0)
    .sort((a, b) => b.looseCount - a.looseCount || b.score - a.score)
    .map((x) => x.r);

  return { exact, suggestions };
}
