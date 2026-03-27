import * as React from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  ShieldCheck,
  Copy,
  Sparkles,
  FileBadge,
  Printer,
  ScanLine,
  Cog,
  Wrench,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type MachineType =
  | "3d_printer"
  | "laser_cutter"
  | "cnc_router"
  | "vinyl_cutter"
  | "electronics"
  | "woodshop"
  | "other";

type OnboardingState = {
  makerspace?: {
    name: string;
    slug: string;
    location: string;
    description: string;
    website?: string;
  };
  machine?: {
    name: string;
    type: MachineType;
    brand?: string;
    model?: string;
    locationLabel: string;
    description: string;
    requiresCertification: boolean;
  };
  certification?: {
    mode: "template" | "duplicate" | "custom" | "none";
    templateId?: string;
    title?: string;
    estimatedMinutes?: number;
    passingScore?: number;
  };
};

type CertificationMode = "template" | "duplicate" | "custom";

type CertificationTemplate = {
  id: string;
  title: string;
  description: string;
  machineTypes: MachineType[];
  estimatedMinutes: number;
  passingScore: number;
  levels: number;
  tags: string[];
};

const certificationTemplates: CertificationTemplate[] = [
  {
    id: "prusa-mk4s-operator-badge",
    title: "Prusa MK4S Operator Badge",
    description:
      "A gamified beginner certification for safe operation, first-layer checks, print removal, and reset procedures.",
    machineTypes: ["3d_printer"],
    estimatedMinutes: 8,
    passingScore: 80,
    levels: 5,
    tags: ["3D Printing", "Beginner Friendly", "Gamified"],
  },
  {
    id: "laser-cutter-safety-core",
    title: "Laser Cutter Safety Core",
    description:
      "Safety-first certification covering approved materials, fire watch, startup, operation, and shutdown procedures.",
    machineTypes: ["laser_cutter"],
    estimatedMinutes: 10,
    passingScore: 85,
    levels: 6,
    tags: ["Laser", "Safety", "Required"],
  },
  {
    id: "cnc-router-foundations",
    title: "CNC Router Foundations",
    description:
      "Introductory certification for workholding, startup checks, safe cutting workflow, and emergency response.",
    machineTypes: ["cnc_router"],
    estimatedMinutes: 12,
    passingScore: 85,
    levels: 6,
    tags: ["CNC", "Operations", "Safety"],
  },
];

function StepProgress() {
  const steps = ["Welcome", "Makerspace", "Machine", "Certification", "Review", "Invite"];

  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((step, index) => {
        const isComplete = index <= 2;
        const isCurrent = index === 3;

        return (
          <div
            key={step}
            className={[
              "rounded-full px-3 py-1.5 text-sm font-medium",
              isCurrent
                ? "bg-slate-900 text-white"
                : isComplete
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-600",
            ].join(" ")}
          >
            {step}
          </div>
        );
      })}
    </div>
  );
}

function getMachineIcon(type?: MachineType) {
  switch (type) {
    case "3d_printer":
      return <Printer className="h-5 w-5" />;
    case "laser_cutter":
      return <ScanLine className="h-5 w-5" />;
    case "cnc_router":
      return <Cog className="h-5 w-5" />;
    default:
      return <Wrench className="h-5 w-5" />;
  }
}

