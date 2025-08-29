# 🍳 Smart Recipe

Find recipes from what you already have.  
Type ingredients or **snap a photo**, confirm the detected items, and get ranked recipe suggestions. Built with **Next.js 14 (App Router)** and **TensorFlow.js (MobileNet)**.

---

## ✨ Features

- **Ingredient input** + dietary filters (vegetarian, vegan, gluten-free, dairy-free, keto, halal)
- **On-device photo recognition** (TFJS MobileNet) with selectable tags
- **Exact matches** and **“close” suggestions** (ranked scoring)
- Favorites with local persistence (Zustand)
- Responsive UI with Tailwind
- Deployed on Vercel

---

## 🧰 Tech Stack

- Next.js 14 (App Router) • TypeScript • Tailwind CSS  
- Zustand (client store)  
- TensorFlow.js + `@tensorflow-models/mobilenet`  
- Local data in `data/recipes.json`

---

## 🚀 Quick Start

```bash
# 1) Install deps
npm i

# 2) Dev
npm run dev

# 3) Production build & run
npm run build
npm run start
Open http://localhost:3000

Node: 18+ recommended.
```
## Deployment Link
https://smart-recipe-er0uscb1p-akashkapoor12004-gmailcoms-projects.vercel.app

## Project Structure
bash
Copy code
app/
  page.tsx                 # Home: input + photo + results
  recipes/page.tsx         # All Recipes + photo ranking + search
  favorites/page.tsx       # Favorites
  recipe/[id]/page.tsx     # Recipe details
  api/match/route.ts       # Server scoring endpoint (exact/suggestions)
components/
  ImageRecognizer.tsx      # TFJS MobileNet + selectable tags
  IngredientInput.tsx
  RecipeCard.tsx
  Filters.tsx
  SmartImage.tsx
data/
  recipes.json             # Recipe catalog
lib/
  recipes.ts               # Typed recipes loader (from JSON)
  matching.ts              # Scoring / filtering
  images.ts                # Unsplash/fallback helpers
  store.ts / useHydrateStore.ts
public/
  *.jpg                    # Local images + fallback.jpg
## Data Shape (Recipe)
ts
Copy code
export type Recipe = {
  id: string;
  title: string;
  image: string;           // url or /public path
  cuisine: string;
  diet: string[];          // e.g. ["vegetarian","gluten-free"]
  difficulty: "easy"|"medium"|"hard";
  time: number;            // minutes
  servings: number;
  ingredients: string[];
  steps: string[];
  nutrition: { calories:number; protein:number; carbs:number; fat:number };
  keywords: string[];
};
Put images in /public or use reliable remote URLs.

A fallback is used if an image 404s: /public/fallback.jpg.

## How Matching Works
Exact: recipe ingredients ⊆ user-selected ingredients and filters pass.

Suggestions: scored by overlaps in title, ingredients, keywords.
Higher score → shown first.

API: POST /api/match

json
Copy code
{
  "ingredients": ["tomato","onion","egg"],
  "diet": ["vegetarian"],
  "filters": { "difficulty":"any", "maxTime": 45 },
  "ratings": {} // (optional) from Zustand
}
Response:

json
Copy code
{ "exact": [/* recipes */], "suggestions": [/* recipes */] }
🖼️ Photo Recognition
Runs entirely in the browser with TFJS (no server/keys).

Model: @tensorflow-models/mobilenet, top-k classes → normalized →
non-food objects filtered (plate, bowl, pan, etc.).

You confirm tags before they’re used in matching.

If WebGL isn’t available, TFJS falls back automatically.

## Scripts
bash
Copy code
npm run dev      # start dev server
npm run build    # production build
npm run start    # serve .next build
🌐 Deploy (Vercel)
bash
Copy code
vercel           # preview
vercel --prod    # production
Make it public (remove “ask access”):

Vercel → Project → Settings → Security

Disable “Build Logs and Source Protection” (if you want logs public)

Share the Production URL (not the preview Inspect URL).

## Troubleshooting
Port already in use (EADDRINUSE)

bash
Copy code
# Windows PowerShell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
TFJS model fails to load

Ensure no ad-blockers are blocking model files.

Hard refresh (Ctrl/Cmd + Shift + R).

Browser should support WebGL; otherwise TFJS tries CPU.

“The default export is not a React Component in page: /recipe/[id]”

Make sure app/recipe/[id]/page.tsx exports a React component as default.

Ensure lib/recipes.ts exists and exports recipes.

Type error: difficulty as string

In recipes.json, difficulty must be "easy"|"medium"|"hard" (exact).

Images not showing

Place local images in /public and reference as /My Image.jpg.

Add a fallback.jpg in /public.

## Notes
No external API keys are required.

All recognition runs on-device; accuracy varies—users confirm tags.
