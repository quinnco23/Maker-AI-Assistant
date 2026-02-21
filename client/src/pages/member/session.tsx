import { useState, useCallback } from "react";
import {
  Crosshair,
  Cpu,
  Wrench,
  ClipboardCheck,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Check,
  AlertTriangle,
  OctagonAlert,
  Phone,
  Copy,
  Send,
  ShieldCheck,
  Target,
  Settings2,
  Lightbulb,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

const STEPS = [
  { label: "Select Tool", icon: Crosshair },
  { label: "Select Model", icon: Cpu },
  { label: "Select Intent", icon: Target },
  { label: "Pre-flight Checklist", icon: ClipboardCheck },
  { label: "Chat", icon: MessageSquare },
];

const MODELS = [
  { id: "epilog-fusion", name: "Epilog Fusion Pro", manufacturer: "Epilog", specs: "60W CO2, 32x20 in" },
  { id: "glowforge-pro", name: "Glowforge Pro", manufacturer: "Glowforge", specs: "45W CO2, 19.5x11 in" },
  { id: "boss-ls1630", name: "Boss LS-1630", manufacturer: "Boss Laser", specs: "60W CO2, 16x30 in" },
];

const INTENTS = [
  { id: "plan", label: "Plan", description: "Get guidance before you start", icon: Lightbulb },
  { id: "run", label: "Run", description: "Step-by-step operational assistance", icon: Settings2 },
  { id: "troubleshoot", label: "Troubleshoot", description: "Diagnose and fix issues", icon: Wrench },
];

const CHECKLIST_ITEMS = [
  "Verified material is on the approved list",
  "Exhaust system is running",
  "Fire extinguisher is accessible",
  "Lens and mirrors are clean",
  "Bed is clear of debris",
];

const TRIGGER_REASONS = ["unknown material", "equipment error", "user unsure"];

type ChatMessage = { role: "assistant" | "user"; text: string };

const MOCK_MESSAGES: ChatMessage[] = [
  { role: "assistant", text: "Welcome to your Laser Cutter session. How can I help you today?" },
];

export default function MemberSession() {
  const [step, setStep] = useState(0);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedIntent, setSelectedIntent] = useState("");
  const [checklistState, setChecklistState] = useState<boolean[]>(new Array(CHECKLIST_ITEMS.length).fill(false));
  const [messages, setMessages] = useState(MOCK_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [riskLevel, setRiskLevel] = useState<"low" | "medium" | "high">("low");
  const [triggerReason, setTriggerReason] = useState("");
  const { toast } = useToast();

  const allChecked = checklistState.every(Boolean);
  const isStopped = TRIGGER_REASONS.includes(triggerReason);

  const canProceed = useCallback(() => {
    if (step === 1 && !selectedModel) return false;
    if (step === 2 && !selectedIntent) return false;
    if (step === 3 && !allChecked) return false;
    return true;
  }, [step, selectedModel, selectedIntent, allChecked]);

  const handleNext = () => {
    if (canProceed() && step < STEPS.length - 1) setStep(step + 1);
  };
  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages((prev) => [
      ...prev,
      { role: "user" as const, text: inputValue },
      { role: "assistant" as const, text: "I understand. Let me help you with that. Please check the safety panel for the current status." },
    ]);
    setInputValue("");
  };

  const handleCopyHandoff = () => {
    const summary = `Staff Handoff Summary\nTool: Laser Cutter\nModel: ${selectedModel || "Epilog Fusion Pro"}\nIntent: ${selectedIntent || "run"}\nTrigger: ${triggerReason}\nRisk Level: ${riskLevel}\nSteps Attempted: User reported an issue during session.\nAction Required: Staff intervention needed.`;
    navigator.clipboard.writeText(summary);
    toast({ title: "Copied to clipboard", description: "Handoff summary has been copied." });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Guided Session</h1>
        <p className="text-muted-foreground mt-1">
          Follow the steps to start an AI-assisted equipment session.
        </p>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-1">
            <div
              className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap ${
                i === step
                  ? "bg-primary text-primary-foreground font-medium"
                  : i < step
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              }`}
              data-testid={`step-indicator-${i}`}
            >
              {i < step ? (
                <Check className="h-4 w-4" />
              ) : (
                <s.icon className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
            )}
          </div>
        ))}
      </div>

      <Separator />

      {step === 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select Tool</h2>
          <Card className="border-primary">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Crosshair className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-base">Laser Cutter</CardTitle>
                <CardDescription>Fabrication</CardDescription>
              </div>
              <Badge variant="default" className="ml-auto">Selected</Badge>
            </CardHeader>
          </Card>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select Machine Model</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {MODELS.map((model) => (
              <div
                key={model.id}
                role="button"
                tabIndex={0}
                className={`rounded-md border p-4 cursor-pointer transition-colors ${
                  selectedModel === model.id
                    ? "border-primary bg-primary/5"
                    : "hover-elevate"
                }`}
                onClick={() => setSelectedModel(model.id)}
                onKeyDown={(e) => e.key === "Enter" && setSelectedModel(model.id)}
                data-testid={`button-select-model-${model.id}`}
              >
                <p className="text-sm font-medium">{model.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{model.manufacturer}</p>
                <p className="text-xs text-muted-foreground">{model.specs}</p>
                {selectedModel === model.id && (
                  <Badge variant="default" className="mt-2">Selected</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select Intent</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {INTENTS.map((intent) => (
              <div
                key={intent.id}
                role="button"
                tabIndex={0}
                className={`rounded-md border p-4 cursor-pointer transition-colors ${
                  selectedIntent === intent.id
                    ? "border-primary bg-primary/5"
                    : "hover-elevate"
                }`}
                onClick={() => setSelectedIntent(intent.id)}
                onKeyDown={(e) => e.key === "Enter" && setSelectedIntent(intent.id)}
                data-testid={`button-select-intent-${intent.id}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <intent.icon className="h-5 w-5 text-primary" />
                  <p className="text-sm font-medium">{intent.label}</p>
                </div>
                <p className="text-xs text-muted-foreground">{intent.description}</p>
                {selectedIntent === intent.id && (
                  <Badge variant="default" className="mt-2">Selected</Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Pre-flight Checklist</h2>
          <p className="text-sm text-muted-foreground">
            Complete all items before proceeding. This is mandatory for safety compliance.
          </p>
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map((item, i) => (
              <label
                key={i}
                className="flex items-center gap-3 rounded-md border p-4 cursor-pointer"
                data-testid={`checkbox-checklist-${i}`}
              >
                <Checkbox
                  checked={checklistState[i]}
                  onCheckedChange={(checked) => {
                    const next = [...checklistState];
                    next[i] = checked === true;
                    setChecklistState(next);
                  }}
                />
                <span className="text-sm">{item}</span>
              </label>
            ))}
          </div>
          {allChecked && (
            <div className="flex items-center gap-2 text-sm text-chart-2">
              <ShieldCheck className="h-4 w-4" />
              All items verified. You may proceed.
            </div>
          )}
        </div>
      )}

      {step === 4 && (
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="flex-1 flex flex-col min-h-[400px] rounded-md border">
            <div className="border-b px-4 py-3">
              <p className="text-sm font-medium">AI Assistant</p>
              <p className="text-xs text-muted-foreground">Laser Cutter Session</p>
            </div>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-md px-4 py-3 text-sm ${
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                      data-testid={`text-message-${i}`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t p-3 flex gap-2">
              <Input
                placeholder="Type a message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                data-testid="input-chat-message"
              />
              <Button size="icon" onClick={handleSend} data-testid="button-send-message" aria-label="Send message">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="w-full lg:w-72 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Safety Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Risk Level</p>
                  <div className="flex gap-2">
                    {(["low", "medium", "high"] as const).map((level) => (
                      <Button
                        key={level}
                        variant={riskLevel === level ? "default" : "outline"}
                        size="sm"
                        className={
                          riskLevel === level
                            ? level === "low"
                              ? "bg-chart-2 border-chart-2 text-white"
                              : level === "medium"
                              ? "bg-chart-3 border-chart-3 text-white"
                              : "bg-destructive border-destructive text-destructive-foreground"
                            : ""
                        }
                        onClick={() => setRiskLevel(level)}
                        data-testid={`button-risk-${level}`}
                      >
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground mb-1.5">Trigger Reason</p>
                  <Select value={triggerReason} onValueChange={setTriggerReason}>
                    <SelectTrigger data-testid="select-trigger-reason">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {TRIGGER_REASONS.map((r) => (
                        <SelectItem key={r} value={r}>
                          {r}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {!isStopped && (
                  <div className="flex items-center gap-2 text-sm text-chart-2">
                    <ShieldCheck className="h-4 w-4" />
                    <span>Status: Normal</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {isStopped && (
              <>
                <div className="rounded-md border border-destructive/50 bg-destructive/5 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-destructive font-semibold text-sm">
                    <OctagonAlert className="h-5 w-5" />
                    STOP - Safety Trigger Active
                  </div>
                  <p className="text-xs text-muted-foreground">
                    A safety trigger has been activated: <span className="font-medium text-foreground">{triggerReason}</span>. Please call a coach for assistance.
                  </p>
                  <Button variant="destructive" className="w-full" data-testid="button-call-coach">
                    <Phone className="h-4 w-4 mr-2" />
                    Call a Coach
                  </Button>
                </div>

                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between gap-2">
                      <CardTitle className="text-sm">Staff Handoff Summary</CardTitle>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleCopyHandoff}
                        data-testid="button-copy-handoff"
                        aria-label="Copy handoff summary"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="text-xs space-y-1.5 text-muted-foreground">
                    <p><span className="font-medium text-foreground">Tool:</span> Laser Cutter</p>
                    <p><span className="font-medium text-foreground">Model:</span> {MODELS.find((m) => m.id === selectedModel)?.name || "Epilog Fusion Pro"}</p>
                    <p><span className="font-medium text-foreground">Intent:</span> {selectedIntent || "run"}</p>
                    <p><span className="font-medium text-foreground">Trigger:</span> {triggerReason}</p>
                    <p><span className="font-medium text-foreground">Risk:</span> {riskLevel}</p>
                    <p><span className="font-medium text-foreground">Action:</span> Staff intervention needed</p>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      )}

      {step < 4 && (
        <div className="flex items-center justify-between gap-2 pt-4">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={step === 0}
            data-testid="button-step-back"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            data-testid="button-step-next"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
