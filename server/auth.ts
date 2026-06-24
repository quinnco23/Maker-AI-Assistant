import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";
import { createId, nowIso } from "./db/schema";
import { storage } from "./storage";

const PgSession = connectPgSimple(session);

export function setupAuth(app: any) {
  if (!process.env.POSTGRES_URL) {
    throw new Error("POSTGRES_URL is not set");
  }

  app.set("trust proxy", 1);

  app.use(
    session({
      store: new PgSession({
        conString: process.env.POSTGRES_URL,
        tableName: "sessions",
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "dev-secret-change-me",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 1000 * 60 * 60 * 24 * 14,
      },
    }),
  );
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export function requireUser(req: Request, res: Response, next: NextFunction) {
  const userId = (req.session as any)?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  (req as any).user = { id: userId };
  return next();
}

export async function requireMakerspaceRole(
  req: Request,
  res: Response,
  next: NextFunction,
  allowedRoles: Array<"owner" | "admin" | "instructor" | "member">,
) {
  const userId = (req.session as any)?.userId;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const memberships = await storage.getMembershipsByUserId(userId);
  const activeMembership = memberships.find(
    (membership) =>
      membership.status === "active" &&
      allowedRoles.includes(membership.role),
  );

  if (!activeMembership) {
    return res.status(403).json({ message: "Forbidden" });
  }

  (req as any).user = { id: userId };
  (req as any).membership = activeMembership;

  return next();
}

export async function createUserWithPassword(args: {
  email: string;
  fullName: string;
  password: string;
}) {
  const now = nowIso();
  const passwordHash = await hashPassword(args.password);

  return storage.createUser({
    id: createId("user"),
    email: args.email.toLowerCase().trim(),
    fullName: args.fullName.trim(),
    passwordHash,
    createdAt: now,
    updatedAt: now,
  } as any);
}