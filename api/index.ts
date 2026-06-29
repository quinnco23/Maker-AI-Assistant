import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createApp } from "../server/app";

let appPromise: ReturnType<typeof createApp> | null = null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    console.log("API request:", req.method, req.url);

    if (!appPromise) {
      console.log("Creating Express app...");
      appPromise = createApp();
    }

    const { app } = await appPromise;

    return app(req as any, res as any);
  } catch (error) {
    console.error("Vercel API crashed:", error);

    return res.status(500).json({
      message: "API crashed",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : null,
    });
  }
}