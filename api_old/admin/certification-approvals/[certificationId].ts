import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../../../server/storage.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const certificationId = req.query.certificationId as string;

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const body = req.body;
    const action = body.action as "approve" | "revoke";

    if (!["approve", "revoke"].includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const status = action === "approve" ? "active" : "revoked";

    const updated = await storage.updateUserCertificationStatus(
      certificationId,
      status,
    );

    return res.status(200).json({ certification: updated });
  } catch (error) {
    console.error("Failed to update certification approval:", error);
    return res.status(500).json({
      message:
        error instanceof Error
          ? error.message
          : "Failed to update certification approval",
    });
  }
}