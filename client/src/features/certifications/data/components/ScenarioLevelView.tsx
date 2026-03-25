import * as React from "react";
import type { ScenarioLevel } from "../types";

type ScenarioLevelViewProps = {
  level: ScenarioLevel;
  onComplete: (result: {
    correct: boolean;
    scoreEarned: number;
    xpEarned: number;
    choiceId: string;
  }) => void;
};

export function ScenarioLevelView({
  level,
  onComplete,
}: ScenarioLevelViewProps) {
  const [selectedChoiceId, setSelectedChoiceId] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

  const selectedChoice = React.useMemo(
    () => level.choices.find((choice) => choice.id === selectedChoiceId) ?? null,
    [level.choices, selectedChoiceId],
  );

  const handleSubmit = () => {
    if (!selectedChoice) return;
    setSubmitted(true);
  };

  const handleContinue = () => {
    if (!selectedChoice) return;

    onComplete({
      correct: selectedChoice.correct,
      scoreEarned: selectedChoice.correct ? level.xp : 0,
      xpEarned: selectedChoice.correct ? level.xp : Math.max(1, Math.floor(level.xp * 0.25)),
      choiceId: selectedChoice.id,
    });
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="space-y-5">
        <div>
          <p className="text-sm font-medium text-neutral-500">{level.shortTitle}</p>
          <h2 className="text-2xl font-bold text-neutral-900">{level.title}</h2>
        </div>

        <div className="rounded-xl bg-neutral-50 p-4">
          <p className="text-sm font-semibold text-neutral-500">Challenge</p>
          <p className="mt-1 text-lg font-medium text-neutral-900">{level.prompt}</p>
          {level.situation && (
            <p className="mt-3 text-neutral-700">{level.situation}</p>
          )}
        </div>

        <div className="space-y-3">
          {level.choices.map((choice) => {
            const isSelected = selectedChoiceId === choice.id;
            const isCorrect = submitted && choice.correct;
            const isIncorrectSelected = submitted && isSelected && !choice.correct;

            return (
              <button
                key={choice.id}
                type="button"
                disabled={submitted}
                onClick={() => setSelectedChoiceId(choice.id)}
                className={[
                  "w-full rounded-xl border p-4 text-left transition",
                  isCorrect
                    ? "border-emerald-500 bg-emerald-50"
                    : isIncorrectSelected
                      ? "border-rose-500 bg-rose-50"
                      : isSelected
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-400",
                ].join(" ")}
              >
                <div className="font-medium text-neutral-900">{choice.label}</div>
              </button>
            );
          })}
        </div>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!selectedChoice}
            className="rounded-xl bg-neutral-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit Answer
          </button>
        ) : (
          <div className="space-y-4">
            <div
              className={[
                "rounded-xl p-4",
                selectedChoice?.correct
                  ? "bg-emerald-50 text-emerald-900"
                  : "bg-amber-50 text-amber-900",
              ].join(" ")}
            >
              <p className="font-semibold">
                {selectedChoice?.correct ? "Nice save." : "Good catch."}
              </p>
              <p className="mt-1">{selectedChoice?.feedback}</p>
              {selectedChoice?.correct && level.successMessage && (
                <p className="mt-2 text-sm">{level.successMessage}</p>
              )}
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