import { prusaMk4sCertificationModule } from "../data/prusa-mk4s";
import { laserCutterSafetyCoreModule } from "../data/laser-cutter-safety-core";
import { cncRouterCertificationModule } from "../data/cnc-router-safetycore";
import { waterjetCertificationModule } from "../data/waterjetCertificationModule";
import { vinylCutterCertificationModule } from "../data/vinylCutterCertificationModule";


export const certificationTemplates: Record<string, any> = {
  "prusa-mk4s-operator-badge": prusaMk4sCertificationModule,
  "laser-cutter-safety-core": laserCutterSafetyCoreModule,

  // Coming soon
   "cnc-router-safety-core": cncRouterCertificationModule,
   //"cnc-mill-basic-operator": cncMillCertificationModule,
   "waterjet-cutter-safety-core": waterjetCertificationModule,
   "vinyl-cutter-basic-operator": vinylCutterCertificationModule,
  // "sewing-machine-basic-operator": sewingMachineCertificationModule,
  // "woodshop-tool-safety-core": woodshopSafetyCertificationModule,
};

export function getTemplate(templateId: string) {
  return certificationTemplates[templateId] ?? null;
}