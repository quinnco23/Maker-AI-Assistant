import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createId, nowIso } from "../../../../server/db/schema.js";
import { storage } from "../../../../server/storage.js";

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

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const machineId = req.query.machineId as string;

  if (req.method === "GET") {
    try {
      const machine = await storage.getMachineById(machineId);
      if (!machine) return res.status(404).json({ message: "Machine not found" });

      const machineCertification = await storage.getMachineCertificationByMachineId(machineId);

      let activeProgram = null;
      if (machineCertification) {
        activeProgram = await storage.getCertificationModuleById(
          machineCertification.certificationModuleId,
        );
      }

      return res.status(200).json({
        machine,
        activeProgram,
        templates,
      });
    } catch (error) {
      console.error("Failed to load machine certification page:", error);
      return res.status(500).json({
        message:
          error instanceof Error ? error.message : "Failed to load machine certification page",
      });
    }
  }

  if (req.method === "POST") {
    try {
      const machine = await storage.getMachineById(machineId);
      if (!machine) return res.status(404).json({ message: "Machine not found" });

      const body = req.body;
      const now = nowIso();

      const machineCertification = await storage.getMachineCertificationByMachineId(machineId);
      let existingProgram = null;

      if (machineCertification) {
        existingProgram = await storage.getCertificationModuleById(
          machineCertification.certificationModuleId,
        );
      }

      if (existingProgram) {
        const updated = await storage.updateCertificationModule(existingProgram.id, {
          title: body.title,
          description: body.description,
          sourceType: body.sourceType,
          sourceTemplateId: body.sourceTemplateId ?? null,
          estimatedMinutes: Number(body.estimatedMinutes ?? 10),
          passingScore: Number(body.passingScore ?? 80),
          expiresInDays: body.expiresInDays ?? null,
          isRequired: !!body.isRequired,
          status: body.status,
          isPublished: body.status === "published",
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
        message: error instanceof Error ? error.message : "Failed to save machine certification",
      });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ message: "Method Not Allowed" });
}