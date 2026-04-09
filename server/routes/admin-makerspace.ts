// server/routes/admin-makerspace.ts

import { getAdminMakerspaceByUserId } from "server/services.ts/admin-onboarding.service";

export function registerAdminMakerspaceRoutes(app: any) {
  app.get("/api/admin/makerspace", async (req: any, res: any) => {
    try {
      const userId = req.user?.id ?? "dev-user";

      const data = await getAdminMakerspaceByUserId(userId);

      if (!data) {
        return res.status(404).json({
          message: "No makerspace found for this admin",
        });
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error("Failed to load admin makerspace:", error);
      return res.status(500).json({
        message: "Failed to load admin makerspace",
      });
    }
  });
}