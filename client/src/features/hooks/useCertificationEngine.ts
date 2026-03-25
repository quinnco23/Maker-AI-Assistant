import { useCallback, useEffect, useMemo, useState } from "react";
import type {
  CertificationEngine,
  CertificationModule,
  CertificationProgress,
  CompleteLevelPayload,
  LevelResult,
} from "../certifications/data/types";

type Options = {
  storageKey?: string;
};

function buildInitialProgress(module: CertificationModule): CertificationProgress {
  return {
    moduleId: module.id,
    currentLevelIndex: 0,
    totalScore: 0,
    totalXp: 0,
    levelResults: {},
    passed: false,
    completed: false,
  };
}

export function useCertificationEngine(
  module: CertificationModule,
  options?: Options,
): CertificationEngine {
  const storageKey =
    options?.storageKey ?? `certification_progress:${module.machineId}:${module.id}`;

  const [progress, setProgress] = useState<CertificationProgress>(() => {
    if (typeof window === "undefined") {
      return buildInitialProgress(module);
    }

    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return buildInitialProgress(module);
      const parsed = JSON.parse(raw) as CertificationProgress;

      if (parsed.moduleId !== module.id) {
        return buildInitialProgress(module);
      }

      return parsed;
    } catch {
      return buildInitialProgress(module);
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [progress, storageKey]);

  const levels = module.levels;
  const totalLevels = levels.length;

  const currentLevel = useMemo(() => {
    return levels[progress.currentLevelIndex] ?? null;
  }, [levels, progress.currentLevelIndex]);

  const progressPercent = useMemo(() => {
    if (totalLevels === 0) return 0;
    const completedCount = Object.values(progress.levelResults).filter(
      (r) => r.completed,
    ).length;
    return Math.round((completedCount / totalLevels) * 100);
  }, [progress.levelResults, totalLevels]);

  const goToNextLevel = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      currentLevelIndex: Math.min(prev.currentLevelIndex + 1, totalLevels - 1),
    }));
  }, [totalLevels]);

  const goToPreviousLevel = useCallback(() => {
    setProgress((prev) => ({
      ...prev,
      currentLevelIndex: Math.max(prev.currentLevelIndex - 1, 0),
    }));
  }, []);

  const goToLevel = useCallback((index: number) => {
    setProgress((prev) => ({
      ...prev,
      currentLevelIndex: Math.max(0, Math.min(index, totalLevels - 1)),
    }));
  }, [totalLevels]);

  const completeLevel = useCallback((payload: CompleteLevelPayload) => {
    setProgress((prev) => {
      const level = module.levels.find((l) => l.id === payload.levelId);
      if (!level) return prev;

      const existing = prev.levelResults[payload.levelId];
      const attempts = (existing?.attempts ?? 0) + 1;

      const nextResult: LevelResult = {
        levelId: payload.levelId,
        completed: true,
        correct: payload.correct,
        scoreEarned: payload.scoreEarned ?? level.xp,
        xpEarned: payload.xpEarned ?? level.xp,
        attempts,
        completedAt: new Date().toISOString(),
        detail: payload.detail,
      };

      const nextLevelResults = {
        ...prev.levelResults,
        [payload.levelId]: nextResult,
      };

      const totalScore = Object.values(nextLevelResults).reduce(
        (sum, item) => sum + item.scoreEarned,
        0,
      );

      const totalXp = Object.values(nextLevelResults).reduce(
        (sum, item) => sum + item.xpEarned,
        0,
      );

      const completedCount = Object.values(nextLevelResults).filter(
        (r) => r.completed,
      ).length;

      const completed = completedCount >= module.levels.length;

      const maxPossibleScore = module.levels.reduce(
        (sum, l) => sum + (l.xp ?? 0),
        0,
      );

      const percentScore =
        maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;

      const passed = completed && percentScore >= module.passingScore;

      const currentLevelIndex = completed
        ? prev.currentLevelIndex
        : Math.min(prev.currentLevelIndex + 1, module.levels.length - 1);

      return {
        ...prev,
        levelResults: nextLevelResults,
        totalScore,
        totalXp,
        completed,
        passed,
        currentLevelIndex,
      };
    });
  }, [module]);

  const reset = useCallback(() => {
    const initial = buildInitialProgress(module);
    setProgress(initial);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(storageKey);
    }
  }, [module, storageKey]);

  return {
    module,
    levels,
    currentLevel,
    currentLevelIndex: progress.currentLevelIndex,
    totalLevels,
    progressPercent,
    totalScore: progress.totalScore,
    totalXp: progress.totalXp,
    isFirstLevel: progress.currentLevelIndex === 0,
    isLastLevel: progress.currentLevelIndex === totalLevels - 1,
    completed: progress.completed,
    passed: progress.passed,
    levelResults: progress.levelResults,
    goToNextLevel,
    goToPreviousLevel,
    goToLevel,
    completeLevel,
    reset,
  };
}