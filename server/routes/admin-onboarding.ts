import { publishAdminOnboarding } from "server/services/admin-onboarding.service";
import { storage } from "server/storage";

export function registerAdminOnboardingRoutes(app: any) {
  app.post("/api/admin/onboarding/publish", async (req: any, res: any) => {
    try {
      const userId = req.session?.userId ?? req.user?.id;
      const payload = req.body;

      const result = await publishAdminOnboarding({
        userId,
        payload,
      });

      console.log("Onboarding publish result:", result);
      console.log("Marking onboarding complete for:", result.makerspaceId);
      console.log("HIT THIS ONBOARDING PUBLISH ROUTE");
      

      await storage.markMakerspaceOnboardingComplete(result.makerspaceId);

      return res.status(201).json({
        ...result,
        onboardingCompleted: true,
      });
    } catch (error) {
      console.error("Failed to publish onboarding:", error);
      return res.status(500).json({
        message: "Failed to publish onboarding",
      });
    }
  });
}