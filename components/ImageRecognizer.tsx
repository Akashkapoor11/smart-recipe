"use client";

import { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs"; // keep types + backend control

type Props = { onRecognized: (tags: string[]) => void };

// filter out non-ingredients MobileNet often returns
const BLOCK = new Set([
  "plate", "bowl", "pan", "frying pan", "pot", "cup", "mug", "glass", "spoon", "fork", "knife",
  "table", "napkin", "cutting board", "bottle", "tray", "dish", "tableware", "hot pot"
]);

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim();

export default function ImageRecognizer({ onRecognized }: Props) {
  const [model, setModel] = useState<any>(null);
  const [modelReady, setModelReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fileName, setFileName] = useState<string>("");
  const [candidates, setCandidates] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const imgRef = useRef<HTMLImageElement>(null);

  // ✅ Correct model load (no default.load)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Ensure a backend is available
        await import("@tensorflow/tfjs-backend-webgl");
        await tf.setBackend("webgl");
        await tf.ready();

        // Import the module (not default) and call load()
        const mobilenetMod = await import("@tensorflow-models/mobilenet");
        const m = await mobilenetMod.load({ version: 2, alpha: 1 });
        if (!cancelled) {
          setModel(m);
          setModelReady(true);
        }
      } catch (e) {
        if (!cancelled) setError("Failed to load . Try a hard refresh.");
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // keep parent in sync with user selection
  useEffect(() => {
    onRecognized(selected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  const onFile = async (f: File) => {
    if (!model) {
      setError("Model not ready yet. Please wait a second and try again.");
      return;
    }
    setError(null);
    setFileName(f.name);
    setCandidates([]);
    setSelected([]);
    setLoading(true);

    const url = URL.createObjectURL(f);
    const img = imgRef.current!;
    img.onload = async () => {
      try {
        const preds = await model.classify(img, 8); // top-8
        const words = Array.from(
          new Set(
            preds
              .flatMap((p: any) => String(p.className).split(","))
              .map((w: string) => norm(w))
              .filter(Boolean)
              .filter((w) => !BLOCK.has(w))
          )
        );

        setCandidates(words);
        setSelected(words); // preselect all
      } catch {
        setError("Could not analyze this image.");
      } finally {
        setLoading(false);
        URL.revokeObjectURL(url);
      }
    };
    img.src = url;
  };

  const toggle = (t: string) =>
    setSelected((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const clearPhoto = () => {
    setFileName("");
    setCandidates([]);
    setSelected([]);
    setError(null);
    if (imgRef.current) imgRef.current.src = "";
    onRecognized([]);
  };

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-black">Recognize from photo</h3>
        {fileName ? <button className="btn" onClick={clearPhoto}>Remove photo</button> : null}
      </div>

      <div className="flex items-center gap-3 mt-2">
        <input
          type="file"
          accept="image/*"
          disabled={!modelReady}
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
        {!modelReady && <span className="text-xs text-gray-500">Loading ML model…</span>}
        {fileName && <span className="text-sm text-gray-700">Selected: {fileName}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        <div className="border rounded-xl overflow-hidden bg-white">
          <img ref={imgRef} alt="" className="w-full max-h-60 object-contain" />
        </div>

        <div className="flex flex-col gap-2">
          {loading && <div className="text-sm text-gray-600">Analyzing image…</div>}
          {error && <div className="text-sm text-red-600">{error}</div>}

          {!!candidates.length && (
            <>
              <div className="text-sm text-gray-700">Tap to include/exclude items detected:</div>
              <div className="flex flex-wrap gap-2">
                {candidates.map((t) => {
                  const active = selected.includes(t);
                  return (
                    <button
                      key={t}
                      onClick={() => toggle(t)}
                      className={
                        "px-3 py-1 rounded-full border text-sm " +
                        (active
                          ? "bg-green-200 border-green-300 text-green-900"
                          : "bg-gray-100 border-gray-300 text-gray-700")
                      }
                      aria-pressed={active}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </>
          )}

          {!loading && !candidates.length && (
            <div className="text-xs text-gray-500">
              {modelReady
                ? "Upload a food photo to detect ingredients. Confirm what’s correct."
                : "loading…"}
            </div>
          )}
        </div>
      </div>

      {!!selected.length && (
        <div className="mt-2 p-2 rounded-md bg-green-50 text-green-800 text-sm">
          Selected: <b>{selected.join(", ")}</b>
        </div>
      )}
    </div>
  );
}
