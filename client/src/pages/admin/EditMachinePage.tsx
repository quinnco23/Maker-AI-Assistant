import * as React from "react";
import { Link, useRoute, useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

export default function EditMachinePage() {
  const [, params] = useRoute("/app/admin/machines/:machineId");
  const [, setLocation] = useLocation();

  const machineId = params?.machineId;
  const [machine, setMachine] = React.useState<MachineRecord | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    async function loadMachine() {
      try {
        setIsLoading(true);

        const res = await fetch(`/api/admin/machines/${machineId}`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to load machine");
        }

        const data = await res.json();
        setMachine(data.machine);
      } catch (error) {
        console.error("Failed to load machine:", error);
      } finally {
        setIsLoading(false);
      }
    }

    if (machineId) {
      loadMachine();
    }
  }, [machineId]);

  async function handleSave() {
    if (!machine) return;

    try {
      setIsSaving(true);

      const res = await fetch(`/api/admin/machines/${machine.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(machine),
      });

      if (!res.ok) {
        throw new Error("Failed to save machine");
      }

      setLocation("/app/admin/machines");
    } catch (error) {
      console.error("Failed to save machine:", error);
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="mx-auto max-w-4xl p-6">Loading machine...</div>;
  }

  if (!machine) {
    return <div className="mx-auto max-w-4xl p-6">Machine not found.</div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <Link
        href="/app/admin/machines"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to machines
      </Link>

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Edit Machine</CardTitle>
          <CardDescription>
            Update machine details and makerspace settings.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium">Machine name</label>
            <Input
              value={machine.name}
              onChange={(e) => setMachine({ ...machine, name: e.target.value })}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Brand</label>
              <Input
                value={machine.brand || ""}
                onChange={(e) => setMachine({ ...machine, brand: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Model</label>
              <Input
                value={machine.model || ""}
                onChange={(e) => setMachine({ ...machine, model: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <Input
              value={machine.locationLabel}
              onChange={(e) => setMachine({ ...machine, locationLabel: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Input
              value={machine.description}
              onChange={(e) => setMachine({ ...machine, description: e.target.value })}
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="requiresCertification"
              type="checkbox"
              checked={machine.requiresCertification}
              onChange={(e) =>
                setMachine({ ...machine, requiresCertification: e.target.checked })
              }
            />
            <label htmlFor="requiresCertification" className="text-sm font-medium">
              Certification required
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select
              value={machine.status}
              onChange={(e) =>
                setMachine({
                  ...machine,
                  status: e.target.value as MachineRecord["status"],
                })
              }
              className="h-10 w-full rounded-md border px-3"
            >
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} disabled={isSaving} className="rounded-xl">
              {isSaving ? "Saving..." : "Save changes"}
            </Button>

            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/app/admin/machines">Cancel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}