import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

import { registerAdminOnboardingRoutes } from "./routes/admin-onboarding.ts";
import { registerAdminMakerspaceRoutes } from "./routes/admin-makerspace.ts";
import { registerMachineRoutes } from "./routes/machines.ts";
import { registerMachineCertificationRoutes } from "./routes/machine-certifications.ts";
import { registerJoinRoutes } from "./routes/join.ts";
import { registerMemberRoutes } from "./routes/member.ts";
import { registerKnowledgeRoutes } from "./routes/knowledge.ts";
import { registerAuthRoutes } from "./routes/auth.routes.ts";
import { registerScheduleCertificationRoutes } from "./routes/cert-scheduel.ts";


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
registerAuthRoutes(app);
registerScheduleCertificationRoutes(app);


  app.get("/api/users", async (_req, res) => {
    const users = await storage.getUsers();
    res.json(users);
    
  });

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  return httpServer;
}
