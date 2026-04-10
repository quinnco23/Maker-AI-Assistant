import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";

import { publishAdminOnboarding } from "../../../server/services/admin-onboarding.service";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    // Temporary dev/prod fallback until real auth is wired
    const userId =
      (req as any).user?.id ||
      (req.headers["x-dev-user-id"] as string | undefined) ||
      "dev-user";

    const payload = req.body;

    if (!payload?.makerspace || !payload?.machine) {
      return res.status(400).json({
        message: "Missing required onboarding payload",
      });
    }

    const result = await publishAdminOnboarding({
      userId,
      payload,
    });

    return res.status(201).json(result);
  } catch (error) {
    console.error("Failed to publish onboarding:", error);

    const message =
      error instanceof Error ? error.message : "Failed to publish onboarding";

    return res.status(500).json({ message });
  }
}