import { NextResponse } from "next/server";
import recipes from "@/data/recipes.json";
import { matchRecipes } from "@/lib/matching";

export async function POST(req: Request) {
  // Be tolerant of empty/invalid JSON
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const {
    ingredients = [],
    diet = [],
    filters = { difficulty: "any", maxTime: 120 },
    ratings = {},
  } = body || {};

  const { exact, suggestions } = matchRecipes({
    recipes,
    ingredients,
    diet,
    filters,
    ratings,
  });

  // return both – let the client decide which to show
  return NextResponse.json({ exact: exact.slice(0, 20), suggestions: suggestions.slice(0, 12) });
}
