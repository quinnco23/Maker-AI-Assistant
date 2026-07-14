import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { nowIso } from "../../../server/db/schema.js";
import { storage } from "../../../server/storage.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  const machineId = req.query.machineId as string;

  if (req.method === "GET") {
    try {
      const machine = await storage.getMachineById(machineId);

      if (!machine) {
        return res.status(404).json({ message: "Machine not found" });
      }

      return res.status(200).json({ machine });
    } catch (error) {
      console.error("Failed to load machine:", error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to load machine",
      });
    }
  }

  if (req.method === "PATCH") {
    try {
      const updated = await storage.updateMachine(machineId, {
        ...req.body,
        updatedAt: nowIso(),
      });

      if (!updated) {
        return res.status(404).json({ message: "Machine not found" });
      }

      return res.status(200).json({ machine: updated });
    } catch (error) {
      console.error("Failed to update machine:", error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : "Failed to update machine",
      });
    }
  }

  res.setHeader("Allow", "GET, PATCH");
  return res.status(405).json({ message: "Method Not Allowed" });
}