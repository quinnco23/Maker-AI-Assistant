import { storage } from "../storage";

export function registerKnowledgeRoutes(app: any) {
  app.get("/api/member/knowledge", async (req: any, res: any) => {
    try {
      const userId = req.user?.id ?? "member-user";

      const memberships = await storage.getMembershipsByUserId(userId);
      const membership = memberships.find((m) => m.status === "active");

      if (!membership) {
        return res.status(404).json({ message: "No makerspace found" });
      }

      const articles = await storage.getKnowledgeArticlesByMakerspace(
        membership.makerspaceId
      );

      return res.json({ articles });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Failed to load knowledge" });
    }
  });
}