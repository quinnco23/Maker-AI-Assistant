import type { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";
import session from "express-session";
import { registerRoutes } from "../server/routes";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  }),
);

registerRoutes(app);

export default function handler(req: VercelRequest, res: VercelResponse) {
  return app(req, res);
}