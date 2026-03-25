import * as React from "react";
import type { HotspotLevel } from "../types";

type HotspotLevelViewProps = {
  level: HotspotLevel;
  onComplete: (result: {
    correct: boolean;
    scoreEarned: number;
    xpEarned: number;
    selectedIds: string[];
  }) => void;
};

export function HotspotLevelView({
  level,
  onComplete,
}: HotspotLevelViewProps) {
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [submitted, setSubmitted] = React.useState(false);

  const selectedHotspots = React.useMemo(
    () => level.hotspots.filter((hotspot) => selectedIds.includes(hotspot.id)),
    [level.hotspots, selectedIds],
  );

  const correctSelectedCount = selectedHotspots.filter((item) => item.correct).length;
  const incorrectSelectedCount = selectedHotspots.filter((item) => !item.correct).length;

  const passed =
    correctSelectedCount >= level.requiredCorrect && incorrectSelectedCount === 0;

  const toggleSelection = (id: string) => {
    if (submitted) return;

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const handleContinue = () => {
    onComplete({
      correct: passed,
      scoreEarned: passed ? level.xp : 0,
      xpEarned: passed ? level.xp : Math.max(1, Math.floor(level.xp * 0.3)),
      selectedIds,
    });
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="space-y-5">
        <div>
          <p className="text-sm font-medium text-neutral-500">{level.shortTitle}</p>
          <h2 className="text-2xl font-bold text-neutral-900">{level.title}</h2>
          <p className="mt-2 text-neutral-700">{level.prompt}</p>
        </div>

        <div className="rounded-xl border bg-neutral-50 p-3">
          <div className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-xl border bg-white">
            <img
              src={level.imageUrl}
              alt={level.imageAlt}
              className="block w-full object-cover"
            />

            {level.hotspots.map((hotspot, index) => {
              const isSelected = selectedIds.includes(hotspot.id);
              const isCorrectReveal = submitted && hotspot.correct;
              const isIncorrectReveal = submitted && isSelected && !hotspot.correct;

              return (
                <button
                  key={hotspot.id}
                  type="button"
                  onClick={() => toggleSelection(hotspot.id)}
                  className={[
                    "absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 text-xs font-bold shadow",
                    isCorrectReveal
                      ? "border-emerald-600 bg-emerald-500 text-white"
                      : isIncorrectReveal
                        ? "border-rose-600 bg-rose-500 text-white"
                        : isSelected
                          ? "border-neutral-900 bg-neutral-900 text-white"
                          : "border-white bg-neutral-800/80 text-white",
                  ].join(" ")}
                  style={{
                    left: `${hotspot.x}%`,
                    top: `${hotspot.y}%`,
                  }}
                  aria-label={hotspot.label}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-xl bg-neutral-50 p-4">
          <div className="mb-2 text-sm font-semibold text-neutral-500">
            Selected findings
          </div>
          {selectedHotspots.length === 0 ? (
            <p className="text-neutral-600">Tap one or more hotspots on the image.</p>
          ) : (
            <ul className="space-y-2">
              {selectedHotspots.map((spot) => (
                <li key={spot.id} className="rounded-lg bg-white p-3 text-sm text-neutral-800">
                  {spot.label}
                </li>
              ))}
            </ul>
          )}
        </div>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={selectedIds.length === 0}
            className="rounded-xl bg-neutral-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Check Selections
          </button>
        ) : (
          <div className="space-y-4">
            <div
              className={[
                "rounded-xl p-4",
                passed ? "bg-emerald-50 text-emerald-900" : "bg-amber-50 text-amber-900",
              ].join(" ")}
            >
              <p className="font-semibold">
                {passed ? "You spotted the problem areas." : "A few details need another look."}
              </p>
              <div className="mt-2 space-y-2">
                {selectedHotspots.map((spot) => (
                  <div key={spot.id} className="text-sm">
                    <span className="font-medium">{spot.label}:</span> {spot.feedback}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleContinue}
              className="rounded-xl bg-neutral-900 px-4 py-2 font-medium text-white"
            >
              Continue
            </button>
          </div>
        )}
      </div>
    </div>
  );
}