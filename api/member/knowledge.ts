import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../../server/storage.js";

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
      "member-user";

    const memberships = await storage.getMembershipsByUserId(userId);
    const membership = memberships.find((m) => m.status === "active");

    if (!membership) {
      return res.status(404).json({ message: "No makerspace found" });
    }

    const articles = await storage.getKnowledgeArticlesByMakerspace(
      membership.makerspaceId,
    );

    return res.status(200).json({ articles });
  } catch (error) {
    console.error("Failed to load knowledge:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to load knowledge",
    });
  }
}