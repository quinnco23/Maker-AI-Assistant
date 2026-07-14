import { useEffect, useState, useMemo } from "react";
import { useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { CertificationShell } from "@/features/certifications/data/components/CertificationShell";
import { useCertificationEngine } from "@/features/hooks/useCertificationEngine";


export default function AdminCertificationPreviewPage() {
  const [, params] = useRoute(
    "/app/admin/machines/:machineId/certification/preview",
  );

  const machineId = params?.machineId;
  const [, setLocation] = useLocation();

  const [moduleContent, setModuleContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const parsedModuleContent = useMemo(() => {
    if (!moduleContent) return null;
  
    if (typeof moduleContent === "string") {
      try {
        return JSON.parse(moduleContent);
      } catch (error) {
        console.error("Failed to parse certification content:", error);
        return null;
      }
    }
  
    return moduleContent;
  }, [moduleContent]);

  useEffect(() => {
    async function loadCertification() {
      try {
        setIsLoading(true);

        const res = await fetch(
          `/api/admin/machines/${machineId}/certification`,
          {
            credentials: "include",
          },
        );

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || "Failed to load certification");
        }

        const content =
          json.activeProgram?.contentJson ??
          json.activeProgram?.content_json ??
          null;

        setModuleContent(content);

        localStorage.removeItem(`admin-preview-certification-${machineId}`);
      } catch (error) {
        console.error("Failed to load preview:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (machineId) {
      loadCertification();
    }
  }, [machineId]);

  const engine = useCertificationEngine(
    parsedModuleContent ?? {
      id: "preview-loading",
      title: "Loading Preview...",
      version: "1.0.0",
      passingScore: 80,
      estimatedMinutes: 0,
      levels: [],
    },
    {
      storageKey: `admin-preview-certification-${machineId}`,
    },
  );

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading preview...</div>;
  }

  if (
    !parsedModuleContent ||
    !Array.isArray(parsedModuleContent.levels)
  ) {
    return (
      <div className="space-y-4 p-6">
        <p className="text-sm text-slate-500">
          Certification content is missing or invalid.
        </p>
  
        <Button
          variant="outline"
          onClick={() =>
            setLocation(
              `/app/admin/machines/${machineId}/certification`,
            )
          }
        >
          Back to Builder
        </Button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 p-6">
      <div className="mx-auto mb-4 flex max-w-5xl justify-between">
        <Button
          variant="outline"
          onClick={() =>
            setLocation(`/app/admin/machines/${machineId}/certification`)
          }
        >
          Back to Builder
        </Button>

        <div className="rounded-full bg-slate-900 px-3 py-1 text-xs font-medium text-white">
          Admin Preview
        </div>
      </div>

      <CertificationShell engine={engine} />
    </main>
  );
}