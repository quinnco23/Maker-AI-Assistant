import { useState } from "react";
import { ShieldAlert, MessageSquare } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const tools = ["Laser Cutter", "3D Printer", "Electronics"];
const materials = ["PVC", "Polycarbonate", "ABS", "Styrofoam", "Fiberglass", "Vinyl", "Lexan"];

const initialMatrix: Record<string, string[]> = {
  "Laser Cutter": ["PVC", "Polycarbonate", "Vinyl", "ABS"],
  "3D Printer": ["PVC", "Fiberglass"],
  Electronics: [],
};

const certTools = [
  { id: "laser", name: "Laser Cutter", required: true },
  { id: "3d", name: "3D Printer", required: true },
  { id: "electronics", name: "Electronics", required: false },
];

const escalationTriggers = [
  { id: "unknown-material", label: "Unknown material detected", checked: true },
  { id: "equipment-error", label: "Equipment error reported", checked: true },
  { id: "user-unsure", label: "User expresses uncertainty", checked: false },
  { id: "cert-expired", label: "Certification expired", checked: true },
];

export default function AdminSafety() {
  const [matrix, setMatrix] = useState(initialMatrix);
  const [certRequired, setCertRequired] = useState<Record<string, boolean>>(
    Object.fromEntries(certTools.map((t) => [t.id, t.required]))
  );
  const [triggers, setTriggers] = useState<Record<string, boolean>>(
    Object.fromEntries(escalationTriggers.map((t) => [t.id, t.checked]))
  );

  const toggleMatrix = (tool: string, material: string) => {
    setMatrix((prev) => {
      const current = prev[tool] || [];
      return {
        ...prev,
        [tool]: current.includes(material)
          ? current.filter((m) => m !== material)
          : [...current, material],
      };
    });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">
          Safety Rules
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure prohibited materials, certification requirements, and escalation behavior.
        </p>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Prohibited Materials Matrix</h2>
        <Card>
          <CardContent className="p-0">
            <div className="overflow-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="p-4 text-left font-medium text-muted-foreground">Material</th>
                    {tools.map((tool) => (
                      <th key={tool} className="p-4 text-center font-medium text-muted-foreground">
                        {tool}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {materials.map((mat) => (
                    <tr key={mat} className="border-b last:border-b-0">
                      <td className="p-4 font-medium">{mat}</td>
                      {tools.map((tool) => (
                        <td key={tool} className="p-4 text-center">
                          <Checkbox
                            checked={(matrix[tool] || []).includes(mat)}
                            onCheckedChange={() => toggleMatrix(tool, mat)}
                            data-testid={`checkbox-matrix-${mat.toLowerCase()}-${tool.toLowerCase().replace(/\s/g, "-")}`}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-4">Certification Gating</h2>
        <Card>
          <CardContent className="pt-6 space-y-4">
            {certTools.map((tool) => (
              <div key={tool.id} className="flex items-center justify-between gap-4" data-testid={`cert-gate-${tool.id}`}>
                <div>
                  <p className="text-sm font-medium">{tool.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {certRequired[tool.id] ? "Certification required before use" : "No certification required"}
                  </p>
                </div>
                <Switch
                  checked={certRequired[tool.id]}
                  onCheckedChange={(checked) =>
                    setCertRequired((prev) => ({ ...prev, [tool.id]: checked }))
                  }
                  data-testid={`switch-cert-${tool.id}`}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-4">Escalation Triggers</h2>
        <Card>
          <CardContent className="pt-6 space-y-3">
            {escalationTriggers.map((trigger) => (
              <label
                key={trigger.id}
                className="flex items-center gap-3 text-sm cursor-pointer"
              >
                <Checkbox
                  checked={triggers[trigger.id]}
                  onCheckedChange={(checked) =>
                    setTriggers((prev) => ({ ...prev, [trigger.id]: !!checked }))
                  }
                  data-testid={`checkbox-escalation-${trigger.id}`}
                />
                {trigger.label}
              </label>
            ))}
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-4">Coach Mode</h2>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-chart-1" />
              <CardTitle className="text-base">Strict Tone Preview</CardTitle>
            </div>
            <CardDescription>
              When safety rules are triggered, the AI assistant uses this tone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border p-4 bg-muted/50 text-sm space-y-2" data-testid="text-coach-preview">
              <p className="font-medium">
                STOP: This material is not approved for this equipment.
              </p>
              <p className="text-muted-foreground">
                Using PVC in a laser cutter produces chlorine gas, which is extremely hazardous.
                Please remove the material immediately and consult a staff member before proceeding.
                Your session has been paused and a staff notification has been sent.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
