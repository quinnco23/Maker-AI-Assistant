import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { ArrowLeft, MapPin, ShieldCheck, Wrench } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type MachineDetailData = {
  machine: {
    id: string;
    name: string;
    type: string;
    brand?: string | null;
    model?: string | null;
    locationLabel?: string | null;
    description?: string | null;
    requiresCertification: boolean;
    status: string;
    imageUrl?: string | null;
  };
  certificationProgram?: {
    id: string;
    title?: string;
  } | null;
  certificationStatus: string;
  canUseMachine: boolean;
  lockReason?: string | null;
};

export default function MemberMachineDetailPage() {
  const [, params] = useRoute("/app/member/machines/:machineId");
  const machineId = params?.machineId;

  const [data, setData] = useState<MachineDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadMachineDetail() {
      try {
        setIsLoading(true);

        const res = await fetch(`/api/member/machines/${machineId}`, {
          credentials: "include",
        });

        if (!res.ok) {
          const text = await res.text();
          console.error("Machine detail failed:", {
            status: res.status,
            body: text,
          });
          throw new Error("Failed to fetch machine detail");
        }

        const json = await res.json();

        if (mounted) {
          setData(json);
        }
      } catch (error) {
        console.error("Failed to load machine detail:", error);
        if (mounted) {
          setData(null);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    if (machineId) {
      loadMachineDetail();
    }

    return () => {
      mounted = false;
    };
  }, [machineId]);

  if (isLoading) {
    return <div className="p-6">Loading machine...</div>;
  }

  if (!data) {
    return (
      <div className="p-6">
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardContent className="space-y-4 p-8">
            <h1 className="text-2xl font-bold">Machine not found</h1>
            <p className="text-slate-600">
              We could not load this machine.
            </p>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/app/member/home">Back to My Makerspace</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { machine, certificationProgram, certificationStatus, canUseMachine, lockReason } = data;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <Button asChild variant="ghost" className="rounded-xl">
        <Link href="/app/member/home">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to My Makerspace
        </Link>
      </Button>

      <Card className="overflow-hidden rounded-3xl border-0 shadow-sm">
        <CardContent className="grid gap-6 p-6 md:grid-cols-[280px_1fr]">
          <div className="flex h-64 items-center justify-center rounded-3xl bg-slate-100">
            {machine.imageUrl ? (
              <img
                src={machine.imageUrl}
                alt={machine.name}
                className="h-full w-full rounded-3xl object-cover"
              />
            ) : (
              <Wrench className="h-16 w-16 text-slate-400" />
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {machine.type}
              </span>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
                {certificationStatus}
              </span>
            </div>

            <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950">
              {machine.name}
            </h1>

            <p className="mt-2 text-slate-600">
              {[machine.brand, machine.model].filter(Boolean).join(" • ")}
            </p>

            {machine.locationLabel && (
              <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                <MapPin className="h-4 w-4" />
                {machine.locationLabel}
              </div>
            )}

            <p className="mt-4 max-w-3xl text-slate-700">
              {machine.description || "No machine description has been added yet."}
            </p>

            <div className="mt-6">
              {canUseMachine ? (
                <Button className="rounded-xl">
                  Start Machine Session
                </Button>
              ) : certificationProgram ? (
                <Button asChild className="rounded-xl">
                  <Link href={`/app/member/training/${certificationProgram.id}`}>
                    Start Certification
                  </Link>
                </Button>
              ) : (
                <Button disabled className="rounded-xl">
                  Machine Locked
                </Button>
              )}
            </div>

            {lockReason && (
              <p className="mt-3 text-sm text-amber-700">
                {lockReason}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Machine Details</CardTitle>
            <CardDescription>
              Basic machine information and access status.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <div>Type: {machine.type}</div>
            <div>Status: {machine.status}</div>
            <div>Requires Certification: {machine.requiresCertification ? "Yes" : "No"}</div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Certification</CardTitle>
            <CardDescription>
              Your current access status for this machine.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-slate-600">
            <div>Status: {certificationStatus}</div>
            <div>
              Program: {certificationProgram?.title ?? "No certification program"}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}