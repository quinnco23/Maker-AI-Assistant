import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

import { registerAdminOnboardingRoutes } from "./routes/admin-onboarding";
import { registerAdminMakerspaceRoutes } from "./routes/admin-makerspace";
import { registerMachineRoutes } from "./routes/machines";
import { registerMachineCertificationRoutes } from "./routes/machine-certifications";
import { registerJoinRoutes } from "./routes/join";
import { registerMemberRoutes } from "./routes/member";
import { registerKnowledgeRoutes } from "./routes/knowledge";


export async function registerRoutes(
  httpServer: Server,
  app: Express
  
): Promise<Server> {
  registerAdminOnboardingRoutes(app);
registerAdminMakerspaceRoutes(app);
registerMachineRoutes(app);
registerMachineCertificationRoutes(app);
registerJoinRoutes(app);
registerMemberRoutes(app);
registerKnowledgeRoutes(app);


  app.get("/api/users", async (_req, res) => {
    const users = await storage.getUsers();
    res.json(users);
    
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return httpServer;
}
