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
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-neutral-500">{level.shortTitle}</p>
          <h2 className="text-2xl font-bold text-neutral-900">{level.title}</h2>
        </div>

        {level.media?.kind === "image" && (
          <img
            src={level.media.url}
            alt={level.media.alt}
            className="w-full rounded-xl border object-cover"
          />
        )}

        <div className="space-y-3 text-neutral-700">
          {level.narrative.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {!!level.callouts?.length && (
          <div className="rounded-xl bg-amber-50 p-4">
            <h3 className="mb-2 font-semibold text-amber-900">Watch for</h3>
            <ul className="list-disc space-y-1 pl-5 text-amber-900">
              {level.callouts.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {!!level.keyTakeaways?.length && (
          <div className="rounded-xl bg-sky-50 p-4">
            <h3 className="mb-2 font-semibold text-sky-900">Key takeaways</h3>
            <ul className="list-disc space-y-1 pl-5 text-sky-900">
              {level.keyTakeaways.map((item) => (
                <li key={item}>{item}</li>
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
}: {
  title: string;
  passed: boolean;
  score: number;
  xp: number;
  onReset: () => void;
}) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-neutral-900">
          {passed ? "Badge Printed" : "Needs Another Pass"}
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

        <button
          onClick={onReset}
          className="rounded-xl border px-4 py-2 font-medium hover:bg-neutral-50"
        >
          Restart Module
        </button>
      </div>
    </div>
  );
}

function renderLevel(
  level: CertificationLevel,
  engine: CertificationEngine,
): React.ReactNode {
  switch (level.type) {
    case "lesson":
      return (
        <LessonLevelView
          level={level}
          onComplete={() =>
            engine.completeLevel({
              levelId: level.id,
              correct: true,
              scoreEarned: level.xp,
              xpEarned: level.xp,
            })
          }
        />
      );

    case "scenario":
      return (
        <ScenarioLevelView
          level={level as ScenarioLevel}
          onComplete={(result) =>
            engine.completeLevel({
              levelId: level.id,
              correct: result.correct,
              scoreEarned: result.scoreEarned,
              xpEarned: result.xpEarned,
              detail: { choiceId: result.choiceId },
            })
          }
        />
      );

    case "hotspot":
      return (
        <HotspotLevelView
          level={level as HotspotLevel}
          onComplete={(result) =>
            engine.completeLevel({
              levelId: level.id,
              correct: result.correct,
              scoreEarned: result.scoreEarned,
              xpEarned: result.xpEarned,
              detail: { selectedIds: result.selectedIds },
            })
          }
        />
      );

    case "sort":
      return (
        <SortLevelView
          level={level as SortLevel}
          onComplete={(result) =>
            engine.completeLevel({
              levelId: level.id,
              correct: result.correct,
              scoreEarned: result.scoreEarned,
              xpEarned: result.xpEarned,
              detail: { assignments: result.assignments },
            })
          }
        />
      );

    case "quick_check":
      return (
        <QuickCheckLevelView
          level={level as QuickCheckLevel}
          onComplete={(result) =>
            engine.completeLevel({
              levelId: level.id,
              correct: result.correct,
              scoreEarned: result.scoreEarned,
              xpEarned: result.xpEarned,
              detail: { answers: result.answers },
            })
          }
        />
      );

    default:
      return <UnsupportedLevelView level={level} />;
  }
}

export function CertificationShell({ engine }: CertificationShellProps) {
  const level = engine.currentLevel;

  const maxPossibleScore = React.useMemo(
    () => engine.levels.reduce((sum, l) => sum + l.xp, 0),
    [engine.levels],
  );

  const displayScore =
    maxPossibleScore > 0 ? Math.round((engine.totalScore / maxPossibleScore) * 100) : 0;

  if (engine.completed) {
    return (
      <CompletionCard
        title={engine.module.title}
        passed={engine.passed}
        score={displayScore}
        xp={engine.totalXp}
        onReset={engine.reset}
      />
    );
  }

  if (!level) {
    return (
      <div className="rounded-2xl border bg-white p-6">
        <p>No levels found.</p>
      </div>
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
            const active = item.id === level.id;

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

      {renderLevel(level, engine)}

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