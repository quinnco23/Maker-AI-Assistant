import type { Express } from "express";

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


export function registerRoutes(app: Express): void {
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


}
