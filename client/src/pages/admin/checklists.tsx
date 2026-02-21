import { useState } from "react";
import { Plus, GripVertical, Pencil, Trash2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ChecklistStep {
  id: string;
  text: string;
  mandatory: boolean;
}

interface ChecklistData {
  id: string;
  name: string;
  toolId: string;
  modelId: string;
  mandatory: boolean;
  steps: ChecklistStep[];
}

const initialChecklists: ChecklistData[] = [
  {
    id: "c1",
    name: "Laser Cutter Pre-Flight",
    toolId: "laser",
    modelId: "epilog-fusion-pro",
    mandatory: true,
    steps: [
      { id: "s1", text: "Verify ventilation system is running", mandatory: true },
      { id: "s2", text: "Check material compatibility", mandatory: true },
      { id: "s3", text: "Inspect lens for debris", mandatory: true },
      { id: "s4", text: "Confirm bed is level", mandatory: false },
      { id: "s5", text: "Run test cut on scrap material", mandatory: false },
    ],
  },
  {
    id: "c2",
    name: "3D Printer Startup",
    toolId: "3d",
    modelId: "prusa-mk4",
    mandatory: true,
    steps: [
      { id: "s6", text: "Level the print bed", mandatory: true },
      { id: "s7", text: "Load filament", mandatory: true },
      { id: "s8", text: "Clean nozzle", mandatory: false },
    ],
  },
  {
    id: "c3",
    name: "Soldering Safety Check",
    toolId: "electronics",
    modelId: "hakko-fx888d",
    mandatory: false,
    steps: [
      { id: "s9", text: "Verify fume extraction is on", mandatory: true },
      { id: "s10", text: "Inspect tip condition", mandatory: false },
    ],
  },
];

export default function AdminChecklists() {
  const [checklists, setChecklists] = useState(initialChecklists);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStepText, setNewStepText] = useState("");

  const editingChecklist = checklists.find((c) => c.id === editingId);

  const addStep = () => {
    if (!newStepText.trim() || !editingId) return;
    setChecklists((prev) =>
      prev.map((c) =>
        c.id === editingId
          ? {
              ...c,
              steps: [
                ...c.steps,
                { id: `s-${Date.now()}`, text: newStepText.trim(), mandatory: false },
              ],
            }
          : c
      )
    );
    setNewStepText("");
  };

  const removeStep = (checklistId: string, stepId: string) => {
    setChecklists((prev) =>
      prev.map((c) =>
        c.id === checklistId
          ? { ...c, steps: c.steps.filter((s) => s.id !== stepId) }
          : c
      )
    );
  };

  const toggleStepMandatory = (checklistId: string, stepId: string) => {
    setChecklists((prev) =>
      prev.map((c) =>
        c.id === checklistId
          ? {
              ...c,
              steps: c.steps.map((s) =>
                s.id === stepId ? { ...s, mandatory: !s.mandatory } : s
              ),
            }
          : c
      )
    );
  };

  const toggleChecklistMandatory = (checklistId: string) => {
    setChecklists((prev) =>
      prev.map((c) =>
        c.id === checklistId ? { ...c, mandatory: !c.mandatory } : c
      )
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">
          Checklist Builder
        </h1>
        <p className="text-muted-foreground mt-1">
          Create and manage pre-flight checklists for equipment.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Existing Checklists</h2>
          {checklists.map((cl) => (
            <Card
              key={cl.id}
              className={editingId === cl.id ? "border-primary" : "hover-elevate"}
            >
              <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <div className="min-w-0">
                  <CardTitle className="text-sm">{cl.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {cl.steps.length} steps
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {cl.mandatory && (
                    <Badge variant="secondary" className="no-default-hover-elevate">Mandatory</Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingId(editingId === cl.id ? null : cl.id)}
                    data-testid={`button-edit-${cl.id}`}
                    aria-label={`Edit checklist`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div>
          {editingChecklist ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Edit: {editingChecklist.name}</h2>

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium">Assign to Tool</label>
                  <Select defaultValue={editingChecklist.toolId}>
                    <SelectTrigger className="mt-1" data-testid="select-tool">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="laser">Laser Cutter</SelectItem>
                      <SelectItem value="3d">3D Printer</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Assign to Model</label>
                  <Select defaultValue={editingChecklist.modelId}>
                    <SelectTrigger className="mt-1" data-testid="select-model">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="epilog-fusion-pro">Epilog Fusion Pro</SelectItem>
                      <SelectItem value="glowforge-pro">Glowforge Pro</SelectItem>
                      <SelectItem value="prusa-mk4">Prusa MK4</SelectItem>
                      <SelectItem value="hakko-fx888d">Hakko FX-888D</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <label className="text-sm font-medium">Mandatory Checklist</label>
                  <Switch
                    checked={editingChecklist.mandatory}
                    onCheckedChange={() => toggleChecklistMandatory(editingChecklist.id)}
                    data-testid="switch-mandatory"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <p className="text-sm font-medium">Steps</p>
                {editingChecklist.steps.map((step, i) => (
                  <div
                    key={step.id}
                    className="flex items-center gap-2 rounded-md border p-2"
                    data-testid={`step-${step.id}`}
                  >
                    <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 cursor-grab" />
                    <span className="text-sm flex-1">{step.text}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="text-[10px] text-muted-foreground">
                        {step.mandatory ? "Required" : "Optional"}
                      </span>
                      <Switch
                        checked={step.mandatory}
                        onCheckedChange={() => toggleStepMandatory(editingChecklist.id, step.id)}
                        data-testid={`switch-step-mandatory-${step.id}`}
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeStep(editingChecklist.id, step.id)}
                        data-testid={`button-remove-step-${step.id}`}
                        aria-label="Remove step"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Input
                  placeholder="Add a new step..."
                  value={newStepText}
                  onChange={(e) => setNewStepText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addStep()}
                  data-testid="input-new-step"
                />
                <Button onClick={addStep} data-testid="button-add-step">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <div className="text-center space-y-2">
                <Pencil className="h-8 w-8 mx-auto" />
                <p className="text-sm">Select a checklist to edit</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
