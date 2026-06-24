import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../../../../server/storage";
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const moduleId = req.query.moduleId as string;

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
}