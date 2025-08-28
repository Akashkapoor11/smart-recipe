import { Recipe } from "./types";

export function scaleIngredients(lines: string[], base: number, target: number) {
  const factor = target / base;
  return lines.map(line => line.replace(/([\d.]+)\s*([a-zA-Z]*)/, (_m, num, unit) => {
    const n = parseFloat(num); if (isNaN(n)) return line;
    const scaled = +(n * factor).toFixed(2);
    return `${scaled} ${unit}`.trim();
  }));
}

export function caloriesPerServing(_recipe: Recipe, _servings: number) {
  // nutrition object is per serving already
  return _recipe.nutrition.calories;
}
