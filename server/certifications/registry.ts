import { prusaMk4sCertificationModule } from "../../client/src/features/certifications/data/prusa-mk4s";
import { laserCutterSafetyCoreModule } from "../../client/src/features/certifications/data/laser-cutter-safety-core";
import { cncRouterCertificationModule } from "../../client/src/features/certifications/data/cnc-router-safetycore";
import { waterjetCertificationModule } from "../../client/src/features/certifications/data/waterjetCertificationModule";
import { vinylCutterCertificationModule } from "../../client/src/features/certifications/data/vinylCutterCertificationModule";

export const certificationTemplateRegistry: Record<string, any> = {
  "prusa-mk4s-operator-badge":
    prusaMk4sCertificationModule,
  "laser-cutter-safety-core":
    laserCutterSafetyCoreModule,
  "cnc-router-safety-core":
    cncRouterCertificationModule,
  "waterjet-cutter-safety-core":
    waterjetCertificationModule,
  "vinyl-cutter-basic-operator":
    vinylCutterCertificationModule,
};

export function getCertificationTemplateContent(
  templateId: string,
) {
  return certificationTemplateRegistry[templateId] ?? null;
}