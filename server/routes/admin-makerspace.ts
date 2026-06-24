// server/routes/admin-makerspace.ts
import { storage } from "server/storage";
import {  nowIso } from "../../server/db/schema.js";

import { getAdminMakerspaceByUserId } from "server/services/admin-onboarding.service";

export function registerAdminMakerspaceRoutes(app: any) {
  app.get("/api/admin/makerspace", async (req: any, res: any) => {
    try {
      const userId = req.session?.userId ?? req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

console.log("ADMIN MAKERSPACE SESSION USER:", req.session?.userId);
console.log("ADMIN MAKERSPACE REQ USER:", req.user?.id);
console.log("ADMIN MAKERSPACE USING USER:", userId);

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

  app.patch("/api/admin/makerspace", async (req: any, res: any) => {
    try {
      const userId = req.session?.userId ?? req.user?.id;
  
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      const adminView = await storage.getAdminMakerspaceByUserId(userId);
  
      if (!adminView) {
        return res.status(404).json({ message: "No makerspace found" });
      }
  
      const updated = await storage.updateMakerspace(adminView.makerspace.id, {
        name: req.body.name,
        location: req.body.location,
        website: req.body.website,
        description: req.body.description,
        logoUrl: req.body.logoUrl,
        updatedAt: nowIso(),
      });
  
      return res.status(200).json({ makerspace: updated });
    } catch (error) {
      console.error("Failed to update makerspace:", error);
      return res.status(500).json({
        message: "Failed to update makerspace",
      });
    }
  });
  
}