export default function CreateCertificationPage() {
  const [, setLocation] = useLocation();

  const [onboarding, setOnboarding] = React.useState<OnboardingState | null>(null);
  const [mode, setMode] = React.useState<CertificationMode>("template");
  const [selectedTemplateId, setSelectedTemplateId] = React.useState<string>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("makerspace_onboarding");
      const parsed: OnboardingState | null = raw ? JSON.parse(raw) : null;
      setOnboarding(parsed);

      if (!parsed?.makerspace) {
        setLocation("/app/admin/onboarding/makerspace");
        return;
      }

      if (!parsed?.machine) {
        setLocation("/app/admin/onboarding/machine");
        return;
      }

      if (parsed.machine.requiresCertification === false) {
        localStorage.setItem(
          "makerspace_onboarding",
          JSON.stringify({
            ...parsed,
            certification: {
              mode: "none",
              title: "No certification required",
            },
          }),
        );
        setLocation("/app/admin/onboarding/review");
        return;
      }

      const recommended = certificationTemplates.find((template) =>
        template.machineTypes.includes(parsed.machine!.type),
      );

      if (recommended) {
        setSelectedTemplateId(recommended.id);
      }
    } catch (error) {
      console.error(error);
      setLocation("/app/admin/onboarding/makerspace");
    }
  }, [setLocation]);

  const machine = onboarding?.machine;

  const filteredTemplates = React.useMemo(() => {
    if (!machine?.type) return certificationTemplates;
    return certificationTemplates.filter((template) =>
      template.machineTypes.includes(machine.type),
    );
  }, [machine?.type]);

  const selectedTemplate =
    filteredTemplates.find((template) => template.id === selectedTemplateId) ?? null;

  async function handleContinue() {
    if (!onboarding || !machine) return;

    if (mode === "template" && !selectedTemplate) return;

    try {
      setIsSubmitting(true);

      const nextCertification =
        mode === "template"
          ? {
              mode: "template" as const,
              templateId: selectedTemplate!.id,
              title: selectedTemplate!.title,
              estimatedMinutes: selectedTemplate!.estimatedMinutes,
              passingScore: selectedTemplate!.passingScore,
            }
          : mode === "duplicate"
            ? {
                mode: "duplicate" as const,
                title: "Duplicate existing certification",
              }
            : {
                mode: "custom" as const,
                title: `${machine.name} Custom Certification`,
              };

      localStorage.setItem(
        "makerspace_onboarding",
        JSON.stringify({
          ...onboarding,
          certification: nextCertification,
        }),
      );

      setLocation("/app/admin/onboarding/review");
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!onboarding || !machine) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="space-y-3">
            <Link
              href="/app/admin/onboarding/machine"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to machine
            </Link>

            <StepProgress />
          </div>

          <div className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
            Step 3 of 5
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-3xl">Attach certification</CardTitle>
              <CardDescription className="text-base">
                Choose how members will be trained before using this machine.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
              <div className="rounded-2xl border bg-slate-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    {getMachineIcon(machine.type)}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{machine.name}</p>
                    <p className="text-sm text-slate-600">
                      {machine.brand || machine.model
                        ? [machine.brand, machine.model].filter(Boolean).join(" ")
                        : machine.type.replace(/_/g, " ")}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">{machine.locationLabel}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-700">
                  How do you want to create certification?
                </p>

                <div className="grid gap-3">
                  <button
                    type="button"
                    onClick={() => setMode("template")}
                    className={[
                      "rounded-2xl border p-4 text-left transition",
                      mode === "template"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-900 hover:border-slate-400",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-2 font-medium">
                      <Sparkles className="h-4 w-4" />
                      Use template
                    </div>
                    <p
                      className={[
                        "mt-2 text-sm",
                        mode === "template" ? "text-slate-200" : "text-slate-600",
                      ].join(" ")}
                    >
                      Fastest option. Start with a proven certification flow and customize later.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("duplicate")}
                    className={[
                      "rounded-2xl border p-4 text-left transition",
                      mode === "duplicate"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-900 hover:border-slate-400",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-2 font-medium">
                      <Copy className="h-4 w-4" />
                      Duplicate existing
                    </div>
                    <p
                      className={[
                        "mt-2 text-sm",
                        mode === "duplicate" ? "text-slate-200" : "text-slate-600",
                      ].join(" ")}
                    >
                      Reuse a certification you already built. Good for future multi-machine setups.
                    </p>
                    <div className="mt-3 inline-flex rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                      Coming soon
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMode("custom")}
                    className={[
                      "rounded-2xl border p-4 text-left transition",
                      mode === "custom"
                        ? "border-slate-900 bg-slate-900 text-white"
                        : "border-slate-200 bg-white text-slate-900 hover:border-slate-400",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-2 font-medium">
                      <FileBadge className="h-4 w-4" />
                      Start from scratch
                    </div>
                    <p
                      className={[
                        "mt-2 text-sm",
                        mode === "custom" ? "text-slate-200" : "text-slate-600",
                      ].join(" ")}
                    >
                      Begin with a blank certification shell and build your own flow.
                    </p>
                  </button>
                </div>
              </div>

              {mode === "template" && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-slate-700">Recommended templates</p>

                  {filteredTemplates.length === 0 ? (
                    <div className="rounded-2xl border border-dashed bg-slate-50 p-5 text-sm text-slate-600">
                      No machine-specific templates found yet. You can still start from scratch.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {filteredTemplates.map((template) => {
                        const selected = selectedTemplateId === template.id;

                        return (
                          <button
                            key={template.id}
                            type="button"
                            onClick={() => setSelectedTemplateId(template.id)}
                            className={[
                              "w-full rounded-2xl border p-4 text-left transition",
                              selected
                                ? "border-slate-900 bg-slate-900 text-white"
                                : "border-slate-200 bg-white text-slate-900 hover:border-slate-400",
                            ].join(" ")}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="font-semibold">{template.title}</p>
                                  {selected && <CheckCircle2 className="h-4 w-4" />}
                                </div>
                                <p
                                  className={[
                                    "mt-1 text-sm",
                                    selected ? "text-slate-200" : "text-slate-600",
                                  ].join(" ")}
                                >
                                  {template.description}
                                </p>
                              </div>

                              <div
                                className={[
                                  "rounded-full px-2.5 py-1 text-xs font-medium",
                                  selected
                                    ? "bg-white/15 text-white"
                                    : "bg-slate-100 text-slate-700",
                                ].join(" ")}
                              >
                                {template.levels} levels
                              </div>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {template.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className={[
                                    "rounded-full px-2.5 py-1 text-xs font-medium",
                                    selected
                                      ? "bg-white/15 text-white"
                                      : "bg-slate-100 text-slate-700",
                                  ].join(" ")}
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div
                              className={[
                                "mt-4 flex items-center gap-4 text-sm",
                                selected ? "text-slate-200" : "text-slate-600",
                              ].join(" ")}
                            >
                              <span className="inline-flex items-center gap-1">
                                <Clock3 className="h-4 w-4" />
                                {template.estimatedMinutes} min
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <ShieldCheck className="h-4 w-4" />
                                Pass score {template.passingScore}%
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {mode === "duplicate" && (
                <div className="rounded-2xl border bg-amber-50 p-4 text-sm text-amber-900">
                  Duplicate existing certification will be a great next feature once you have multiple machines and templates in your system.
                </div>
              )}

              {mode === "custom" && (
                <div className="rounded-2xl border bg-slate-50 p-4 text-sm text-slate-700">
                  You’ll start with a blank certification shell for <strong>{machine.name}</strong>.
                  For MVP speed, template mode is still the fastest path.
                </div>
              )}

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  size="lg"
                  className="rounded-xl px-6"
                  onClick={handleContinue}
                  disabled={
                    isSubmitting ||
                    (mode === "template" && !selectedTemplate && filteredTemplates.length > 0)
                  }
                >
                  {isSubmitting ? "Saving..." : "Continue to review"}
                </Button>

                <Button asChild variant="outline" size="lg" className="rounded-xl px-6">
                  <Link href="/app/admin/onboarding/machine">Back</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Selection preview</CardTitle>
                <CardDescription>
                  This is the training path members will see for this machine.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {mode === "template" && selectedTemplate ? (
                  <>
                    <div className="rounded-2xl border bg-white p-4">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-slate-700" />
                        <h3 className="font-semibold text-slate-900">
                          {selectedTemplate.title}
                        </h3>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">
                        {selectedTemplate.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Estimated time
                        </p>
                        <p className="mt-1 text-lg font-semibold text-slate-900">
                          {selectedTemplate.estimatedMinutes} min
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                          Passing score
                        </p>
                        <p className="mt-1 text-lg font-semibold text-slate-900">
                          {selectedTemplate.passingScore}%
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        Levels
                      </p>
                      <p className="mt-1 text-lg font-semibold text-slate-900">
                        {selectedTemplate.levels}
                      </p>
                    </div>
                  </>
                ) : mode === "duplicate" ? (
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    Existing certification duplication will appear here.
                  </div>
                ) : (
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    A blank custom certification shell will be created for this machine.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Why templates work best</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">Launch faster</p>
                  <p className="mt-1">
                    Get a machine live with certification today, then customize later.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">Stay consistent</p>
                  <p className="mt-1">
                    Built-in safety flows make member onboarding smoother and easier to manage.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 text-slate-500" />
                    <p>
                      You can always edit a certification later from your admin dashboard.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}