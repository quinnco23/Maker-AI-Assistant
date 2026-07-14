import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../../../server/storage";

function getCertificationStatus(args: {
  requiresCertification: boolean;
  userCertification: any | null;
}) {
  const { requiresCertification, userCertification } = args;

  if (!requiresCertification) return "not_required";
  if (!userCertification) return "not_certified";
  if (userCertification.status === "pending_review") return "pending_review";
  if (userCertification.status === "expired") return "expired";
  if (userCertification.status === "active") return "certified";

  return "not_certified";
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const userId =
      (req as any).session?.userId ||
      (req as any).user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const memberships = await storage.getMembershipsByUserId(userId);

    const activeMembership = memberships.find(
      (membership) =>
        membership.role === "member" && membership.status === "active",
    );

    if (!activeMembership) {
      return res.status(404).json({
        message: "No active makerspace membership found",
      });
    }

    const makerspace = await storage.getMakerspaceById(
      activeMembership.makerspaceId,
    );

    if (!makerspace) {
      return res.status(404).json({ message: "Makerspace not found" });
    }

    const machines = await storage.getMachinesByMakerspaceId(makerspace.id);

    const machineCertifications =
      await storage.getMachineCertificationsByMakerspaceId(makerspace.id);

    const modules =
      await storage.getCertificationModulesByMakerspaceId(makerspace.id);

    const userCertifications =
      await storage.getUserCertificationsByUser(userId);

    const machinesWithStatus = machines.map((machine) => {
      userCertifications.find((cert) => cert.machineId === machine.id) ?? null;
      const machineCert = machineCertifications.find(
        (mc) => mc.machineId === machine.id,
      );

      const requiresCertification = machineCert
        ? machineCert.required
        : false;

      const certificationProgram = machineCert
        ? modules.find((m) => m.id === machineCert.certificationModuleId) ?? null
        : null;

      const userCertification =
        userCertifications.find((cert) => cert.machineId === machine.id) ?? null;

      return {
        ...machine,
        certificationProgram,
        certificationStatus: getCertificationStatus({
          requiresCertification,
          userCertification,
        }),
      };
    });

    const earnedCertifications = userCertifications
      .filter((cert) => cert.status === "active")
      .map((cert) => {
        const machine = machines.find((m) => m.id === cert.machineId);

        return {
          id: cert.id,
          machineId: cert.machineId,
          machineName: machine?.name ?? "Unknown Machine",
          earnedAt: cert.earnedAt,
          expiresAt: cert.expiresAt ?? null,
          status: cert.status,
        };
      });

    return res.status(200).json({
      makerspace,
      machines: machinesWithStatus,
      earnedCertifications,
    });
  } catch (error) {
    console.error("Failed to load member makerspace:", error);
    return res.status(500).json({
      message:
        error instanceof Error ? error.message : "Failed to load member makerspace",
    });
  }
}