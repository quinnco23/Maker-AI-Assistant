export type CertificationModule = {
  id: string;
  machineId: string;
  version: string;
  title: string;
  subtitle?: string;
  estimatedMinutes: number;
  passingScore: number;
  theme?: {
    icon?: string;
    primaryLabel?: string;
    progressLabel?: string;
  };
  levels: CertificationLevel[];
  finalChallenge?: {
    id: string;
    title: string;
    xp: number;
    passingScore: number;
  };
};

export type CertificationLevel =
  | LessonLevel
  | ScenarioLevel
  | HotspotLevel
  | QuickCheckLevel
  | SortLevel;

export type BaseLevel = {
  id: string;
  type: CertificationLevel["type"];
  title: string;
  shortTitle: string;
  xp: number;
};

export type LessonLevel = BaseLevel & {
  type: "lesson";
  narrative: string[];
  callouts?: string[];
  keyTakeaways?: string[];
  media?: {
    kind: "image" | "video";
    url: string;
    alt: string;
  };
  ctaLabel?: string;
};

export type ScenarioLevel = BaseLevel & {
  type: "scenario";
  prompt: string;
  situation?: string;
  successMessage?: string;
  choices: {
    id: string;
    label: string;
    correct: boolean;
    feedback: string;
    points: number;
  }[];
};

export type HotspotLevel = BaseLevel & {
  type: "hotspot";
  prompt: string;
  imageUrl: string;
  imageAlt: string;
  requiredCorrect: number;
  hotspots: {
    id: string;
    x: number;
    y: number;
    label: string;
    correct: boolean;
    feedback: string;
  }[];
};

export type QuickCheckLevel = BaseLevel & {
  type: "quick_check";
  questions: {
    id: string;
    question: string;
    answers: {
      id: string;
      label: string;
      correct: boolean;
    }[];
    explanation: string;
  }[];
};

export type SortLevel = BaseLevel & {
  type: "sort";
  prompt: string;
  categories: string[];
  items: {
    id: string;
    label: string;
    correctCategory: string;
    feedback: string;
  }[];
};

export type LevelResult = {
  levelId: string;
  completed: boolean;
  correct?: boolean;
  scoreEarned: number;
  xpEarned: number;
  attempts: number;
  completedAt?: string;
  detail?: Record<string, unknown>;
};

export type CertificationProgress = {
  moduleId: string;
  currentLevelIndex: number;
  totalScore: number;
  totalXp: number;
  levelResults: Record<string, LevelResult>;
  passed: boolean;
  completed: boolean;
};

export type CompleteLevelPayload = {
  levelId: string;
  correct?: boolean;
  scoreEarned?: number;
  xpEarned?: number;
  detail?: Record<string, unknown>;
};

export type CertificationEngine = {
  module: CertificationModule;
  levels: CertificationLevel[];
  currentLevel: CertificationLevel | null;
  currentLevelIndex: number;
  totalLevels: number;
  progressPercent: number;
  totalScore: number;
  totalXp: number;
  isFirstLevel: boolean;
  isLastLevel: boolean;
  completed: boolean;
  passed: boolean;
  levelResults: Record<string, LevelResult>;
  goToNextLevel: () => void;
  goToPreviousLevel: () => void;
  goToLevel: (index: number) => void;
  completeLevel: (payload: CompleteLevelPayload) => void;
  reset: () => void;
};