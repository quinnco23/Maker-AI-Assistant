import { useState } from "react";
import { Link } from "wouter";
import {
  Wrench,
  FileText,
  ShieldAlert,
  Check,
  Upload,
  X,
  ArrowRight,
  ArrowLeft,
  PartyPopper,
  Trash2,
  File,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const steps = [
  { title: "Choose Tools", icon: Wrench },
  { title: "Upload SOPs", icon: FileText },
  { title: "Safety Gates", icon: ShieldAlert },
];

const toolBundles = [
  { id: "laser", label: "Laser Cutter", description: "Epilog, Glowforge, and universal laser systems" },
  { id: "3d", label: "3D Printer", description: "FDM, SLA, and resin printing equipment" },
  { id: "electronics", label: "Electronics", description: "Soldering stations, oscilloscopes, and bench tools" },
];

const mockFiles = [
  { name: "Epilog_Fusion_Pro_SOP.pdf", size: "2.4 MB" },
  { name: "Laser_Safety_Guidelines.pdf", size: "1.1 MB" },
  { name: "3D_Printer_Quick_Start.pdf", size: "890 KB" },
];

const prohibitedMaterials = ["PVC", "Polycarbonate", "ABS (laser)", "Styrofoam", "Fiberglass"];

const escalationTriggers = [
  { id: "unknown-material", label: "Unknown material detected" },
  { id: "equipment-error", label: "Equipment error reported" },
  { id: "user-unsure", label: "User expresses uncertainty" },
  { id: "cert-expired", label: "Certification expired" },
];

export default function AdminSetup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedTools, setSelectedTools] = useState<string[]>(["laser"]);
  const [uploadedFiles, setUploadedFiles] = useState(mockFiles);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(["PVC", "Polycarbonate"]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(["unknown-material", "equipment-error"]);
  const [completed, setCompleted] = useState(false);

  const toggleTool = (id: string) => {
    setSelectedTools((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleMaterial = (m: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]
    );
  };

  const toggleTrigger = (id: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const removeFile = (name: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== name));
  };

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
    else setCompleted(true);
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  if (completed) {
    return (
      <div className="p-6 max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-chart-2/10 text-chart-2">
          <PartyPopper className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-setup-complete">
          Your makerspace is live!
        </h1>
        <p className="text-muted-foreground max-w-md">
          Everything is configured and ready. Members can now access guided sessions, safety checklists, and your knowledge base.
        </p>
        <Link href="/app/member/home">
          <Button data-testid="button-open-member-demo">
            Open Member Demo
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">
          Setup Wizard
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure your makerspace in three quick steps.
        </p>
      </div>

      <div className="flex items-center gap-2">
        {steps.map((step, i) => (
          <div key={step.title} className="flex items-center gap-2 flex-1">
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-medium ${
                i < currentStep
                  ? "bg-chart-2 text-white"
                  : i === currentStep
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
              data-testid={`step-indicator-${i}`}
            >
              {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-sm hidden sm:inline ${i === currentStep ? "font-medium" : "text-muted-foreground"}`}>
              {step.title}
            </span>
            {i < steps.length - 1 && <Separator className="flex-1" />}
          </div>
        ))}
      </div>

      {currentStep === 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Choose Tool Bundles</h2>
          <p className="text-sm text-muted-foreground">
            Select the equipment categories available in your makerspace.
          </p>
          <div className="space-y-3">
            {toolBundles.map((bundle) => (
              <Card
                key={bundle.id}
                className={`hover-elevate cursor-pointer ${selectedTools.includes(bundle.id) ? "border-primary" : ""}`}
                onClick={() => toggleTool(bundle.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && toggleTool(bundle.id)}
                data-testid={`checkbox-tool-${bundle.id}`}
              >
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                  <Checkbox
                    checked={selectedTools.includes(bundle.id)}
                    onCheckedChange={() => toggleTool(bundle.id)}
                    data-testid={`input-tool-${bundle.id}`}
                  />
                  <div className="flex-1">
                    <CardTitle className="text-sm">{bundle.label}</CardTitle>
                    <CardDescription className="text-xs">{bundle.description}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {currentStep === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Upload SOPs & Manuals</h2>
          <p className="text-sm text-muted-foreground">
            Drag and drop files or click to browse. Supported formats: PDF, DOCX, TXT.
          </p>
          <div
            className="border-2 border-dashed rounded-md p-8 text-center space-y-3 cursor-pointer"
            data-testid="dropzone-upload"
          >
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drop files here, or click to browse
            </p>
            <Button variant="outline" size="sm" data-testid="button-browse-files">
              Browse Files
            </Button>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Uploaded Files</p>
              {uploadedFiles.map((file) => (
                <div
                  key={file.name}
                  className="flex items-center justify-between gap-3 rounded-md border p-3"
                  data-testid={`file-${file.name}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <File className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-sm truncate">{file.name}</span>
                    <span className="text-xs text-muted-foreground shrink-0">{file.size}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeFile(file.name)}
                    data-testid={`button-remove-${file.name}`}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Set Safety Gates</h2>
            <p className="text-sm text-muted-foreground">
              Configure prohibited materials and escalation triggers.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium">Prohibited Materials</p>
            <p className="text-xs text-muted-foreground">
              Select materials that should trigger a safety warning.
            </p>
            <div className="space-y-2">
              {prohibitedMaterials.map((mat) => (
                <label
                  key={mat}
                  className="flex items-center gap-3 text-sm cursor-pointer"
                >
                  <Checkbox
                    checked={selectedMaterials.includes(mat)}
                    onCheckedChange={() => toggleMaterial(mat)}
                    data-testid={`checkbox-material-${mat.toLowerCase().replace(/[\s()]/g, "-")}`}
                  />
                  {mat}
                </label>
              ))}
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <p className="text-sm font-medium">Escalation Triggers</p>
            <p className="text-xs text-muted-foreground">
              Choose events that should automatically escalate to staff.
            </p>
            <div className="space-y-2">
              {escalationTriggers.map((trigger) => (
                <label
                  key={trigger.id}
                  className="flex items-center gap-3 text-sm cursor-pointer"
                >
                  <Checkbox
                    checked={selectedTriggers.includes(trigger.id)}
                    onCheckedChange={() => toggleTrigger(trigger.id)}
                    data-testid={`checkbox-trigger-${trigger.id}`}
                  />
                  {trigger.label}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-2 pt-4">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleNext} data-testid="button-next">
          {currentStep === 2 ? "Finish Setup" : "Next"}
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
