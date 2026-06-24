import { createId, nowIso, type CertificationAttemptRecord, type UserCertificationRecord } from "../db/schema";
import { storage } from "../storage";

function getCertificationStatus(args: {
  requiresCertification: boolean;
  userCertification: any | null;
}) {
  const { requiresCertification, userCertification } = args;

  if (!requiresCertification) return "not_required";
  if (!userCertification) return "not_certified";
  if (userCertification.status === "pending_review") return "pending_review";

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
      const userId = req.session?.userId ?? req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

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

const machineCertifications =
  await storage.getMachineCertificationsByMakerspaceId(makerspace.id);

const modules =
  await storage.getCertificationModulesByMakerspaceId(makerspace.id);

const userCertifications =
  await storage.getUserCertificationsByUser(userId);

const machinesWithStatus = machines.map((machine) => {
  userCertifications.find((cert) => cert.machineId === machine.id) ?? null;
  const machineCert = machineCertifications.find(
    (mc) => mc.machineId === machine.id,
  );
  
  const requiresCertification = machineCert
  ? machineCert.required
  : false;

  const certificationProgram = machineCert
    ? modules.find((m) => m.id === machineCert.certificationModuleId) ?? null
    : null;

    const userCertification =
    userCertifications.find((cert) => cert.machineId === machine.id) ??
    userCertifications.find(
      (cert) =>
        certificationProgram &&
        cert.certificationModuleId === certificationProgram.id,
    ) ??
    null;

  return {
    ...machine,
    certificationProgram: certificationProgram
      ? {
          id: certificationProgram.id,
          title: certificationProgram.title,
          status: certificationProgram.status,
          passingScore: certificationProgram.passingScore,
          estimatedMinutes: certificationProgram.estimatedMinutes,
          updatedAt: certificationProgram.updatedAt,
        }
      : null,
    certificationStatus: getCertificationStatus({
      requiresCertification,
      userCertification,
    }),
  };
});

const earnedCertifications = userCertifications
  .filter((cert) =>
    ["active", "pending_review"].includes(cert.status),
  )
  .map((cert) => {
    const machine = machines.find((m) => m.id === cert.machineId);
    const module = modules.find((m) => m.id === cert.certificationModuleId);

    return {
      id: cert.id,
      certificationModuleId: cert.certificationModuleId,
      machineId: cert.machineId,
      machineName: machine?.name ?? "Unknown Machine",
      certificationTitle: module?.title ?? "Certification",
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
      
     
    } catch (error) {
      console.error("Failed to load member makerspace:", error);
      return res.status(500).json({
        message: "Failed to load member makerspace",
      });
    }
  });

  app.get("/api/member/machines/:machineId", async (req: any, res: any) => {
    try {
      const userId = req.session?.userId ?? req.user?.id;
  
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
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
  
      const requiresCertification = machineCertification
        ? machineCertification.required
        : false;
  
      const certificationStatus = getCertificationStatus({
        requiresCertification,
        userCertification,
      });
  
      const canUseMachine =
        certificationStatus === "certified" ||
        certificationStatus === "not_required";
  
      const lockReason =
        certificationStatus === "pending_review"
          ? "Pending staff review before machine access."
          : certificationStatus === "expired"
            ? "Certification expired. Renewal is required."
            : certificationStatus === "not_certified"
              ? "Certification required before machine access."
              : null;
  
      return res.status(200).json({
        machine: {
          ...machine,
          requiresCertification,
        },
        certificationProgram,
        certificationStatus,
        canUseMachine,
        lockReason,
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
      const userId = req.session?.userId ?? req.user?.id;

if (!userId) {
  return res.status(401).json({ message: "Unauthorized" });
}

if (!userId) {
  return res.status(401).json({ message: "Unauthorized" });
}
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
              status: "pending_review",
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
            status: "pending_review",
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
  app.get("/api/member/certifications/:moduleId", async (req, res) => {
    try {
      const moduleId = req.params.moduleId;
      const module = await storage.getCertificationModuleById(moduleId);
  
      if (!module) {
        return res.status(404).json({ message: "Certification module not found" });
      }
  
      return res.status(200).json({ module });
    } catch (error) {
      console.error("Failed to load certification module:", error);
      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Failed to load certification module",
      });
    }
  });

  app.get("/api/member/review-staff", async (req: any, res: any) => {
    const userId = req.session?.userId ?? req.user?.id;
  
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const memberships = await storage.getMembershipsByUserId(userId);
    const memberMembership = memberships.find(
      (m) => m.role === "member" && m.status === "active",
    );
  
    if (!memberMembership) {
      return res.status(404).json({ message: "No member makerspace found" });
    }
  
    const staff = await storage.getStaffReviewersByMakerspaceId(
      memberMembership.makerspaceId,
    );
  
    return res.status(200).json({ staff });
  });

  app.get("/api/member/profile", async (req: any, res: any) => {
    try {
      const userId = req.session?.userId ?? req.user?.id;
  
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const user = await storage.getUserById(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const memberships = await storage.getMembershipsByUserId(userId);
  
      const memberMembership = memberships
        .filter(
          (m: any) =>
            String(m.role).toLowerCase() === "member" &&
            m.status === "active",
        )
        .sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0];
  
      if (!memberMembership) {
        return res.status(404).json({
          message: "No active member makerspace found",
        });
      }
  
      const makerspace = await storage.getMakerspaceById(
        memberMembership.makerspaceId,
      );
  
      if (!makerspace) {
        return res.status(404).json({ message: "Makerspace not found" });
      }
  
      const machines = await storage.getMachinesByMakerspaceId(makerspace.id);
      const modules = await storage.getCertificationModulesByMakerspaceId(
        makerspace.id,
      );
      const userCertifications = await storage.getUserCertificationsByUser(userId);
      const reviewRequests =
        await storage.getCertificationReviewRequestsByUser(userId);
      const bookings = await storage.getMachineBookingsByUser(userId);
      const announcements =
        await storage.getPublishedAnnouncementsByMakerspaceId(makerspace.id);
  
      const certifications = userCertifications.map((cert: any) => {
        const machine = machines.find((m: any) => m.id === cert.machineId);
        const module = modules.find(
          (m: any) => m.id === cert.certificationModuleId,
        );
  
        return {
          id: cert.id,
          certificationModuleId: cert.certificationModuleId,
          certificationTitle: module?.title ?? "Certification",
          machineId: cert.machineId,
          machineName: machine?.name ?? "Unknown Machine",
          status: cert.status,
          earnedAt: cert.earnedAt,
          expiresAt: cert.expiresAt,
          createdAt: cert.createdAt,
        };
      });
  
      const pendingCertifications = certifications.filter(
        (cert: any) => cert.status === "pending_review",
      );
  
      const completedCertifications = certifications.filter(
        (cert: any) => cert.status === "active",
      );
  
      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl ?? null,
          bio: user.bio ?? "",
          phone: user.phone ?? "",
        },
        makerspace,
        certifications,
        pendingCertifications,
        completedCertifications,
        reviewRequests,
        bookings,
        announcements,
        machines,
      });
    } catch (error) {
      console.error("Failed to load member profile:", error);
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Failed to load member profile",
      });
    }
  });

  app.patch("/api/member/profile", async (req: any, res: any) => {
    try {
      const userId = req.session?.userId ?? req.user?.id;
  
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const updated = await storage.updateUser(userId, {
        fullName: req.body.fullName,
        avatarUrl: req.body.avatarUrl,
        bio: req.body.bio,
        phone: req.body.phone,
        updatedAt: nowIso(),
      });
  
      return res.status(200).json({ user: updated });
    } catch (error) {
      console.error("Failed to update member profile:", error);
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Failed to update member profile",
      });
    }
  });
}