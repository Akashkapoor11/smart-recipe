"use client";
export default function RatingStars({ value, onChange }:{ value:number; onChange:(v:number)=>void }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(n=>(
        <button key={n} onClick={()=>onChange(n)} aria-label={`rate ${n}`} className="text-xl">
          {value>=n ? "★" : "☆"}
        </button>
      ))}
    </div>
  );
}
