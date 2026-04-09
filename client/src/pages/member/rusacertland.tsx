import { useEffect, useMemo, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { CertificationShell } from "@/features/certifications/data/components/CertificationShell";
import { useCertificationEngine } from "@/features/hooks/useCertificationEngine";
import { prusaMk4sCertificationModule } from "@/features/certifications/data/prusa-mk4s";

export default function PrusaCertificationPage() {
  const [, params] = useRoute("/app/member/training/:machineId");
  const [, setLocation] = useLocation();
  const machineId = params?.machineId;

  const module = useMemo(() => {
    return prusaMk4sCertificationModule;
  }, [machineId]);

  const engine = useCertificationEngine(module, {
    storageKey: `certification-${machineId ?? "unknown"}`,
  });

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function submitCompletion() {
      if (!engine.completed || hasSubmitted || isSubmitting) return;

      try {
        setIsSubmitting(true);

        const maxPossibleScore = engine.levels.reduce((sum, level) => sum + level.xp, 0);
        const percentScore =
          maxPossibleScore > 0
            ? Math.round((engine.totalScore / maxPossibleScore) * 100)
            : 0;

        const res = await fetch(`/api/member/certifications/${module.id}/complete`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            machineId,
            score: percentScore,
            passed: engine.passed,
            answersJson: engine.levelResults,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to save certification completion");
        }

        const json = await res.json();
        console.log("certification completion saved:", json);

        setHasSubmitted(true);
      } catch (error) {
        console.error("Failed to submit certification completion:", error);
      } finally {
        setIsSubmitting(false);
      }
    }

    submitCompletion();
  }, [
    engine.completed,
    engine.passed,
    engine.totalScore,
    engine.levelResults,
    engine.levels,
    hasSubmitted,
    isSubmitting,
    machineId,
    module.id,
  ]);

  return (
    <main className="min-h-screen bg-neutral-100 p-6">
      <CertificationShell engine={engine} />
      {engine.completed && (
        <div className="mx-auto mt-4 max-w-4xl">
          <button
            onClick={() => setLocation("/app/member/home")}
            className="rounded-xl border bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50"
          >
            Back to Dashboard
          </button>
        </div>
      )}
    </main>
  );
}