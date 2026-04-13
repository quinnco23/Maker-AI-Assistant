import "dotenv/config";
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { storage } from "../../../server/storage.js";

function getCertificationStatus(args: {
  requiresCertification: boolean;
  userCertification: any | null;
}) {
  const { requiresCertification, userCertification } = args;
  if (!requiresCertification) return "not_required";
  if (!userCertification) return "not_certified";
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
      (req as any).user?.id ||
      (req.headers["x-dev-user-id"] as string | undefined) ||
      "member-user";
    const machineId = req.query.machineId as string;

    const machine = await storage.getMachineById(machineId);
    if (!machine) {
      return res.status(404).json({ message: "Machine not found" });
    }

    const machineCertification = await storage.getMachineCertificationByMachineId(machineId);

    let certificationProgram = null;
    if (machineCertification) {
      certificationProgram = await storage.getCertificationModuleById(
        machineCertification.certificationModuleId,
      );
    }

    const userCertification = await storage.getUserCertificationForMachine(userId, machineId);

    return res.status(200).json({
      machine,
      certificationProgram,
      certificationStatus: getCertificationStatus({
        requiresCertification: machine.requiresCertification,
        userCertification,
      }),
    });
  } catch (error) {
    console.error("Failed to load member machine detail:", error);
    return res.status(500).json({
      message: error instanceof Error ? error.message : "Failed to load member machine detail",
    });
  }
}