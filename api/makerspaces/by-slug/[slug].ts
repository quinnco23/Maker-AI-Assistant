import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../../../server/storage.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const slug = req.query.slug as string;
    const makerspace = await storage.getMakerspaceBySlug(slug);

    if (!makerspace) {
      return res.status(404).json({ message: "Makerspace not found" });
    }

    return res.status(200).json({ makerspace });
  } catch (error) {
    console.error("Failed to load makerspace by slug:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to load makerspace",
    });
  }
}