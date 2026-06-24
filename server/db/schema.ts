export type UserRole = "owner" | "admin" | "instructor" | "member";
export type MembershipStatus = "active" | "pending" | "invited" | "suspended";
export type MachineStatus = "active" | "inactive" | "maintenance";
export type CertificationMode = "template" | "duplicate" | "custom" | "none";
export type UserCertificationStatus = " pending _review| active" | "expired" | "revoked";

export type CertificationContent = {
  id: string;
  title: string;
  subtitle?: string;
  machineType?: string;
  version: string;
  passingScore: number;
  estimatedMinutes: number;
  levels: CertificationLevel[];
};

export type CertificationLevel =
  | LessonLevel
  | ScenarioLevel
  | HotspotLevel
  | QuickCheckLevel;

export type LessonLevel = {
  id: string;
  type: "lesson";
  title: string;
  shortTitle: string;
  xp: number;
  narrative: string[];
  media?: {
    kind: "image";
    url: string;
    alt: string;
  };
  keyTakeaways?: string[];
  callouts?: string[];
  ctaLabel?: string;
};

export type ScenarioLevel = {
  id: string;
  type: "scenario";
  title: string;
  shortTitle: string;
  xp: number;
  prompt: string;
  situation?: string;
  choices: Array<{
    id: string;
    label: string;
    isCorrect: boolean;
    feedback: string;
  }>;
};

export type HotspotLevel = {
  id: string;
  type: "hotspot";
  title: string;
  shortTitle: string;
  xp: number;
  prompt: string;
  imageUrl: string;
  imageAlt: string;
  hotspots: Array<{
    id: string;
    x: number;
    y: number;
    radius?: number;
    label: string;
    isCorrect: boolean;
    feedback?: string;
  }>;
  minCorrect?: number;
};

export type QuickCheckLevel = {
  id: string;
  type: "quick_check";
  title: string;
  shortTitle: string;
  xp: number;
  questions: Array<{
    id: string;
    prompt: string;
    choices: Array<{
      id: string;
      label: string;
      isCorrect: boolean;
    }>;
    explanation?: string;
  }>;
};

export type UserRecord = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  bio?: string | null;
  phone?: string | null;
};

export type MakerspaceRecord = {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  website?: string;
  logoUrl?: string;
  createdByUserId: string;
  createdAt: string;
  updatedAt: string;
  onboardingCompleted?: boolean;
onboardingCompletedAt?: string | null;
};

export type MakerspaceMembershipRecord = {
  id: string;
  makerspaceId: string;
  userId: string;
  role: UserRole;
  status: MembershipStatus;
  joinedAt?: string;
  createdAt: string;
};

export type MakerspaceInviteRecord = {
  id: string;
  makerspaceId: string;
  email?: string;
  token: string;
  invitedByUserId: string;
  role: Extract<UserRole, "admin" | "instructor" | "member">;
  status: "pending" | "accepted" | "expired" | "revoked";
  expiresAt?: string;
  createdAt: string;
};

export type MachineRecord = {
  id: string;
  makerspaceId: string;
  name: string;
  slug: string;
  type: string;
  brand?: string;
  model?: string;
  locationLabel: string;
  description: string;
  imageUrl?: string;
  requiresCertification: boolean;
  status: MachineStatus;
  catalogSourceId?: number;
  createdAt: string;
  updatedAt: string;
};


export type CertificationModuleRecord = {
  id: string;
  makerspaceId: string;
  machineId?: string | null;
  title: string;
  description?: string;
  version?: string;
  sourceType?: "template" | "custom";
  sourceTemplateId?: string | null;
  status?: "draft" | "published" | "archived";
  contentJson?: CertificationContent;
  estimatedMinutes?: number | null;
  passingScore?: number | null;
  expiresInDays?: number | null;
  isRequired?: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  
};

export type MachineCertificationRecord = {
  id: string;
  machineId: string;
  certificationModuleId: string;
  required: boolean;
  createdAt: string;
};

export type CertificationAttemptRecord = {
  id: string;
  makerspaceId: string;
  userId: string;
  certificationModuleId: string;
  score: number;
  passed: boolean;
  attemptNumber: number;
  answersJson?: unknown;
  createdAt: string;
};

export type UserCertificationRecord = {
  id: string;
  makerspaceId: string;
  userId: string;
  certificationModuleId: string;
  machineId?: string | null;
  status: UserCertificationStatus;
  earnedAt: string;
  expiresAt?: string;
  createdAt: string;
};

export type AdminMakerspaceView = {
  makerspace: MakerspaceRecord;
  machines: MachineRecord[];
  members: Array<{
    id: string;
    userId: string;
    fullName: string;
    email: string;
    role: UserRole;
    status: MembershipStatus;
    joinedAt?: string;
  }>;
};

export type KnowledgeArticleRecord = {
  id: string;
  makerspaceId: string;
  title: string;
  content: string;
  machineId?: string | null;
  tags: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  createdAt: string;
  updatedAt: string;
};

export function nowIso(): string {
  return new Date().toISOString();
}

export function createId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 10);
  return `${prefix}_${Date.now()}_${rand}`;
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}