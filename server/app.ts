
import "dotenv/config";
import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";

import { setupAuth } from "./auth.js";
import { registerRoutes } from "./routes.js";

const app = express();

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    if (req.path.startsWith("/api")) {
      console.log(
        `${req.method} ${req.path} ${res.statusCode} in ${Date.now() - start}ms`,
      );
    }
  });

  next();
});

setupAuth(app);
registerRoutes(app);

app.use(
  (err: any, _req: Request, res: Response, next: NextFunction) => {
    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(err.status || err.statusCode || 500).json({
      message: err.message || "Internal Server Error",
    });
  },
);

export default app;
