import * as React from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, ShieldCheck, Wrench } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CertificationTemplate = {
  id: string;
  title: string;
  description: string;
  machineTypes: string[];
  estimatedMinutes: number;
  passingScore: number;
  levelsCount: number;
  tags: string[];
};

type MachineCertificationProgram = {
  id: string;
  machineId: string;
  title: string;
  description?: string;
  version: string;
  sourceType: "template" | "duplicate" | "custom";
  sourceTemplateId?: string;
  status: "draft" | "published" | "archived";
  passingScore: number;
  estimatedMinutes: number;
  expiresInDays?: number | null;
  isRequired: boolean;
  contentJson?: unknown;
  createdAt: string;
  updatedAt: string;
};

type PageData = {
  machine: {
    id: string;
    name: string;
    type: string;
    brand?: string;
    model?: string;
    locationLabel: string;
    requiresCertification: boolean;
  };
  activeProgram: MachineCertificationProgram | null;
  templates: CertificationTemplate[];
};

export default function MachineCertificationPage() {
  const [, params] = useRoute("/app/admin/machines/:machineId/certification");
  const machineId = params?.machineId;

  const [data, setData] = React.useState<PageData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  const [sourceType, setSourceType] = React.useState<"template" | "duplicate" | "custom">("template");
  const [selectedTemplateId, setSelectedTemplateId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [passingScore, setPassingScore] = React.useState(80);
  const [estimatedMinutes, setEstimatedMinutes] = React.useState(8);
  const [expiresInDays, setExpiresInDays] = React.useState<number | "">(365);
  const [isRequired, setIsRequired] = React.useState(true);

  React.useEffect(() => {
    async function loadPage() {
      try {
        setIsLoading(true);
  
        const res = await fetch(`/api/admin/machines/${machineId}/certification`, {
          credentials: "include",
        });
  
        const text = await res.text();
        console.log("cert settings status:", res.status);
        console.log("cert settings raw response:", text);
  
        if (!res.ok) {
          throw new Error(`Failed to load certification page: ${res.status}`);
        }
  
        const json = JSON.parse(text);
        console.log("cert settings parsed json:", json);
  
        setData(json);
  
        if (json.activeProgram) {
          setSourceType(json.activeProgram.sourceType ?? "template");
          setSelectedTemplateId(json.activeProgram.sourceTemplateId || "");
          setTitle(json.activeProgram.title || "");
          setDescription(json.activeProgram.description || "");
          setPassingScore(json.activeProgram.passingScore || 80);
          setEstimatedMinutes(json.activeProgram.estimatedMinutes || 8);
          setExpiresInDays(json.activeProgram.expiresInDays ?? "");
          setIsRequired(!!json.activeProgram.isRequired);
        }
      } catch (error) {
        console.error("Failed to load machine certification page:", error);
      } finally {
        setIsLoading(false);
      }
    }
  
    if (machineId) {
      loadPage();
    }
  }, [machineId]);

  const selectedTemplate = data?.templates.find((t) => t.id === selectedTemplateId) ?? null;

  async function handleSaveDraft() {
    if (!machineId) return;

    try {
      setIsSaving(true);

      const payload = {
        sourceType,
        sourceTemplateId: selectedTemplateId || undefined,
        title,
        description,
        passingScore,
        estimatedMinutes,
        expiresInDays: expiresInDays === "" ? null : Number(expiresInDays),
        isRequired,
        status: "draft",
      };

      const res = await fetch(`/api/admin/machines/${machineId}/certification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save certification");
      }

      const json = await res.json();
      setData((prev) =>
        prev
          ? {
              ...prev,
              activeProgram: json.program,
            }
          : prev,
      );
    } catch (error) {
      console.error("Failed to save certification:", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function handlePublish() {
    if (!machineId) return;

    try {
      setIsSaving(true);

      const payload = {
        sourceType,
        sourceTemplateId: selectedTemplateId || undefined,
        title,
        description,
        passingScore,
        estimatedMinutes,
        expiresInDays: expiresInDays === "" ? null : Number(expiresInDays),
        isRequired,
        status: "published",
      };

      const res = await fetch(`/api/admin/machines/${machineId}/certification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to publish certification");
      }

      const json = await res.json();
      setData((prev) =>
        prev
          ? {
              ...prev,
              activeProgram: json.program,
            }
          : prev,
      );
    } catch (error) {
      console.error("Failed to publish certification:", error);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="mx-auto max-w-7xl p-6">Loading certification editor...</div>;
  }

  if (!data) {
    return <div className="mx-auto max-w-7xl p-6">Could not load certification settings.</div>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <Link
        href={`/app/admin/machines/${data.machine.id}`}
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to machine
      </Link>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
            <Wrench className="h-4 w-4" />
            {data.machine.name}
          </div>

         

          <p className="mt-2 text-slate-600">
            Configure the training members must complete to operate this machine.
          </p>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Certification Source</CardTitle>
              <CardDescription>
                Choose how this certification program should be created.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              <SourceOption
                selected={sourceType === "template"}
                title="Use Template"
                description="Fastest option. Start from a proven machine certification."
                onClick={() => setSourceType("template")}
              />
              <SourceOption
                selected={sourceType === "duplicate"}
                title="Duplicate Existing"
                description="Clone another machine’s certification and adjust it."
                onClick={() => setSourceType("duplicate")}
              />
              <SourceOption
                selected={sourceType === "custom"}
                title="Start From Scratch"
                description="Create a custom certification flow for this machine."
                onClick={() => setSourceType("custom")}
              />
            </CardContent>
          </Card>

          {sourceType === "template" && (
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Template Library</CardTitle>
                <CardDescription>
                  Select a certification template to apply to this machine.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                {data.templates.map((template) => {
                  const selected = selectedTemplateId === template.id;

                  return (
                    <button
                      key={template.id}
                      type="button"
                      onClick={() => {
                        setSelectedTemplateId(template.id);
                        setTitle(template.title);
                        setDescription(template.description);
                        setPassingScore(template.passingScore);
                        setEstimatedMinutes(template.estimatedMinutes);
                      }}
                      className={[
                        "w-full rounded-2xl border p-4 text-left transition",
                        selected
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-200 bg-white text-slate-900 hover:border-slate-400",
                      ].join(" ")}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="font-semibold">{template.title}</div>
                          <div className={selected ? "mt-1 text-sm text-slate-200" : "mt-1 text-sm text-slate-600"}>
                            {template.description}
                          </div>
                        </div>
                        <div className={selected ? "rounded-full bg-white/15 px-2.5 py-1 text-xs" : "rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700"}>
                          {template.levelsCount} levels
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          )}

          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Program Settings</CardTitle>
              <CardDescription>
                Basic certification settings for this machine.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              <Field label="Title">
                <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              </Field>

              <Field label="Description">
                <Input value={description} onChange={(e) => setDescription(e.target.value)} />
              </Field>

              <div className="grid gap-4 md:grid-cols-3">
                <Field label="Passing Score">
                  <Input
                    type="number"
                    value={passingScore}
                    onChange={(e) => setPassingScore(Number(e.target.value))}
                  />
                </Field>

                <Field label="Estimated Minutes">
                  <Input
                    type="number"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                  />
                </Field>

                <Field label="Expiration (days)">
                  <Input
                    type="number"
                    value={expiresInDays}
                    onChange={(e) =>
                      setExpiresInDays(e.target.value === "" ? "" : Number(e.target.value))
                    }
                  />
                </Field>
              </div>

              <div className="flex items-center gap-3">
                <input
                  id="isRequired"
                  type="checkbox"
                  checked={isRequired}
                  onChange={(e) => setIsRequired(e.target.checked)}
                />
                <label htmlFor="isRequired" className="text-sm font-medium">
                  Required before machine use
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Certification Summary</CardTitle>
              <CardDescription>
                Current settings and machine relationship.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <SummaryRow label="Machine" value={data.machine.name} />
              <SummaryRow label="Status" value={data.activeProgram?.status ?? "Not created"} />
              <SummaryRow label="Title" value={title || "Untitled"} />
              <SummaryRow label="Passing Score" value={`${passingScore}%`} />
              <SummaryRow label="Estimated Time" value={`${estimatedMinutes} min`} />
              <SummaryRow label="Required" value={isRequired ? "Yes" : "No"} />

              {selectedTemplate && (
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="mb-2 inline-flex items-center gap-2 font-medium text-slate-900">
                    <ShieldCheck className="h-4 w-4" />
                    Selected Template
                  </div>
                  <p className="text-sm text-slate-600">{selectedTemplate.title}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <Button onClick={handleSaveDraft} disabled={isSaving} className="w-full rounded-xl">
                {isSaving ? "Saving..." : "Save Draft"}
              </Button>

              <Button onClick={handlePublish} disabled={isSaving} variant="outline" className="w-full rounded-xl">
                Publish
              </Button>

              <Button asChild variant="ghost" className="w-full rounded-xl">
                <Link href={`/app/member/training/${data.machine.name}`}>
                  Preview as Member
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SourceOption({
  selected,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "w-full rounded-2xl border p-4 text-left transition",
        selected
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-200 bg-white text-slate-900 hover:border-slate-400",
      ].join(" ")}
    >
      <div className="font-semibold">{title}</div>
      <div className={selected ? "mt-1 text-sm text-slate-200" : "mt-1 text-sm text-slate-600"}>
        {description}
      </div>
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
    </div>
  );
}