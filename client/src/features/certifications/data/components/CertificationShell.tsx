import * as React from "react";
import type {
  
  CertificationLevel,
  HotspotLevel,
  ScenarioLevel,
  SortLevel,
  QuickCheckLevel,
} from "../types";

import { SortLevelView } from "./SortLevelView";
import { QuickCheckLevelView } from "./QuickCheckLevelView";

import type { CertificationEngine } from "../types";
import { ScenarioLevelView } from "./ScenarioLevelView";
import { HotspotLevelView } from "./HotspotLevelView";
import { CertificationReviewStep } from "./CertificationReviewStep";



type CertificationShellProps = {
  engine: CertificationEngine;
};

function LessonLevelView({
  level,
  onComplete,
}: {
  level: Extract<CertificationLevel, { type: "lesson" }>;
  onComplete: () => void;
}) {
  const narrative = level.narrative ?? [];
  const callouts = level.callouts ?? [];
  const keyTakeaways = level.keyTakeaways ?? [];

  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-neutral-500">
            {level.shortTitle}
          </p>
          <h2 className="text-2xl font-bold text-neutral-900">
            {level.title}
          </h2>
        </div>

        {level.media?.kind === "image" && (
          <img
            src={level.media.url}
            alt={level.media.alt ?? level.title}
            className="mx-auto h-auto max-w-sm rounded-xl border object-cover"
          />
        )}

        <div className="space-y-3 text-neutral-700">
          {narrative.map((paragraph: string, index: number) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {callouts.length > 0 && (
          <div className="rounded-xl bg-sky-50 p-4">
            <h3 className="mb-2 font-semibold text-sky-900">
              How it Works
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-sky-900">
              {callouts.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {keyTakeaways.length > 0 && (
          <div className="rounded-xl bg-emerald-50 p-4">
            <h3 className="mb-2 font-semibold text-emerald-900">
              Key Takeaways
            </h3>
            <ul className="list-disc space-y-1 pl-5 text-emerald-900">
              {keyTakeaways.map((item: string, index: number) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="pt-2">
          <button
            onClick={onComplete}
            className="rounded-xl bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-neutral-800"
          >
            {level.ctaLabel ?? "Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}

function UnsupportedLevelView({ level }: { level: CertificationLevel }) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold">Unsupported level type</h2>
      <p className="mt-2 text-neutral-600">
        Level <code>{level.type}</code> is not wired up yet.
      </p>
    </div>
  );
}

function CompletionCard({
  title,
  passed,
  score,
  xp,
  onReset,
  onSubmit,
}: {
  title: string;
  passed: boolean;
  score: number;
  xp: number;
  onReset: () => void;
  onSubmit?: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">
          {passed ? "Online Check Complete" : "Needs Another Pass"}
        </h2>

        <p className="text-neutral-700">{title}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-neutral-100 p-4">
            <div className="text-sm text-neutral-500">Score</div>
            <div className="text-2xl font-bold">{score}%</div>
          </div>

          <div className="rounded-xl bg-neutral-100 p-4">
            <div className="text-sm text-neutral-500">Safety XP</div>
            <div className="text-2xl font-bold">{xp}</div>
          </div>
        </div>

        {passed && (
          <div className="rounded-xl bg-emerald-50 p-4 text-sm text-emerald-800">
            Your online score is ready to submit. After submitting, you’ll schedule an in-person review with a staff member.
          </div>
        )}

        {!passed && (
          <div className="rounded-xl bg-rose-50 p-4 text-sm text-rose-800">
            You did not meet the passing score yet. Restart the module and try again.
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onReset}
            className="rounded-xl border px-4 py-2 font-medium hover:bg-neutral-50"
          >
            Restart Module
          </button>

          {passed && onSubmit && (
            <button
              onClick={onSubmit}
              className="rounded-xl bg-neutral-900 px-4 py-2 font-medium text-white hover:bg-neutral-800"
            >
              Submit Certification
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function renderLevelContent(
  level: any | null | undefined,
  engine: CertificationEngine,
): React.ReactNode {
  if (!level) {
    return (
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-neutral-900">
          No certification step available
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          This certification does not have any levels yet.
        </p>
      </div>
    );
  }

  switch (level.type) {
    case "lesson":
      return (
        <LessonLevelView
          level={level}
          onComplete={() =>
            engine.completeLevel({
              levelId: level.id,
              correct: true,
              scoreEarned: level.xp ?? 0,
              xpEarned: level.xp ?? 0,
            })
          }
        />
      );
    
    case "scenario":
      return (
        <ScenarioLevelView
          level={level}
          onComplete={(result: any) =>
            engine.completeLevel({
              levelId: level.id,
              correct: result?.correct ?? result?.passed ?? true,
              scoreEarned: result?.scoreEarned ?? result?.score ?? level.xp ?? 0,
              xpEarned: result?.xpEarned ?? level.xp ?? 0,
              detail: result,
            })
          }
        />
      );
    
    case "hotspot":
      return (
        <HotspotLevelView
          level={level}
          onComplete={(result: any) =>
            engine.completeLevel({
              levelId: level.id,
              correct: result?.correct ?? result?.passed ?? true,
              scoreEarned: result?.scoreEarned ?? result?.score ?? level.xp ?? 0,
              xpEarned: result?.xpEarned ?? level.xp ?? 0,
              detail: result,
            })
          }
        />
      );
    
    case "quick_check":
      return (
        <QuickCheckLevelView
          level={level}
          onComplete={(result: any) =>
            engine.completeLevel({
              levelId: level.id,
              correct: result?.correct ?? result?.passed ?? true,
              scoreEarned: result?.scoreEarned ?? result?.score ?? level.xp ?? 0,
              xpEarned: result?.xpEarned ?? level.xp ?? 0,
              detail: result,
            })
          }
        />
      );

    default:
      return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900">
            Unsupported level type
          </h2>
          <p className="mt-2 text-sm text-neutral-600">
            Level type <code>{String(level.type)}</code> is not wired up yet.
          </p>
        </div>
      );
  }
}

// function CertificationReviewStep({ engine }: { engine: any }) {
//   const maxPossibleScore = engine.levels.reduce(
//     (sum: number, level: any) => sum + (level.xp ?? 0),
//     0,
//   );

//   const score =
//     maxPossibleScore > 0
//       ? Math.round((engine.totalScore / maxPossibleScore) * 100)
//       : 0;

//   const passingScore = engine.module?.passingScore ?? 80;
//   const passed = score >= passingScore;

//   return (
//     <div className="mx-auto max-w-3xl space-y-6">
//       <div className="rounded-2xl border bg-white p-6 shadow-sm">
//         <p className="text-sm font-medium text-neutral-500">
//           Certification Review
//         </p>

//         <h1 className="mt-2 text-3xl font-bold text-neutral-900">
//           {passed ? "You passed the knowledge check" : "Review and try again"}
//         </h1>

//         <div className="mt-6 rounded-2xl bg-neutral-100 p-6 text-center">
//           <div className="text-sm text-neutral-500">Final Score</div>
//           <div className="mt-2 text-5xl font-bold text-neutral-900">
//             {score}%
//           </div>
//           <div className="mt-2 text-sm text-neutral-600">
//             Passing score: {passingScore}%
//           </div>
//         </div>

//         <div
//           className={[
//             "mt-6 rounded-xl p-4 text-sm",
//             passed
//               ? "bg-emerald-50 text-emerald-800"
//               : "bg-rose-50 text-rose-800",
//           ].join(" ")}
//         >
//           {passed
//             ? "You completed the online certification. Submit your results, then schedule an in-person review with a staff member."
//             : "You did not meet the passing score yet. Review the material and try again."}
//         </div>

//         <div className="mt-6 flex gap-3">
//           {!passed && (
//             <button
//               onClick={engine.reset}
//               className="rounded-xl border px-4 py-2 font-medium"
//             >
//               Try Again
//             </button>
//           )}

//           {passed && (
//             <button
//               onClick={() => {
//                 if (engine.onSubmitCertification) {
//                   engine.onSubmitCertification({
//                     score,
//                     passed,
//                     levelResults: engine.levelResults,
//                   });
//                 }
//               }}
//               className="rounded-xl bg-neutral-900 px-4 py-2 font-medium text-white"
//             >
//               Submit Certification
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

export function CertificationShell({ engine }: CertificationShellProps) {
  const level = engine.currentLevel ??
  engine.levels[engine.currentLevelIndex] ??
  engine.levels[0] ??
  null;

  const maxPossibleScore = React.useMemo(
    () => engine.levels.reduce((sum, l) => sum + l.xp, 0),
    [engine.levels],
  );

  const displayScore =
    maxPossibleScore > 0 ? Math.round((engine.totalScore / maxPossibleScore) * 100) : 0;

    if (engine.completed) {
      const passingScore = engine.module?.passingScore ?? 80;
      const passed = displayScore >= passingScore;
    
      return (
        <CompletionCard
          title={
            passed
              ? "You passed the online knowledge check. Submit your results and schedule an in-person staff review."
              : "Review the material and try again."
          }
          passed={passed}
          score={displayScore}
          xp={engine.totalXp ?? engine.totalScore}
          onReset={engine.reset}
          onSubmit={() => {
            engine.onSubmitCertification?.({
              score: displayScore,
              passed,
              levelResults: engine.levelResults,
            });
          }}
        />
      );
    }

 

    if (engine.completed) {
      const maxPossibleScore = engine.levels.reduce(
        (sum: number, level: any) => sum + (level.xp ?? 0),
        0,
      );
    
      const score =
        maxPossibleScore > 0
          ? Math.round((engine.totalScore / maxPossibleScore) * 100)
          : 0;
    
      const passingScore = engine.module?.passingScore ?? 80;
      const passed = score >= passingScore;
    
      return (
        <CompletionCard
          title={
            passed
              ? "You passed the online knowledge check. Submit your results and schedule an in-person staff review."
              : "Review the material and try again."
          }
          passed={passed}
          score={score}
          xp={engine.totalScore}
          onReset={engine.reset}
          onSubmit={() => {
            engine.onSubmitCertification?.({
              score,
              passed,
              levelResults: engine.levelResults,
            });
          }}
        />
        
      );
    }
    

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="rounded-2xl border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-500">
              {engine.module.subtitle ?? "Certification"}
            </p>
            <h1 className="text-3xl font-bold text-neutral-900">
              {engine.module.title}
            </h1>
          </div>

          <div className="rounded-xl bg-neutral-100 px-4 py-3 text-right">
            <div className="text-xs text-neutral-500">
              {engine.module.theme?.primaryLabel ?? "XP"}
            </div>
            <div className="text-xl font-bold">{engine.totalXp}</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-neutral-600">
            <span>
              Level {engine.currentLevelIndex + 1} of {engine.totalLevels}
            </span>
            <span>
              {engine.module.theme?.progressLabel ?? "Progress"} {engine.progressPercent}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-neutral-200">
            <div
              className="h-full rounded-full bg-neutral-900 transition-all"
              style={{ width: `${engine.progressPercent}%` }}
            />
          </div>
        </div>
      </header>

      <aside className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {engine.levels.map((item, index) => {
            const done = !!engine.levelResults[item.id]?.completed;
            const active = item.id === level?.id;

            return (
              <button
                key={item.id}
                onClick={() => engine.goToLevel(index)}
                className={[
                  "rounded-full px-3 py-1.5 text-sm font-medium transition",
                  active
                    ? "bg-neutral-900 text-white"
                    : done
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200",
                ].join(" ")}
              >
                {index + 1}. {item.shortTitle}
              </button>
            );
          })}
        </div>
      </aside>

      {renderLevelContent(level, engine)}

      <footer className="flex items-center justify-between">
        <button
          onClick={engine.goToPreviousLevel}
          disabled={engine.isFirstLevel}
          className="rounded-xl border px-4 py-2 font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        <div className="text-sm text-neutral-500">
          Score: {displayScore}% · XP: {engine.totalXp}
        </div>
      </footer>
    </div>
  );
}