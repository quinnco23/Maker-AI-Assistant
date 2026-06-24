import { createId, nowIso, type MakerspaceMembershipRecord, type UserRecord } from "../db/schema";
import { storage } from "../storage";

export function registerJoinRoutes(app: any) {
  app.get("/api/makerspaces/by-slug/:slug", async (req: any, res: any) => {
    try {
      const slug = req.params.slug;
      const makerspace = await storage.getMakerspaceBySlug(slug);

      if (!makerspace) {
        return res.status(404).json({
          message: "Makerspace not found",
        });
      }

      return res.status(200).json({
        makerspace,
      });
    } catch (error) {
      console.error("Failed to load makerspace by slug:", error);
      return res.status(500).json({
        message: "Failed to load makerspace",
      });
    }
  });

  app.post("/api/makerspaces/by-slug/:slug/join", async (req: any, res: any) => {
    try {
      const slug = req.params.slug;
      const makerspace = await storage.getMakerspaceBySlug(slug);

      if (!makerspace) {
        return res.status(404).json({
          message: "Makerspace not found",
        });
      }

      // Temporary dev fallback until auth is fully wired
      const userId = req.session?.userId ?? req.user?.id ?? "member-user";

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
        message: "Failed to join makerspace",
      });
    }
  });
}