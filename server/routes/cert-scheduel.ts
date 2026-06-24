import { createId, nowIso } from "../db/schema";
import { storage } from "../storage";
export function registerScheduleCertificationRoutes(app: any) {
app.post("/api/member/certification-review-requests", async (req: any, res: any) => {
    const userId = req.session?.userId ?? req.user?.id;
  
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
  
    const {
      certificationModuleId,
      machineId,
      staffUserId,
      requestedDate,
      requestedTime,
      notes,
    } = req.body;
  
    if (!certificationModuleId || !requestedDate || !requestedTime) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    const memberships = await storage.getMembershipsByUserId(userId);
    const memberMembership = memberships.find(
      (m) => m.role === "member" && m.status === "active",
    );
  
    if (!memberMembership) {
      return res.status(404).json({ message: "No member makerspace found" });
    }
  
    const request = await storage.createCertificationReviewRequest({
      id: createId("reviewreq"),
      makerspaceId: memberMembership.makerspaceId,
      userId,
      certificationModuleId,
      machineId: machineId ?? null,
      staffUserId: staffUserId ?? null,
      requestedDate,
      requestedTime,
      notes: notes ?? "",
      status: "pending",
      createdAt: nowIso(),
      updatedAt: nowIso(),
    });
  
    return res.status(201).json({ request });
  });
}