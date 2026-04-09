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
              description: "Gamified beginner certification for Prusa MK4S safe use.",
              machineTypes: ["3d_printer", "3D Printing"],
              estimatedMinutes: 8,
              passingScore: 80,
              levelsCount: 5,
              tags: ["3D Printing", "Beginner", "Gamified"],
            },
            {
              id: "laser-cutter-safety-core",
              title: "Laser Cutter Safety Core",
              description: "Safety-first laser certification program.",
              machineTypes: ["laser_cutter", "Laser"],
              estimatedMinutes: 10,
              passingScore: 85,
              levelsCount: 6,
              tags: ["Laser", "Safety"],
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

      const existingModules = await storage.getCertificationModulesByMakerspaceId(
        machine.makerspaceId,
      );

      const existing = existingModules.find((module) => module.machineId === machineId);

      if (existing) {
        const updated = await storage.updateCertificationModule(existing.id, {
          title: body.title,
          description: body.description,
          mode: body.sourceType,
          templateId: body.sourceTemplateId ?? null,
          estimatedMinutes: body.estimatedMinutes,
          passingScore: body.passingScore,
          expiresInDays: body.expiresInDays ?? null,
          isRequired: body.isRequired,
          status: body.status,
          updatedAt: now,
        });

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
        contentJson: null,
        isPublished: body.status === "published",
        createdAt: now,
        updatedAt: now,
      };

      await storage.createCertificationModule(program as any);

      return res.status(201).json({ program });
    } catch (error) {
      console.error("Failed to save machine certification:", error);
      return res.status(500).json({
        message: "Failed to save machine certification",
      });
    }
  });
}