import { createId, nowIso } from "../db/schema";
import { storage } from "../storage";

export function registerMachineCertificationRoutes(app: any) {
    app.get("/api/admin/machines/:machineId/certification", async (req: any, res: any) => {
        try {
          const machineId = req.params.machineId;
          console.log("GET cert route machineId:", machineId);
      
          const machine = await storage.getMachineById(machineId);
          console.log("GET cert route machine:", machine);
      
          if (!machine) {
            return res.status(404).json({ message: "Machine not found" });
          }
      
          const machineCertification = await storage.getMachineCertificationByMachineId(machineId);
          console.log("GET cert route machineCertification:", machineCertification);
      
          let activeProgram = null;
      
          if (machineCertification) {
            activeProgram = await storage.getCertificationModuleById(
              machineCertification.certificationModuleId,
            );
          }
      
          console.log("GET cert route activeProgram:", activeProgram);
      
          const templates = [
            {
              id: "prusa-mk4s-operator-badge",
              title: "Prusa MK4S Operator Badge",
              description: "Beginner certification for safe Prusa MK4S operation.",
              machineTypes: ["3d_printer", "3D Printing"],
              estimatedMinutes: 8,
              passingScore: 80,
              levelsCount: 5,
              tags: ["3D Printing", "Beginner"],
            },
            {
              id: "laser-cutter-safety-core",
              title: "Laser Cutter Safety Core",
              description: "Safety-first laser cutter certification.",
              machineTypes: ["laser_cutter", "Laser"],
              estimatedMinutes: 12,
              passingScore: 85,
              levelsCount: 6,
              tags: ["Laser", "Safety"],
            },
            {
              id: "cnc-router-safety-core",
              title: "CNC Router Safety Core",
              description: "Intro certification for CNC router safety, setup, hold-downs, and emergency stop.",
              machineTypes: ["cnc_router", "CNC Router", "CNC"],
              estimatedMinutes: 15,
              passingScore: 85,
              levelsCount: 7,
              tags: ["CNC", "Router", "Safety"],
            },
            {
              id: "cnc-mill-basic-operator",
              title: "CNC Mill Basic Operator",
              description: "Beginner certification for CNC mill setup, workholding, tool awareness, and safe operation.",
              machineTypes: ["cnc_mill", "CNC Mill", "CNC"],
              estimatedMinutes: 18,
              passingScore: 85,
              levelsCount: 7,
              tags: ["CNC", "Mill", "Operator"],
            },
            {
              id: "waterjet-cutter-safety-core",
              title: "Waterjet Cutter Safety Core",
              description: "Safety certification for waterjet setup, material handling, piercing, and shutdown.",
              machineTypes: ["waterjet", "Waterjet Cutter"],
              estimatedMinutes: 15,
              passingScore: 85,
              levelsCount: 6,
              tags: ["Waterjet", "Safety"],
            },
            {
              id: "vinyl-cutter-basic-operator",
              title: "Vinyl Cutter Basic Operator",
              description: "Beginner certification for vinyl cutter setup, blade depth, material loading, and weeding.",
              machineTypes: ["vinyl_cutter", "Vinyl Cutter"],
              estimatedMinutes: 8,
              passingScore: 80,
              levelsCount: 4,
              tags: ["Vinyl", "Beginner"],
            },
            {
              id: "sewing-machine-basic-operator",
              title: "Sewing Machine Basic Operator",
              description: "Basic sewing machine certification for threading, needle safety, fabric handling, and cleanup.",
              machineTypes: ["sewing_machine", "Textiles"],
              estimatedMinutes: 10,
              passingScore: 80,
              levelsCount: 5,
              tags: ["Textiles", "Beginner"],
            },
            {
              id: "woodshop-tool-safety-core",
              title: "Woodshop Tool Safety Core",
              description: "General certification for woodshop PPE, dust collection, safe cuts, and tool readiness.",
              machineTypes: ["woodshop", "Table Saw", "Bandsaw", "Miter Saw"],
              estimatedMinutes: 15,
              passingScore: 85,
              levelsCount: 6,
              tags: ["Woodshop", "Safety"],
            },
          ];
      
          return res.status(200).json({
            machine,
            activeProgram,
            templates,
          });
        } catch (error) {
          console.error("Failed to load machine certification page:", error);
          return res.status(500).json({
            message: "Failed to load machine certification page",
          });
        }
      });

      app.post("/api/admin/machines/:machineId/certification", async (req: any, res: any) => {
        try {
          const machineId = req.params.machineId;
          const machine = await storage.getMachineById(machineId);
      
          if (!machine) {
            return res.status(404).json({ message: "Machine not found" });
          }
      
          const body = req.body;
          const now = nowIso();
      
          const machineCertification =
  await storage.getMachineCertificationByMachineId(machineId);

const existingModules =
  await storage.getCertificationModulesByMakerspaceId(
    machine.makerspaceId,
  );

const existing = existingModules.find(
  (module) => module.machineId === machineId
);

if (existing) {
  const updated = await storage.updateCertificationModule(existing.id, {
    title: body.title,
    description: body.description,
    sourceType: body.sourceType,
    sourceTemplateId: body.sourceTemplateId ?? null,
    estimatedMinutes: Number(body.estimatedMinutes ?? 10),
    passingScore: Number(body.passingScore ?? 80),
    expiresInDays: body.expiresInDays ?? null,
    isRequired: !!body.isRequired,
    status: body.status,
    contentJson: body.contentJson ?? existing.contentJson ?? null,
    isPublished: body.status === "published",
    updatedAt: now,
  });

            if (machineCertification) {
              await storage.updateMachineCertification(machineCertification.id, {
                required: !!body.isRequired,
              });
            }
      
            return res.status(200).json({ program: updated });
          }
      
          const program = {
            id: createId("certprog"),
            makerspaceId: machine.makerspaceId,
            machineId: machine.id,
            title: body.title || `${machine.name} Certification`,
            description: body.description || "",
            version: "1.0.0",
            sourceType: body.sourceType || "custom",
            sourceTemplateId: body.sourceTemplateId ?? null,
            status: body.status || "draft",
            passingScore: Number(body.passingScore ?? 80),
            estimatedMinutes: Number(body.estimatedMinutes ?? 10),
            expiresInDays: body.expiresInDays ?? null,
            isRequired: !!body.isRequired,
            contentJson: body.contentJson ?? null,
            isPublished: body.status === "published",
            createdAt: now,
            updatedAt: now,
          };
      
          await storage.createCertificationModule(program as any);
      
          await storage.createMachineCertification({
            id: createId("machinecert"),
            machineId: machine.id,
            certificationModuleId: program.id,
            required: !!body.isRequired,
            createdAt: now,

            
          });

          
      
          return res.status(201).json({ program });
        } catch (error) {
          console.error("Failed to save machine certification:", error);
          return res.status(500).json({
            message: "Failed to save machine certification",
          });
        }
      });

      app.get("/api/admin/certification-review-requests", async (req: any, res: any) => {
        try {
          const userId = req.session?.userId ?? req.user?.id;
      
          if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
          }
      
          const memberships = await storage.getMembershipsByUserId(userId);
      
          const adminMembership = memberships
            .filter((m: any) =>
              ["owner", "admin", "instructor"].includes(String(m.role).toLowerCase()),
            )
            .sort(
              (a: any, b: any) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
            )[0];
      
          if (!adminMembership) {
            return res.status(403).json({ message: "Admin access required" });
          }
      
          const requests =
            await storage.getCertificationReviewRequestsByMakerspaceId(
              adminMembership.makerspaceId,
            );
      
          return res.status(200).json({ requests });
        } catch (error) {
          console.error("Failed to load certification review requests:", error);
          return res.status(500).json({
            message:
              error instanceof Error
                ? error.message
                : "Failed to load certification review requests",
          });
        }
      });

      app.post(
        "/api/admin/certification-review-requests/:id/complete",
        async (req: any, res: any) => {
          try {
            const userId = req.session?.userId ?? req.user?.id;
      
            if (!userId) {
              return res.status(401).json({ message: "Unauthorized" });
            }
      
            const requestId = req.params.id;
      
            const request = await storage.getCertificationReviewRequestById(requestId);
      
            if (!request) {
              return res.status(404).json({ message: "Review request not found" });
            }
      
            const memberships = await storage.getMembershipsByUserId(userId);
      
            const adminMembership = memberships.find(
              (m: any) =>
                m.makerspaceId === request.makerspaceId &&
                ["owner", "admin", "instructor"].includes(
                  String(m.role).toLowerCase(),
                ) &&
                m.status === "active",
            );
      
            if (!adminMembership) {
              return res.status(403).json({ message: "Admin access required" });
            }
      
            const userCertification = await storage.getUserCertificationForReview({
              userId: request.userId,
              certificationModuleId: request.certificationModuleId,
              machineId: request.machineId,
            });
      
            if (!userCertification) {
              return res.status(404).json({
                message: "Matching user certification not found",
              });
            }
      
            const updatedReview =
              await storage.updateCertificationReviewRequestStatus(
                requestId,
                "completed",
              );
      
            const updatedCertification =
              await storage.updateUserCertificationStatus(
                userCertification.id,
                "active",
              );
      
            return res.status(200).json({
              reviewRequest: updatedReview,
              certification: updatedCertification,
            });
          } catch (error) {
            console.error("Failed to complete certification review:", error);
            return res.status(500).json({
              message:
                error instanceof Error
                  ? error.message
                  : "Failed to complete certification review",
            });
          }
        },
      );

      app.post(
        "/api/admin/certification-review-requests/:id/reject",
        async (req: any, res: any) => {
          try {
            const userId = req.session?.userId ?? req.user?.id;
      
            if (!userId) {
              return res.status(401).json({ message: "Unauthorized" });
            }
      
            const requestId = req.params.id;
      
            const request = await storage.getCertificationReviewRequestById(requestId);
      
            if (!request) {
              return res.status(404).json({ message: "Review request not found" });
            }
      
            const memberships = await storage.getMembershipsByUserId(userId);
      
            const adminMembership = memberships.find(
              (m: any) =>
                m.makerspaceId === request.makerspaceId &&
                ["owner", "admin", "instructor"].includes(
                  String(m.role).toLowerCase(),
                ) &&
                m.status === "active",
            );
      
            if (!adminMembership) {
              return res.status(403).json({ message: "Admin access required" });
            }
      
            const updatedReview =
              await storage.updateCertificationReviewRequestStatus(
                requestId,
                "rejected",
              );
      
            const userCertification = await storage.getUserCertificationForReview({
              userId: request.userId,
              certificationModuleId: request.certificationModuleId,
              machineId: request.machineId,
            });
      
            let updatedCertification = null;
      
            if (userCertification) {
              updatedCertification = await storage.updateUserCertificationStatus(
                userCertification.id,
                "revoked",
              );
            }
      
            return res.status(200).json({
              reviewRequest: updatedReview,
              certification: updatedCertification,
            });
          } catch (error) {
            console.error("Failed to reject certification review:", error);
            return res.status(500).json({
              message:
                error instanceof Error
                  ? error.message
                  : "Failed to reject certification review",
            });
          }
        },
      );
}