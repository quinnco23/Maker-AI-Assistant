// server/db/schema.ts

export type UserRole = "owner" | "admin" | "instructor" | "member";
export type MembershipStatus = "active" | "pending" | "invited" | "suspended";
export type MachineStatus = "active" | "inactive" | "maintenance";
export type CertificationMode = "template" | "duplicate" | "custom" | "none";
export type UserCertificationStatus = "active" | "expired" | "revoked";

export type UserRecord = {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
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
  mode: CertificationMode;
  templateId?: string | null;
  contentJson?: unknown;
  estimatedMinutes?: number | null;
  passingScore?: number | null;
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
  machineId?: string | null;
  title: string;
  description?: string;
  version?: string;
  sourceType?: "template" | "duplicate" | "custom";
  sourceTemplateId?: string | null;
  status?: "draft" | "published" | "archived";
  contentJson?: unknown;
  estimatedMinutes?: number | null;
  passingScore?: number | null;
  expiresInDays?: number | null;
  isRequired?: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
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