import * as React from "react";
import { Link } from "wouter";
import {
    Building2,
    MapPin,
    ShieldCheck,
    AlertTriangle,
    Wrench,
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
  certificationStatus:
    | "not_required"
    | "not_certified"
    | "certified"
    | "expired"
    | "pending_review";
  certificationProgram?: {
    id: string;
    title?: string;
  } | null;
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

    const { makerspace, machines } = data;

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
                                    <Button
                                    disabled={!machine.certificationProgram}
                                    onClick={() => {
                                      if (machine.certificationProgram) {
                                        navigate(`/app/member/training/${machine.certificationProgram.id}`);
                                      }
                                    }}
                                  >
                                    {machine.certificationProgram
                                      ? "Start Certification"
                                      : "No Certification Available"}
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