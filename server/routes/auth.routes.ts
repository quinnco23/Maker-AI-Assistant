import { createUserWithPassword, verifyPassword } from "../auth";
import { storage } from "../storage";
import { createId, nowIso } from "../db/schema";

export function registerAuthRoutes(app: any) {

  app.post("/api/auth/admin-signup", async (req: any, res: any) => {
    try {
      const { fullName, email, password, makerspaceName } = req.body;
  
      if (!fullName || !email || !password || !makerspaceName) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      if (password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters",
        });
      }
  
      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ message: "Email already registered" });
      }
  
      const now = nowIso();
  
      // 1. Create user
      const user = await createUserWithPassword({
        email,
        fullName,
        password,
      });
  
      // 2. Create makerspace
      const makerspace = await storage.createMakerspace({
        id: createId("ms"),
        name: makerspaceName,
        slug: makerspaceName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
        location: "",
        description: "",
        website: "",
        logoUrl: "",
        createdByUserId: user.id,
        createdAt: now,
        updatedAt: now,
      });
  
      // 3. Create membership (OWNER)
      await storage.createMembership({
        id: createId("membership"),
        makerspaceId: makerspace.id,
        userId: user.id,
        role: "owner",
        status: "active",
        joinedAt: now,
        createdAt: now,
      });
  
      // 4. Login user
      req.session.userId = user.id;
  
      return res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
        makerspace,
      });
    } catch (error) {
      console.error("Admin signup failed:", error);
      return res.status(500).json({
        message: "Admin signup failed",
      });
    }
  });

  app.post("/api/auth/signup", async (req: any, res: any) => {
    try {
      const { email, fullName, password } = req.body;

      if (!email || !fullName || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      if (password.length < 8) {
        return res.status(400).json({
          message: "Password must be at least 8 characters",
        });
      }

      const existing = await storage.getUserByEmail(email);
      if (existing) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const user = await createUserWithPassword({
        email,
        fullName,
        password,
      });

      req.session.userId = user.id;

      return res.status(201).json({
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      });
    } catch (error) {
      console.error("Signup failed:", error);
      return res.status(500).json({ message: "Signup failed" });
    }
  });

  app.post("/api/auth/login", async (req: any, res: any) => {
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

      req.session.userId = user.id;

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
  });

  app.post("/api/auth/logout", async (req: any, res: any) => {
    req.session.destroy((error: any) => {
      if (error) {
        return res.status(500).json({ message: "Logout failed" });
      }

      res.clearCookie("connect.sid");
      return res.status(200).json({ loggedOut: true });
    });
  });

  app.get("/api/auth/me", async (req: any, res: any) => {
    try {
      const userId = req.session?.userId;
  
      if (!userId) {
        return res.status(200).json({
          user: null,
          memberships: [],
          adminMakerspace: null,
          memberMakerspace: null,
        });
      }
      
      const user = await storage.getUserById(userId);
      
      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      
      const memberships = await storage.getMembershipsByUserId(userId);
      
      const adminMembership = memberships
        .filter((m: any) =>
          ["owner", "admin", "instructor"].includes(
            String(m.role).toLowerCase(),
          ),
        )
  .sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];

const adminMakerspace = adminMembership
  ? await storage.getMakerspaceById(adminMembership.makerspaceId)
  : null;
  
  const memberMembership = memberships
  .filter(
    (m: any) =>
      String(m.role).toLowerCase() === "member" &&
      m.status === "active",
  )
  .sort(
    (a: any, b: any) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )[0];

const memberMakerspace = memberMembership
  ? await storage.getMakerspaceById(memberMembership.makerspaceId)
  : null;
  
      return res.status(200).json({
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
        memberships,
        adminMakerspace,
        memberMakerspace,

        
      });
    } catch (error) {
      console.error("Failed to load current user:", error);
      return res.status(500).json({
        message: "Failed to load user",
      });
    }
  });

  app.post("/api/auth/logout", async (req: any, res: any) => {
    req.session.destroy((error: any) => {
      if (error) {
        return res.status(500).json({
          message: "Failed to logout",
        });
      }
  
      res.clearCookie("connect.sid");
  
      return res.status(200).json({
        success: true,
      });
    });
  });

  app.get("/api/makerspaces/discover", async (_req: any, res: any) => {
    console.log("HIT /api/makerspaces/discover");
  
    try {
      const makerspaces = await storage.getPublicMakerspacesForDirectory();
  
      return res.status(200).json({ makerspaces });
    } catch (error) {
      console.error("Failed to load makerspace directory:", error);
      return res.status(500).json({
        message: "Failed to load makerspace directory",
      });
    }
  });
  
}