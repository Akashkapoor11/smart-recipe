"use client";
import { useState } from "react";

export default function ServingSize({ baseServings, render }:{
  baseServings:number; render:(servings:number)=>React.ReactNode
}) {
  const [servings, setServings] = useState(Math.max(1, baseServings));
  return (
    <div className="card p-4">
      <div className="flex items-center gap-3">
        <span className="text-sm">Servings</span>
        <input className="input w-20" type="number" min={1} max={16} value={servings}
               onChange={e=>setServings(Math.max(1, Number(e.target.value)))} />
      </div>
      <div className="mt-3">{render(servings)}</div>
    </div>
  );
}
