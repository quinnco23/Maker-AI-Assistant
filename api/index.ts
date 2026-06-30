import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import { createServer } from "http";

import { setupAuth } from "../server/auth.ts";
import { registerRoutes } from "../server/routes.ts";

let appPromise: Promise<express.Express> | null = null;

async function createVercelApp() {
  const app = express();
  const httpServer = createServer(app);

  app.use(
    express.json({
      verify: (req: any, _res, buf) => {
        req.rawBody = buf;
      },
    }),
  );

  app.use(express.urlencoded({ extended: false }));

  setupAuth(app);

  await registerRoutes(httpServer, app);

  return app;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (!appPromise) {
      appPromise = createVercelApp();
    }

    const app = await appPromise;

    return app(req as any, res as any);
  } catch (error) {
    console.error("Vercel API crashed:", error);

    return res.status(500).json({
      message: "API crashed",
      error: error instanceof Error ? error.message : String(error),
    });
  }
}