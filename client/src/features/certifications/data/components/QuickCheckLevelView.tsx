import * as React from "react";
import type { QuickCheckLevel } from "../types";

type QuickCheckLevelViewProps = {
  level: QuickCheckLevel;
  onComplete: (result: {
    correct: boolean;
    scoreEarned: number;
    xpEarned: number;
    answers: Record<string, string>;
  }) => void;
};

export function QuickCheckLevelView({
  level,
  onComplete,
}: QuickCheckLevelViewProps) {
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [submitted, setSubmitted] = React.useState(false);

  const allAnswered = level.questions.every((q) => answers[q.id]);

  const results = React.useMemo(() => {
    return level.questions.map((q) => {
      const selectedId = answers[q.id];
      const selectedAnswer = q.answers.find((a) => a.id === selectedId);
      const isCorrect = !!selectedAnswer?.correct;

      return {
        questionId: q.id,
        selectedId,
        isCorrect,
        explanation: q.explanation,
      };
    });
  }, [level.questions, answers]);

  const correctCount = results.filter((r) => r.isCorrect).length;
  const totalQuestions = level.questions.length;
  const passed = correctCount === totalQuestions;

  const handleSelect = (questionId: string, answerId: string) => {
    if (submitted) return;

    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerId,
    }));
  };

  const handleSubmit = () => {
    if (!allAnswered) return;
    setSubmitted(true);
  };

  const handleContinue = () => {
    const scoreEarned = passed ? level.xp : Math.round((correctCount / totalQuestions) * level.xp);
    const xpEarned = passed ? level.xp : Math.max(1, Math.floor(scoreEarned * 0.5));

    onComplete({
      correct: passed,
      scoreEarned,
      xpEarned,
      answers,
    });
  };

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium text-neutral-500">{level.shortTitle}</p>
          <h2 className="text-2xl font-bold text-neutral-900">{level.title}</h2>
        </div>

        <div className="space-y-5">
          {level.questions.map((question, index) => {
            const selectedId = answers[question.id];
            const result = results.find((r) => r.questionId === question.id);

            return (
              <div key={question.id} className="rounded-xl border p-4">
                <p className="mb-3 font-medium text-neutral-900">
                  {index + 1}. {question.question}
                </p>

                <div className="space-y-2">
                  {question.answers.map((answer) => {
                    const isSelected = selectedId === answer.id;
                    const showCorrect = submitted && answer.correct;
                    const showWrong = submitted && isSelected && !answer.correct;

                    return (
                      <button
                        key={answer.id}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelect(question.id, answer.id)}
                        className={[
                          "w-full rounded-xl border p-3 text-left transition",
                          showCorrect
                            ? "border-emerald-600 bg-emerald-50 text-emerald-900"
                            : showWrong
                              ? "border-rose-600 bg-rose-50 text-rose-900"
                              : isSelected
                                ? "border-neutral-900 bg-neutral-900 text-white"
                                : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-400",
                        ].join(" ")}
                      >
                        {answer.label}
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
                      {result.isCorrect ? "Correct" : "Review this one"}
                    </p>
                    <p className="mt-1">{question.explanation}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {!submitted ? (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered}
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
                  ? "Station reset complete."
                  : `You got ${correctCount} of ${totalQuestions} correct.`}
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