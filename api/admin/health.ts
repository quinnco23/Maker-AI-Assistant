import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../../server/storage";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const userId =
      (req as any).user?.id ||
      (req.headers["x-dev-user-id"] as string | undefined) ||
      "dev-user";

    const data = await storage.getAdminMakerspaceByUserId(userId);

    if (!data) {
      return res.status(404).json({ message: "No makerspace found" });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Failed to load makerspace:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to load makerspace",
    });
  }
}