import * as React from "react";
import type { SortLevel } from "../types";

type SortLevelViewProps = {
  level: SortLevel;
  onComplete: (result: {
    correct: boolean;
    scoreEarned: number;
    xpEarned: number;
    assignments: Record<string, string>;
  }) => void;
};

export function SortLevelView({ level, onComplete }: SortLevelViewProps) {
  const [assignments, setAssignments] = React.useState<Record<string, string>>({});
  const [submitted, setSubmitted] = React.useState(false);

  const allAssigned = level.items.every((item) => assignments[item.id]);

  const results = React.useMemo(() => {
    return level.items.map((item) => {
      const assignedCategory = assignments[item.id];
      const isCorrect = assignedCategory === item.correctCategory;
      return {
        ...item,
        assignedCategory,
        isCorrect,
      };
    });
  }, [level.items, assignments]);

  const correctCount = results.filter((item) => item.isCorrect).length;
  const passed = correctCount === level.items.length;

  const handleAssign = (itemId: string, category: string) => {
    if (submitted) return;
    setAssignments((prev) => ({
      ...prev,
      [itemId]: category,
    }));
  };

  const handleSubmit = () => {
    if (!allAssigned) return;
    setSubmitted(true);
  };

  const handleContinue = () => {
    onComplete({
      correct: passed,
      scoreEarned: passed ? level.xp : 0,
      xpEarned: passed ? level.xp : Math.max(1, Math.floor(level.xp * 0.4)),
      assignments,
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

        <div className="space-y-4">
          {level.items.map((item) => {
            const assignedCategory = assignments[item.id];
            const result = results.find((r) => r.id === item.id);

            return (
              <div key={item.id} className="rounded-xl border p-4">
                <div className="mb-3 font-medium text-neutral-900">{item.label}</div>

                <div className="flex flex-wrap gap-2">
                  {level.categories.map((category) => {
                    const selected = assignedCategory === category;
                    const showCorrect =
                      submitted && category === item.correctCategory;
                    const showWrong =
                      submitted && selected && category !== item.correctCategory;

                    return (
                      <button
                        key={category}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleAssign(item.id, category)}
                        className={[
                          "rounded-full border px-3 py-1.5 text-sm font-medium transition",
                          showCorrect
                            ? "border-emerald-600 bg-emerald-50 text-emerald-800"
                            : showWrong
                              ? "border-rose-600 bg-rose-50 text-rose-800"
                              : selected
                                ? "border-neutral-900 bg-neutral-900 text-white"
                                : "border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50",
                        ].join(" ")}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>

                {submitted && result && (
                  <div
                    className={[
                      "mt-3 rounded-lg p-3 text-sm",
                      result.isCorrect
                        ? "bg-emerald-50 text-emerald-900"
                        : "bg-amber-50 text-amber-900",
                    ].join(" ")}
                  >
                    <p className="font-medium">
                      {result.isCorrect ? "Correct" : "Not quite"}
                    </p>
                    <p className="mt-1">{item.feedback}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allAssigned}
            className="rounded-xl bg-neutral-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Check Answers
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
                {passed
                  ? "Workflow sorted correctly."
                  : `You got ${correctCount} of ${level.items.length} correct.`}
              </p>
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