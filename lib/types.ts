export type Recipe = {
  id: string;
  title: string;
  image: string;
  cuisine: string;
  diet: string[];
  difficulty: "easy"|"medium"|"hard";
  time: number;
  servings: number;
  ingredients: string[];
  steps: string[];
  nutrition: { calories: number; protein: number; carbs: number; fat: number };
  keywords: string[];
};

export type FilterState = { difficulty: "any"|"easy"|"medium"|"hard"; maxTime: number; };
