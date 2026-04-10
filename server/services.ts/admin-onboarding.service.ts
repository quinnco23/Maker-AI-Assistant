// server/services/admin-onboarding.service.ts

import {
  nowIso,
  createId,
  slugify,
  type AdminMakerspaceView,
  type CertificationMode,
  type CertificationModuleRecord,
  type MachineCertificationRecord,
  type MachineRecord,
  type MakerspaceMembershipRecord,
  type MakerspaceRecord,
  type UserRecord,
} from "../db/schema";

import { storage } from "../storage";

export type PublishOnboardingRequest = {
  makerspace: {
    name: string;
    slug?: string;
    location: string;
    description: string;
    website?: string;
    logoUrl?: string;
  };
  machine: {
    name: string;
    type: string;
    brand?: string;
    model?: string;
    locationLabel: string;
    description: string;
    imageUrl?: string;
    requiresCertification: boolean;
  };
  certification?: {
    mode: CertificationMode;
    templateId?: string;
    title?: string;
    estimatedMinutes?: number;
    passingScore?: number;
    contentJson?: unknown;
  };
};

export type PublishOnboardingResponse = {
  makerspaceId: string;
  machineId: string;
  certificationModuleId?: string;
  redirectTo: string;
};

type PublishAdminOnboardingInput = {
  userId: string;
  payload: PublishOnboardingRequest;
};

async function ensureUserExists(userId: string): Promise<UserRecord> {
  const existing = await storage.getUserById(userId);
  if (!existing) {
    throw new Error(
      "Authenticated user not found in database. Sync the user record before publishing."
    );
  }
  return existing;
}
async function uniqueMakerspaceSlug(base: string): Promise<string> {
  const normalized = slugify(base) || "makerspace";
  let candidate = normalized;
  let counter = 2;

  while (await storage.getMakerspaceBySlug(candidate)) {
    candidate = `${normalized}-${counter}`;
    counter += 1;
  }

  return candidate;
}

async function uniqueMachineSlug(
  makerspaceId: string,
  base: string,
): Promise<string> {
  const normalized = slugify(base) || "machine";
  let candidate = normalized;
  let counter = 2;

  const existingMachines = await storage.getMachinesByMakerspaceId(makerspaceId);

  while (existingMachines.some((m) => m.slug === candidate)) {
    candidate = `${normalized}-${counter}`;
    counter += 1;
  }

  return candidate;
}

export async function publishAdminOnboarding({
  userId,
  payload,
}: PublishAdminOnboardingInput): Promise<PublishOnboardingResponse> {
  if (!payload?.makerspace || !payload?.machine) {
    throw new Error("Missing required onboarding payload.");
  }

  await ensureUserExists(userId);

  const now = nowIso();

  const makerspace: MakerspaceRecord = {
    id: createId("ms"),
    name: payload.makerspace.name.trim(),
    slug: await uniqueMakerspaceSlug(
      payload.makerspace.slug || payload.makerspace.name,
    ),
    location: payload.makerspace.location.trim(),
    description: payload.makerspace.description.trim(),
    website: payload.makerspace.website?.trim() || undefined,
    logoUrl: payload.makerspace.logoUrl?.trim() || undefined,
    createdByUserId: userId,
    createdAt: now,
    updatedAt: now,
  };

  await storage.createMakerspace(makerspace);

  const membership: MakerspaceMembershipRecord = {
    id: createId("membership"),
    makerspaceId: makerspace.id,
    userId,
    role: "owner",
    status: "active",
    joinedAt: now,
    createdAt: now,
  };

  await storage.createMembership(membership);

  const machine: MachineRecord = {
    id: createId("machine"),
    makerspaceId: makerspace.id,
    name: payload.machine.name.trim(),
    slug: await uniqueMachineSlug(makerspace.id, payload.machine.name),
    type: payload.machine.type,
    brand: payload.machine.brand?.trim() || undefined,
    model: payload.machine.model?.trim() || undefined,
    locationLabel: payload.machine.locationLabel.trim(),
    description: payload.machine.description.trim(),
    imageUrl: payload.machine.imageUrl?.trim() || undefined,
    requiresCertification: payload.machine.requiresCertification,
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  await storage.createMachine(machine);

  let certificationModule: CertificationModuleRecord | undefined;
  let machineCertification: MachineCertificationRecord | undefined;

  if (
    machine.requiresCertification &&
    payload.certification &&
    payload.certification.mode !== "none"
  ) {
    certificationModule = {
      id: createId("certmod"),
      makerspaceId: makerspace.id,
      machineId: machine.id,
      title:
        payload.certification.title?.trim() ||
        `${machine.name} Certification`,
      mode: payload.certification.mode,
      templateId: payload.certification.templateId || null,
      contentJson: payload.certification.contentJson ?? null,
      estimatedMinutes: payload.certification.estimatedMinutes ?? null,
      passingScore: payload.certification.passingScore ?? null,
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    };

    await storage.createCertificationModule(certificationModule);

    machineCertification = {
      id: createId("machinecert"),
      machineId: machine.id,
      certificationModuleId: certificationModule.id,
      required: true,
      createdAt: now,
    };

    await storage.createMachineCertification(machineCertification);
  }

  return {
    makerspaceId: makerspace.id,
    machineId: machine.id,
    certificationModuleId: certificationModule?.id,
    redirectTo: "/app/admin/makerspace",
  };
}

export async function getAdminMakerspaceByUserId(
  userId: string,
): Promise<AdminMakerspaceView | null> {
  return storage.getAdminMakerspaceByUserId(userId);
}