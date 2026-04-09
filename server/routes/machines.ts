import {
  createId,
  nowIso,
  slugify,
  type MachineRecord,
} from "../db/schema";

import { storage } from "../storage";

export function registerMachineRoutes(app: any) {
  /**
   * CREATE MACHINE
   * POST /api/admin/machines
   */
  app.post("/api/admin/machines", async (req: any, res: any) => {
    try {
      console.log("HIT POST /api/admin/machines");

      const userId = req.user?.id ?? "dev-user";
      const body = req.body;

      const adminView = await storage.getAdminMakerspaceByUserId(userId);

      if (!adminView) {
        return res.status(404).json({
          message: "No makerspace found for admin",
        });
      }

      const makerspaceId = adminView.makerspace.id;

      const existingMachines =
        await storage.getMachinesByMakerspaceId(makerspaceId);

      const baseSlug = slugify(body.name || "machine");
      let candidateSlug = baseSlug;
      let counter = 2;

      while (existingMachines.some((m) => m.slug === candidateSlug)) {
        candidateSlug = `${baseSlug}-${counter}`;
        counter += 1;
      }

      const now = nowIso();

      const machine: MachineRecord = {
        id: createId("machine"),
        makerspaceId,
        name: body.name?.trim() || "Unnamed Machine",
        slug: candidateSlug,
        type: body.type?.trim() || "other",
        brand: body.brand?.trim() || undefined,
        model: body.model?.trim() || undefined,
        locationLabel: body.locationLabel?.trim() || "Unassigned",
        description: body.description?.trim() || "",
        imageUrl: body.imageUrl?.trim() || undefined,
        requiresCertification: !!body.requiresCertification,
        status: "active",
        catalogSourceId:
          typeof body.catalogSourceId === "number" ? body.catalogSourceId : undefined,
        createdAt: now,
        updatedAt: now,
      };;

      await storage.createMachine(machine);

      return res.status(201).json({ machine });
    } catch (error) {
      console.error("Failed to create machine:", error);
      return res.status(500).json({
        message: "Failed to create machine",
      });
    }
  });

  /**
   * LIST MACHINES (for admin dashboard)
   * GET /api/admin/machines
   */
  app.get("/api/admin/machines", async (req: any, res: any) => {
    try {
      const userId = req.user?.id ?? "dev-user";

      const adminView = await storage.getAdminMakerspaceByUserId(userId);

      if (!adminView) {
        return res.status(404).json({
          message: "No makerspace found for admin",
        });
      }

      return res.status(200).json({
        machines: adminView.machines,
      });
    } catch (error) {
      console.error("Failed to load machines:", error);
      return res.status(500).json({
        message: "Failed to load machines",
      });
    }
  });

  /**
   * GET SINGLE MACHINE
   * GET /api/admin/machines/:machineId
   */
  app.get("/api/admin/machines/:machineId", async (req: any, res: any) => {
    try {
      const machineId = req.params.machineId;

      const machine = await storage.getMachineById(machineId);

      if (!machine) {
        return res.status(404).json({
          message: "Machine not found",
        });
      }

      return res.status(200).json({ machine });
    } catch (error) {
      console.error("Failed to load machine:", error);
      return res.status(500).json({
        message: "Failed to load machine",
      });
    }
  });

  /**
   * UPDATE MACHINE
   * PATCH /api/admin/machines/:machineId
   */
  app.patch("/api/admin/machines/:machineId", async (req: any, res: any) => {
    try {
      const machineId = req.params.machineId;
      const body = req.body;

      const updated = await storage.updateMachine(machineId, {
        name: body.name,
        type: body.type,
        brand: body.brand,
        model: body.model,
        locationLabel: body.locationLabel,
        description: body.description,
        requiresCertification: body.requiresCertification,
        status: body.status,
        updatedAt: nowIso(),
      });

      if (!updated) {
        return res.status(404).json({
          message: "Machine not found",
        });
      }

      return res.status(200).json({
        machine: updated,
      });
    } catch (error) {
      console.error("Failed to update machine:", error);
      return res.status(500).json({
        message: "Failed to update machine",
      });
    }
  });

  /**
   * DELETE MACHINE (optional next step)
   */
  app.delete("/api/admin/machines/:machineId", async (req: any, res: any) => {
    try {
      const machineId = req.params.machineId;

      const success = await storage.deleteMachine(machineId);

      if (!success) {
        return res.status(404).json({
          message: "Machine not found",
        });
      }

      return res.status(200).json({
        success: true,
      });
    } catch (error) {
      console.error("Failed to delete machine:", error);
      return res.status(500).json({
        message: "Failed to delete machine",
      });
    }
  });
}