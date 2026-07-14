import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import {
  createId,
  nowIso,
  slugify,
  type MachineRecord,
} from "../../../server/db/schema.js";
import { storage } from "../../../server/storage.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const userId =
    (req as any).user?.id ||
    (req.headers["x-dev-user-id"] as string | undefined) ||
    "dev-user";

  if (req.method === "GET") {
    try {
      const adminView = await storage.getAdminMakerspaceByUserId(userId);

      if (!adminView) {
        return res.status(404).json({ message: "No makerspace found for admin" });
      }

      return res.status(200).json({ machines: adminView.machines });
    } catch (error) {
      console.error("Failed to load machines:", error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to load machines",
      });
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body;
      const adminView = await storage.getAdminMakerspaceByUserId(userId);

      if (!adminView) {
        return res.status(404).json({ message: "No makerspace found for admin" });
      }

      const makerspaceId = adminView.makerspace.id;
      const existingMachines = await storage.getMachinesByMakerspaceId(makerspaceId);

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
      };

      await storage.createMachine(machine);
      return res.status(201).json({ machine });
    } catch (error) {
      console.error("Failed to create machine:", error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to create machine",
      });
    }
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).json({ message: "Method Not Allowed" });
}