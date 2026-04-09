import * as React from "react";
import { Link } from "wouter";
import {
  Building2,
  MapPin,
  ShieldCheck,
  AlertTriangle,
  Wrench,
  Award,
  CheckCircle2,
  Clock3,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type MachineCardRecord = {
  id: string;
  name: string;
  type: string;
  brand?: string;
  model?: string;
  locationLabel: string;
  description: string;
  requiresCertification: boolean;
  status: "active" | "inactive" | "maintenance";
  certificationStatus: "not_required" | "not_certified" | "certified" | "expired";
};

type EarnedCertification = {
  id: string;
  machineId?: string | null;
  machineName: string;
  earnedAt: string;
  expiresAt?: string | null;
  status: "active" | "expired" | "revoked";
};

type MemberDashboardData = {
  makerspace: {
    id: string;
    name: string;
    slug: string;
    location: string;
    description: string;
    website?: string;
  };
  machines: MachineCardRecord[];
  earnedCertifications: EarnedCertification[];
};

function getCertificationBadge(status: MachineCardRecord["certificationStatus"]) {
  switch (status) {
    case "certified":
      return "bg-emerald-100 text-emerald-800";
    case "expired":
      return "bg-amber-100 text-amber-800";
    case "not_required":
      return "bg-slate-100 text-slate-800";
    default:
      return "bg-rose-100 text-rose-800";
  }
}

function getCertificationLabel(status: MachineCardRecord["certificationStatus"]) {
  switch (status) {
    case "certified":
      return "Certified";
    case "expired":
      return "Expired";
    case "not_required":
      return "No certification required";
    default:
      return "Not certified";
  }
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

export default function MemberHome() {
  const [data, setData] = React.useState<MemberDashboardData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadDashboard() {
      try {
        setIsLoading(true);

        const res = await fetch("/api/member/makerspace", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to load member dashboard");
        }

        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Failed to load member dashboard:", error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (isLoading) {
    return <div className="mx-auto max-w-7xl p-6">Loading dashboard...</div>;
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardContent className="space-y-4 p-8">
            <h1 className="text-2xl font-bold">No makerspace found</h1>
            <p className="text-slate-600">
              Join a makerspace first to view machines and certifications.
            </p>
            <Button asChild className="rounded-xl">
              <Link href="/">Browse makerspaces</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { makerspace, machines, earnedCertifications } = data;

  const certifiedCount = machines.filter(
    (machine) => machine.certificationStatus === "certified",
  ).length;

  const neededCount = machines.filter(
    (machine) => machine.certificationStatus === "not_certified" || machine.certificationStatus === "expired",
  ).length;

  const noCertRequiredCount = machines.filter(
    (machine) => machine.certificationStatus === "not_required",
  ).length;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <Card className="rounded-3xl border-0 shadow-sm">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100">
              <Building2 className="h-7 w-7 text-slate-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                {makerspace.name}
              </h1>
              <div className="mt-2 inline-flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="h-4 w-4" />
                {makerspace.location}
              </div>
              <p className="mt-3 max-w-3xl text-slate-600">{makerspace.description}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Machines"
          value={String(machines.length)}
          icon={<Wrench className="h-5 w-5" />}
        />
        <StatCard
          label="Certified"
          value={String(certifiedCount)}
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Need Action"
          value={String(neededCount)}
          icon={<AlertTriangle className="h-5 w-5" />}
        />
        <StatCard
          label="Badges Earned"
          value={String(earnedCertifications.length)}
          icon={<Award className="h-5 w-5" />}
        />
      </div>

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Earned Certifications</CardTitle>
          <CardDescription>
            Certifications you’ve completed successfully.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {earnedCertifications.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-slate-50 p-6 text-center">
              <h3 className="font-semibold text-slate-900">No certifications earned yet</h3>
              <p className="mt-2 text-sm text-slate-600">
                Complete machine certifications to unlock access and earn badges.
              </p>
            </div>
          ) : (
            earnedCertifications.map((cert) => (
              <div key={cert.id} className="rounded-2xl border bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 font-semibold text-slate-900">
                      <Award className="h-4 w-4 text-amber-500" />
                      {cert.machineName}
                    </div>
                    <p className="mt-1 text-sm text-slate-600">
                      Earned {new Date(cert.earnedAt).toLocaleDateString()}
                    </p>
                    {cert.expiresAt && (
                      <p className="mt-1 text-sm text-slate-500">
                        Expires {new Date(cert.expiresAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                    Active
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Machines
        </h2>
        <p className="mt-1 text-slate-600">
          Review machine status and complete certifications to unlock access.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {machines.map((machine) => (
          <Card key={machine.id} className="rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">{machine.name}</CardTitle>
              <CardDescription>
                {[machine.brand, machine.model].filter(Boolean).join(" • ") || machine.type}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">{machine.description}</p>

              <div className="text-sm text-slate-500">
                Location: {machine.locationLabel}
              </div>

              <div
                className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${getCertificationBadge(
                  machine.certificationStatus,
                )}`}
              >
                {getCertificationLabel(machine.certificationStatus)}
              </div>

              <div className="pt-2">
                {machine.certificationStatus === "certified" ? (
                  <Button asChild variant="outline" className="w-full rounded-xl">
                    <Link href={`/app/member/machines/${machine.id}`}>
                      View Machine
                    </Link>
                  </Button>
                ) : machine.certificationStatus === "not_required" ? (
                  <Button asChild className="w-full rounded-xl">
                    <Link href={`/app/member/machines/${machine.id}`}>
                      Open Machine
                    </Link>
                  </Button>
                ) : (
                  <Button asChild className="w-full rounded-xl">
                    <Link href={`/app/member/machines/${machine.id}`}>
                      Start Certification
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}