import { useEffect, useMemo, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { CertificationShell } from "@/features/certifications/data/components/CertificationShell";
import { useCertificationEngine } from "@/features/hooks/useCertificationEngine";
import { ScheduleStaffReviewStep } from "@/features/certifications/ScheduleStaffReviewStep";

export default function PrusaCertificationPage() {
  const [, params] = useRoute("/app/member/training/:moduleId");
  const moduleId = params?.moduleId;
  const [, setLocation] = useLocation();

  const [moduleRecord, setModuleRecord] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showScheduleReview, setShowScheduleReview] = useState(false);
  const [me, setMe] = useState<any>(null);
  useEffect(() => {
    async function loadMe() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });
  
        const json = await res.json();
        setMe(json);
      } catch (error) {
        console.error("Failed to load current user:", error);
      }
    }
  
    loadMe();
  }, []);
  useEffect(() => {
    async function loadModule() {
      try {
        setIsLoading(true);

        const res = await fetch(`/api/member/certifications/${moduleId}`, {
          credentials: "include",
          headers: {
            
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load certification module");
        }

        const json = await res.json();
        setModuleRecord(json.module);
      } catch (error) {
        console.error("Failed to load certification module:", error);
        setModuleRecord(null);
      } finally {
        setIsLoading(false);
      }
    }

    if (moduleId) {
      loadModule();
    }
  }, [moduleId]);

  // ✅ moduleContent must be BEFORE useCertificationEngine
  const moduleContent = moduleRecord?.contentJson ?? null;
  const userId = me?.user?.id ?? "guest";

  const baseEngine = useCertificationEngine(
    moduleContent ?? {
      id: "loading",
      title: "Loading...",
      version: "1.0.0",
      passingScore: 80,
      estimatedMinutes: 0,
      levels: [],
    },
    {
      storageKey: `member-certification-${userId}-${moduleId}`,
    },
  );

  const engine = {
    ...baseEngine,
    module: moduleContent,
    onSubmitCertification: async ({ score, passed, levelResults }: any) => {
      const res = await fetch(`/api/member/certifications/${moduleId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          
        },
        credentials: "include",
        body: JSON.stringify({
          score,
          passed,
          answersJson: levelResults,
          reviewStatus: "pending_review",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit certification");
      }

      setShowScheduleReview(true);
    },
  };

  if (isLoading) {
    return <div>Loading certification...</div>;
  }

  if (showScheduleReview) {
    return (
      <ScheduleStaffReviewStep
        moduleId={moduleId!}
        machineId={moduleRecord?.machineId ?? null}
        onDone={() => setLocation("/app/member/home")}
      />
    );
  }

  if (!moduleRecord || !moduleContent) {
    return <div>Could not load certification.</div>;
  }

  if (showScheduleReview) {
    return (
      <main className="min-h-screen bg-neutral-100 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-neutral-500">Final Step</p>

          <h1 className="mt-2 text-3xl font-bold text-neutral-900">
            Schedule your in-person review
          </h1>

          <p className="mt-4 text-neutral-600">
            You passed the online certification. A staff member must verify your
            machine setup, operation, shutdown, and safety before your certification
            becomes active.
          </p>

          <button
            className="mt-6 rounded-xl bg-neutral-900 px-4 py-2 text-white"
            onClick={() => {
              setLocation("/app/member/home");
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 p-6">
      <CertificationShell engine={engine} />
    </main>
  );
}