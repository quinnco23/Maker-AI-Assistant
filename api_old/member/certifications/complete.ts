import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createId, nowIso, type CertificationAttemptRecord, type UserCertificationRecord } from "../../../server/db/schema.js";
import { storage } from "../../../server/storage.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const userId =
      (req as any).user?.id ||
      (req.headers["x-dev-user-id"] as string | undefined) ||
      "member-user";

    const moduleId = req.query.moduleId as string;
    const body = req.body;

    const module = await storage.getCertificationModuleById(moduleId);

    if (!module) {
      return res.status(404).json({ message: "Certification module not found" });
    }

    const machineId = module.machineId ?? null;
    const previousAttempts = await storage.getCertificationAttemptsByUser(userId);
    const attemptNumber =
      previousAttempts.filter((a) => a.certificationModuleId === moduleId).length + 1;

    const score = Number(body.score ?? 0);
    const passed = !!body.passed;

    const attempt: CertificationAttemptRecord = {
      id: createId("attempt"),
      makerspaceId: module.makerspaceId,
      userId,
      certificationModuleId: moduleId,
      score,
      passed,
      attemptNumber,
      answersJson: body.answersJson ?? null,
      createdAt: nowIso(),
    };

    await storage.createCertificationAttempt(attempt);

    let awardedCertification: UserCertificationRecord | null = null;

    if (passed && machineId) {
      const existingCertification = await storage.getUserCertificationForMachine(
        userId,
        machineId,
      );

      if (existingCertification) {
        awardedCertification = await storage.updateUserCertification(
          existingCertification.id,
          {
            status: "active",
            earnedAt: nowIso(),
          },
        );
      } else {
        const newCertification: UserCertificationRecord = {
          id: createId("usercert"),
          makerspaceId: module.makerspaceId,
          userId,
          certificationModuleId: moduleId,
          machineId,
          status: "active",
          earnedAt: nowIso(),
          createdAt: nowIso(),
        };

        awardedCertification = await storage.createUserCertification(newCertification);
      }
    }

    return res.status(200).json({
      success: true,
      attempt,
      awardedCertification,
    });
  } catch (error) {
    console.error("Failed to complete certification:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to complete certification",
    });
  }
}