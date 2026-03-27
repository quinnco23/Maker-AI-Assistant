

type PublishOnboardingRequest = {
    makerspace: {
      name: string;
      slug: string;
      location: string;
      description: string;
      website?: string;
    };
    machine: {
      name: string;
      type: string;
      brand?: string;
      model?: string;
      locationLabel: string;
      description: string;
      requiresCertification: boolean;
    };
    certification?: {
      mode: "template" | "duplicate" | "custom" | "none";
      templateId?: string;
      title?: string;
      estimatedMinutes?: number;
      passingScore?: number;
    };
  };

  type PublishOnboardingRequest = {
    makerspace: {
      name: string;
      slug: string;
      location: string;
      description: string;
      website?: string;
    };
    machine: {
      name: string;
      type: string;
      brand?: string;
      model?: string;
      locationLabel: string;
      description: string;
      requiresCertification: boolean;
    };
    certification?: {
      mode: "template" | "duplicate" | "custom" | "none";
      templateId?: string;
      title?: string;
      estimatedMinutes?: number;
      passingScore?: number;
    };
  };


  app.post("/api/admin/onboarding/publish", async (req, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const payload = req.body;
  
      // validate payload here
  
      const result = await publishAdminOnboarding({
        userId,
        payload,
      });
  
      return res.status(201).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to publish onboarding" });
    }
  });

  await fetch("/api/admin/onboarding/publish", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(onboarding),
  });



export function registerAdminOnboardingRoutes(app: Express) {
  app.post("/api/admin/onboarding/publish", async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const payload = req.body;

      const result = await publishAdminOnboarding({
        userId,
        payload,
      });

      return res.status(201).json(result);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to publish onboarding" });
    }
  });
}