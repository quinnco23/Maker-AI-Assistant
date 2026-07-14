import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../../../server/storage.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId =
    (req as any).user?.id ||
    (req.headers["x-dev-user-id"] as string | undefined) ||
    "dev-user";

  if (req.method === "GET") {
    try {
      const adminView = await storage.getAdminMakerspaceByUserId(userId);

      if (!adminView) {
        return res.status(404).json({ message: "No makerspace found" });
      }

      const approvals = await storage.getPendingCertificationApprovals(
        adminView.makerspace.id,
      );

      return res.status(200).json({ approvals });
    } catch (error) {
      console.error("Failed to load certification approvals:", error);
      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Failed to load certification approvals",
      });
    }
  }

  res.setHeader("Allow", "GET");
  return res.status(405).json({ message: "Method Not Allowed" });
}