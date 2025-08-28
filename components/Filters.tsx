"use client";
import { FilterState } from "@/lib/types";

export default function Filters({ value, onChange }: { value: FilterState; onChange:(v:FilterState)=>void }) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      <label className="flex items-center gap-2">
        <span className="text-sm">Difficulty</span>
        <select className="input" value={value.difficulty} onChange={e=>onChange({...value, difficulty: e.target.value as any})}>
          <option value="any">Any</option>
          <option value="easy">easy</option>
          <option value="medium">medium</option>
          <option value="hard">hard</option>
        </select>
      </label>
      <label className="flex items-center gap-2">
        <span className="text-sm">Max minutes</span>
        <input className="input w-28" type="number" min={5} max={240} value={value.maxTime}
               onChange={e=>onChange({...value, maxTime: Number(e.target.value)})} />
      </label>
    </div>
  );
}
