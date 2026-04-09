import * as React from "react";
import { Link } from "wouter";
import { Plus, Wrench, Printer, ScanLine, Cog, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type MachineRecord = {
  id: string;
  name: string;
  type: string;
  brand?: string;
  model?: string;
  locationLabel: string;
  description: string;
  requiresCertification: boolean;
  status: "active" | "inactive" | "maintenance";
};

function getMachineIcon(type: string) {
  const normalized = type.toLowerCase();

  if (normalized.includes("3d")) return <Printer className="h-5 w-5" />;
  if (normalized.includes("laser")) return <ScanLine className="h-5 w-5" />;
  if (normalized.includes("cnc")) return <Cog className="h-5 w-5" />;

  return <Wrench className="h-5 w-5" />;
}

function getStatusClass(status: MachineRecord["status"]) {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "maintenance":
      return "bg-amber-100 text-amber-800";
    case "inactive":
      return "bg-rose-100 text-rose-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export default function ManageMachinesPage() {
  const [machines, setMachines] = React.useState<MachineRecord[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadMachines() {
      try {
        setIsLoading(true);

        const res = await fetch("/api/admin/machines", {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to load machines");
        }

        const data = await res.json();
        setMachines(data.machines || []);
      } catch (error) {
        console.error("Failed to load machines:", error);
      } finally {
        setIsLoading(false);
      }
    }

    loadMachines();
  }, []);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Manage Machines
          </h1>
          <p className="mt-1 text-slate-600">
            Edit machines, locations, certification requirements, and status.
          </p>
        </div>

        <Button asChild className="rounded-xl">
          <Link href="/app/admin/machinecat">
            <Plus className="mr-2 h-4 w-4" />
            Add machine
          </Link>
        </Button>
      </div>

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Machines</CardTitle>
          <CardDescription>
            All machines currently added to your makerspace
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="rounded-2xl border bg-white p-6">Loading machines...</div>
          ) : machines.length === 0 ? (
            <div className="rounded-2xl border border-dashed bg-slate-50 p-6 text-center">
              <h3 className="font-semibold text-slate-900">No machines yet</h3>
              <p className="mt-2 text-sm text-slate-600">
                Add your first machine from the catalogue.
              </p>
              <Button asChild className="mt-4 rounded-xl">
                <Link href="/app/admin/machinecat">Browse catalogue</Link>
              </Button>
            </div>
          ) : (
            machines.map((machine) => (
              <div key={machine.id} className="rounded-2xl border bg-white p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                      {getMachineIcon(machine.type)}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-slate-900">{machine.name}</h3>
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusClass(machine.status)}`}>
                          {machine.status}
                        </span>
                        {machine.requiresCertification && (
                          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                            <span className="inline-flex items-center gap-1">
                              <ShieldCheck className="h-3 w-3" />
                              Certification required
                            </span>
                          </span>
                        )}
                      </div>

                      <p className="mt-1 text-sm text-slate-600">
                        {[machine.brand, machine.model].filter(Boolean).join(" • ") || machine.type}
                      </p>

                      <p className="mt-2 text-sm text-slate-600">{machine.description}</p>

                      <div className="mt-3 text-xs text-slate-500">
                        Location: {machine.locationLabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="rounded-xl">
                      <Link href={`/app/admin/machines/${machine.id}`}>Edit</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}