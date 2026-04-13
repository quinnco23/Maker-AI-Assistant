import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createId, nowIso, type MakerspaceMembershipRecord, type UserRecord } from "../../../../server/db/schema.js";
import { storage } from "../../../../server/storage.js";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const slug = req.query.slug as string;
    const makerspace = await storage.getMakerspaceBySlug(slug);

    if (!makerspace) {
      return res.status(404).json({ message: "Makerspace not found" });
    }

    const userId =
      (req as any).user?.id ||
      (req.headers["x-dev-user-id"] as string | undefined) ||
      "member-user";

    let user = await storage.getUserById(userId);

    if (!user) {
      const now = nowIso();
      const fallbackUser: UserRecord = {
        id: userId,
        email: `${userId}@local.dev`,
        fullName: "Member User",
        createdAt: now,
        updatedAt: now,
      };
      user = await storage.createUser(fallbackUser);
    }

    const existingMembership = await storage.getMembershipByMakerspaceAndUser(
      makerspace.id,
      userId,
    );

    if (existingMembership) {
      return res.status(200).json({
        joined: true,
        alreadyJoined: true,
        makerspace,
        membership: existingMembership,
      });
    }

    const membership: MakerspaceMembershipRecord = {
      id: createId("membership"),
      makerspaceId: makerspace.id,
      userId,
      role: "member",
      status: "active",
      joinedAt: nowIso(),
      createdAt: nowIso(),
    };

    const createdMembership = await storage.createMembership(membership);

    return res.status(201).json({
      joined: true,
      alreadyJoined: false,
      makerspace,
      membership: createdMembership,
    });
  } catch (error) {
    console.error("Failed to join makerspace:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to join makerspace",
    });
  }
}