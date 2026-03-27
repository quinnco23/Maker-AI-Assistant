import { Link } from "wouter";
import { Rocket, ShieldCheck, Wrench, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminOnboardingWelcome() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-12">
        <div className="grid w-full gap-8 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <div className="mb-4 inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <Rocket className="h-4 w-4" />
              Makerspace Setup
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Build your Makerspace
            </h1>

            <p className="mt-4 max-w-xl text-lg text-slate-600">
              Set up your makerspace profile, add machines setup certification
              and get your members learning and operating safely.
            </p>

            <div className="mt-8 space-y-4">
              <FeatureRow
                icon={<Wrench className="h-5 w-5" />}
                title="Add machines and tools"
                description="Create your machine catalog with locations, docs, and operating details."
              />
              <FeatureRow
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Enable certifications"
                description="Attach training and safety modules before members use equipment."
              />
              <FeatureRow
                icon={<Users className="h-5 w-5" />}
                title="Invite members"
                description="Bring your community online so they can learn, certify, and participate."
              />
            </div>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-xl px-6">
                <Link href="/app/admin/onboarding/makerspace">
                  Get Started
                </Link>
              </Button>

              <Button asChild variant="outline" size="lg" className="rounded-xl px-6">
                <Link href="/app/admin/dashboard">
                  Skip for now
                </Link>
              </Button>
            </div>

            <p className="mt-4 text-sm text-slate-500">
              Setup usually takes 3–5 minutes.
            </p>
          </div>

          <div className="flex items-center">
            <Card className="w-full rounded-3xl border-0 shadow-xl">
              <CardContent className="p-8">
                <div className="mb-6 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Onboarding Progress
                    </p>
                    <h2 className="text-2xl font-semibold text-slate-900">
                      What you’ll set up
                    </h2>
                  </div>
                  <div className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    Step 0 of 5
                  </div>
                </div>

                <div className="space-y-4">
                  <OnboardingStep
                    number="1"
                    title="Create your makerspace"
                    description="Name your space, add your location, and create your public profile."
                  />
                  <OnboardingStep
                    number="2"
                    title="Add your first machine"
                    description="Add equipment like 3D printers, laser cutters, CNC routers, and more."
                  />
                  <OnboardingStep
                    number="3"
                    title="Attach certification"
                    description="Choose a template or create a machine-specific training flow."
                  />
                  <OnboardingStep
                    number="4"
                    title="Review and publish"
                    description="Confirm your setup and make your makerspace available to members."
                  />
                  <OnboardingStep
                    number="5"
                    title="Invite your members"
                    description="Share access so users can join, learn, and complete certifications."
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureRow({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}

function OnboardingStep({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
        {number}
      </div>
      <div>
        <h3 className="font-medium text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>
    </div>
  );
}