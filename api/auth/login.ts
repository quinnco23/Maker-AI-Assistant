import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyPassword } from "../../server/auth";
import { storage } from "../../server/storage";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password" });
    }

    const user = await storage.getUserByEmail(email);

    if (!user?.passwordHash) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const valid = await verifyPassword(password, user.passwordHash);

    if (!valid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Important: Vercel serverless does not automatically have req.session
    // unless you set up session middleware differently.
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    console.error("Login failed:", error);
    return res.status(500).json({ message: "Login failed" });
  }
}