import { createId, nowIso, type CertificationAttemptRecord, type UserCertificationRecord } from "../db/schema";
import { storage } from "../storage";

function getCertificationStatus(args: {
  requiresCertification: boolean;
  userCertification: any | null;
}) {
  const { requiresCertification, userCertification } = args;

  if (!requiresCertification) return "not_required";
  if (!userCertification) return "not_certified";

  if (userCertification.status === "expired") {
    return "expired";
  }

  if (userCertification.status === "active") {
    return "certified";
  }

  return "not_certified";
}

export function registerMemberRoutes(app: any) {
  app.get("/api/member/makerspace", async (req: any, res: any) => {
    try {
      const userId = req.user?.id ?? "member-user";

      const memberships = await storage.getMembershipsByUserId(userId);
      const activeMembership = memberships.find(
        (membership) =>
          membership.role === "member" && membership.status === "active",
      );

      if (!activeMembership) {
        return res.status(404).json({
          message: "No active makerspace membership found",
        });
      }

      const makerspace = await storage.getMakerspaceById(activeMembership.makerspaceId);

      if (!makerspace) {
        return res.status(404).json({
          message: "Makerspace not found",
        });
      }

      const machines = await storage.getMachinesByMakerspaceId(makerspace.id);
      const userCertifications = await storage.getUserCertificationsByUser(userId);

      const machinesWithStatus = machines.map((machine) => {
        const userCertification =
          userCertifications.find((cert) => cert.machineId === machine.id) ?? null;
      
        return {
          ...machine,
          certificationStatus: getCertificationStatus({
            requiresCertification: machine.requiresCertification,
            userCertification,
          }),
        };
      });
      
      const earnedCertifications = userCertifications
        .filter((cert) => cert.status === "active")
        .map((cert) => {
          const machine = machines.find((m) => m.id === cert.machineId);
      
          return {
            id: cert.id,
            machineId: cert.machineId,
            machineName: machine?.name ?? "Unknown Machine",
            earnedAt: cert.earnedAt,
            expiresAt: cert.expiresAt ?? null,
            status: cert.status,
          };
        });
      
      return res.status(200).json({
        makerspace,
        machines: machinesWithStatus,
        earnedCertifications,
      });

      return res.status(200).json({
        makerspace,
        machines: machinesWithStatus,
      });
    } catch (error) {
      console.error("Failed to load member makerspace:", error);
      return res.status(500).json({
        message: "Failed to load member makerspace",
      });
    }
  });

  app.get("/api/member/machines/:machineId", async (req: any, res: any) => {
    try {
      const userId = req.user?.id ?? "member-user";
      const machineId = req.params.machineId;

      const machine = await storage.getMachineById(machineId);

      if (!machine) {
        return res.status(404).json({
          message: "Machine not found",
        });
      }

      const machineCertification =
        await storage.getMachineCertificationByMachineId(machineId);

      let certificationProgram = null;

      if (machineCertification) {
        certificationProgram = await storage.getCertificationModuleById(
          machineCertification.certificationModuleId,
        );
      }

      const userCertification = await storage.getUserCertificationForMachine(
        userId,
        machineId,
      );

      const certificationStatus = getCertificationStatus({
        requiresCertification: machine.requiresCertification,
        userCertification,
      });

      return res.status(200).json({
        machine,
        certificationProgram,
        certificationStatus,
      });
    } catch (error) {
      console.error("Failed to load member machine detail:", error);
      return res.status(500).json({
        message: "Failed to load member machine detail",
      });
    }
  });
  app.post("/api/member/certifications/:moduleId/complete", async (req: any, res: any) => {
    try {
      const userId = req.user?.id ?? "member-user";
      const moduleId = req.params.moduleId;
      const body = req.body;
  
      const module = await storage.getCertificationModuleById(moduleId);
  
      if (!module) {
        return res.status(404).json({
          message: "Certification module not found",
        });
      }
  
      const machineId = module.machineId ?? null;
  
      const previousAttempts = await storage.getCertificationAttemptsByUser(userId);
      const attemptNumber =
        previousAttempts.filter((attempt) => attempt.certificationModuleId === moduleId).length + 1;
  
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
        message: "Failed to complete certification",
      });
    }
  });
}