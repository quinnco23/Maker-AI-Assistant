import * as React from "react";
import { Link, useLocation } from "wouter";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Globe,
  FileText,
  Wrench,
  Printer,
  ScanLine,
  Cog,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Clock3,
  AlertTriangle,
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

function StepProgress() {
  const steps = ["Welcome", "Makerspace", "Machine", "Certification", "Review", "Invite"];

  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((step, index) => {
        const isComplete = index <= 3;
        const isCurrent = index === 4;

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

function getMachineTypeLabel(type?: MachineType) {
  if (!type) return "Machine";
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ReviewPublishPage() {
  const [, setLocation] = useLocation();
  const [onboarding, setOnboarding] = React.useState<OnboardingState | null>(null);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [publishError, setPublishError] = React.useState("");

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("makerspace_onboarding");
      const parsed: OnboardingState | null = raw ? JSON.parse(raw) : null;

      if (!parsed?.makerspace) {
        setLocation("/app/admin/onboarding/makerspace");
        return;
      }

      if (!parsed?.machine) {
        setLocation("/app/admin/onboarding/machine");
        return;
      }

      if (!parsed?.certification) {
        if (parsed.machine.requiresCertification) {
          setLocation("/app/admin/onboarding/certification");
          return;
        }
      }

      setOnboarding(parsed);
    } catch (error) {
      console.error(error);
      setLocation("/app/admin/onboarding/makerspace");
    }
  }, [setLocation]);

  async function handlePublish() {
    if (!onboarding?.makerspace || !onboarding?.machine) return;

    try {
      setPublishError("");
      setIsPublishing(true);

      // Replace this with your real API call later.
      // Example:
      // const res = await fetch("/api/admin/onboarding/publish", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   credentials: "include",
      //   body: JSON.stringify(onboarding),
      // });
      //
      // if (!res.ok) throw new Error("Failed to publish setup");

      const publishedPayload = {
        id: crypto.randomUUID(),
        createdAt: new Date().toISOString(),
        ...onboarding,
      };

      localStorage.setItem("makerspace_published", JSON.stringify(publishedPayload));

      // Keep onboarding for now in case you want to support editing after publish.
      setLocation("/app/admin/onboarding/invite");
    } catch (error) {
      console.error(error);
      setPublishError("Something went wrong while publishing your makerspace.");
    } finally {
      setIsPublishing(false);
    }
  }
  if (!onboarding) return null;

  const { makerspace, machine, certification } = onboarding;

  const publicUrl = makerspace?.slug
    ? `yourapp.com/spaces/${makerspace.slug}`
    : "yourapp.com/spaces/your-space";

  const certificationRequired = !!machine?.requiresCertification;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="space-y-3">
            <Link
              href={
                certificationRequired
                  ? "/app/admin/onboarding/certification"
                  : "/app/admin/onboarding/machine"
              }
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>

            <StepProgress />
          </div>

          <div className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
            Step 4 of 5
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-3xl">Review & publish</CardTitle>
                <CardDescription className="text-base">
                  Confirm your makerspace setup before it goes live for members.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle>Makerspace</CardTitle>
                    <CardDescription>Your organization profile</CardDescription>
                  </div>

                  <Button asChild variant="outline" size="sm" className="rounded-xl">
                    <Link href="/app/admin/onboarding/makerspace">Edit</Link>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                    <Building2 className="h-6 w-6 text-slate-500" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold text-slate-900">
                      {makerspace?.name}
                    </h2>
                    <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-600">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {makerspace?.location}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {publicUrl}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="mb-2 inline-flex items-center gap-2 font-medium text-slate-900">
                    <FileText className="h-4 w-4" />
                    Description
                  </div>
                  <p>{makerspace?.description}</p>
                </div>

                {makerspace?.website && (
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <div className="mb-2 font-medium text-slate-900">Website</div>
                    <p className="break-all">{makerspace.website}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle>Machine</CardTitle>
                    <CardDescription>Your first published machine</CardDescription>
                  </div>

                  <Button asChild variant="outline" size="sm" className="rounded-xl">
                    <Link href="/app/admin/onboarding/machine">Edit</Link>
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
                    {getMachineIcon(machine?.type)}
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-xl font-semibold text-slate-900">
                      {machine?.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {machine?.brand || machine?.model
                        ? [machine.brand, machine.model].filter(Boolean).join(" ")
                        : getMachineTypeLabel(machine?.type)}
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Type
                    </div>
                    <div className="mt-1 font-medium text-slate-900">
                      {getMachineTypeLabel(machine?.type)}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Location
                    </div>
                    <div className="mt-1 font-medium text-slate-900">
                      {machine?.locationLabel}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                  <div className="mb-2 font-medium text-slate-900">Description</div>
                  <p>{machine?.description}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle>Certification</CardTitle>
                    <CardDescription>Member training requirement</CardDescription>
                  </div>

                  {certificationRequired && (
                    <Button asChild variant="outline" size="sm" className="rounded-xl">
                      <Link href="/app/admin/onboarding/certification">Edit</Link>
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                {!certificationRequired || certification?.mode === "none" ? (
                  <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-900">
                    <div className="mb-1 inline-flex items-center gap-2 font-medium">
                      <CheckCircle2 className="h-4 w-4" />
                      No certification required
                    </div>
                    <p>Members can access this machine without completing a certification program.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="mb-2 inline-flex items-center gap-2 font-medium text-slate-900">
                        <ShieldCheck className="h-4 w-4" />
                        {certification?.title || "Certification selected"}
                      </div>

                      <div className="flex flex-wrap gap-3 text-sm text-slate-600">
                        <span className="inline-flex items-center gap-1">
                          <Sparkles className="h-4 w-4" />
                          Mode: {certification?.mode}
                        </span>

                        {certification?.estimatedMinutes ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock3 className="h-4 w-4" />
                            {certification.estimatedMinutes} min
                          </span>
                        ) : null}

                        {certification?.passingScore ? (
                          <span className="inline-flex items-center gap-1">
                            <ShieldCheck className="h-4 w-4" />
                            Pass score {certification.passingScore}%
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-amber-50 p-4 text-sm text-amber-900">
                      Members must complete this certification before independently operating the machine.
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Ready to publish</CardTitle>
                <CardDescription>
                  Publishing makes your makerspace structure available for member onboarding.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Makerspace</span>
                      <span className="font-medium text-slate-900">
                        {makerspace?.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">First machine</span>
                      <span className="font-medium text-slate-900">
                        {machine?.name}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Certification</span>
                      <span className="font-medium text-slate-900">
                        {certificationRequired
                          ? certification?.title || "Required"
                          : "Not required"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-sm font-medium text-slate-900">What publishing does</p>
                  <ul className="mt-2 space-y-2 text-sm text-slate-600">
                    <li>Creates your makerspace profile</li>
                    <li>Adds your first machine</li>
                    <li>Attaches certification settings</li>
                    <li>Prepares your space for member invites</li>
                  </ul>
                </div>

                {publishError && (
                  <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-900">
                    <div className="inline-flex items-center gap-2 font-medium">
                      <AlertTriangle className="h-4 w-4" />
                      Publish failed
                    </div>
                    <p className="mt-1">{publishError}</p>
                  </div>
                )}

                <div className="space-y-3">
                  <Button
                    size="lg"
                    className="w-full rounded-xl"
                    onClick={handlePublish}
                    disabled={isPublishing}
                  >
                    {isPublishing ? "Publishing..." : "Publish makerspace"}
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="w-full rounded-xl"
                  >
                    <Link href="/app/admin/onboarding/certification">
                      Back to setup
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>After publishing</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">Invite members</p>
                  <p className="mt-1">
                    Share your makerspace link so members can join and begin certifications.
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">Keep building</p>
                  <p className="mt-1">
                    Add more machines, edit certifications, and manage safety content from your admin dashboard.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}