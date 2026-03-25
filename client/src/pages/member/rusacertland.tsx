import { CertificationShell } from "@/features/certifications/data/components/CertificationShell";
import { useCertificationEngine } from "@/features/hooks/useCertificationEngine";
import { prusaMk4sCertificationModule } from "@/features/certifications/data/prusa-mk4s";

export default function PrusaCertificationPage() {
  const engine = useCertificationEngine(prusaMk4sCertificationModule, {
    storageKey: "prusa-mk4s-certification",
  });

  return (
    <main className="min-h-screen bg-neutral-100 p-6">
      <CertificationShell engine={engine} />
    </main>
  );
}