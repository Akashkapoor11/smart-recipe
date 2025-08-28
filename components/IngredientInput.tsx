"use client";
import { useState } from "react";

const DIETS = ["vegetarian","vegan","gluten-free","dairy-free","keto","halal"] as const;

export default function IngredientInput({
  value, onChange, diet, setDiet
}: { value: string[]; onChange: (v:string[])=>void; diet: string[]; setDiet:(d:string[])=>void; }) {
  const [text, setText] = useState("");
  const add = () => {
    const tokens = text.split(/[,\n]+/).map(t=>t.trim().toLowerCase()).filter(Boolean);
    if (!tokens.length) return;
    onChange(Array.from(new Set([...value, ...tokens])));
    setText("");
  };
  const remove = (t:string)=>onChange(value.filter(v=>v!==t));
  const toggleDiet = (d:string)=> setDiet(diet.includes(d) ? diet.filter(x=>x!==d) : [...diet, d]);

  return (
    <div className="p-4 rounded-xl bg-primary/5">
      <h3 className="font-semibold mb-2 text-dark">Your Ingredients</h3>
      <textarea className="input h-24" placeholder="e.g., tomato, onion, eggs…" value={text} onChange={e=>setText(e.target.value)} />
      <div className="mt-2 flex gap-2">
        <button className="btn" onClick={add}>Add Ingredients</button>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 min-h-[2.5rem]">
        {value.map(v=> (
          <span key={v} className="badge bg-green-100 text-green-800 animate-fade-in flex items-center gap-2">
            {v} <button className="text-red-500 hover:text-red-700" onClick={()=>remove(v)}>×</button>
          </span>
        ))}
      </div>

      <h3 className="font-semibold mt-4 mb-2 text-dark">Dietary Preferences</h3>
      <div className="flex flex-wrap gap-2">
        {DIETS.map(d => (
          <button
            key={d}
            className={`px-3 py-1 text-sm rounded-full transition-all duration-200 ${diet.includes(d) ? "bg-accent text-white font-semibold" : "bg-gray-200 text-gray-600"}`}
            onClick={()=>toggleDiet(d)}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}
