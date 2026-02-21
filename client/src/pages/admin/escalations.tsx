import { useState } from "react";
import {
  AlertTriangle,
  Clock,
  User,
  Paperclip,
  CheckCircle2,
  Eye,
  ArrowLeft,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

interface EscalationData {
  id: string;
  userName: string;
  toolName: string;
  modelName: string;
  triggerReason: string;
  summary: string;
  stepsAttempted: string[];
  status: "new" | "acknowledged" | "resolved";
  createdAt: string;
  resolutionNotes: string;
}

const initialEscalations: EscalationData[] = [
  {
    id: "e1",
    userName: "Alex Rivera",
    toolName: "Laser Cutter",
    modelName: "Epilog Fusion Pro",
    triggerReason: "Unknown material detected",
    summary: "Member attempted to cut an unrecognized acrylic composite. The material safety check flagged it as potentially hazardous. Session was automatically paused.",
    stepsAttempted: [
      "AI assistant asked member to identify the material",
      "Member provided partial material info",
      "System could not verify material safety",
      "Session paused and escalation created",
    ],
    status: "new",
    createdAt: "Feb 21, 10:15 AM",
    resolutionNotes: "",
  },
  {
    id: "e2",
    userName: "Tom Wilson",
    toolName: "3D Printer",
    modelName: "Prusa MK4",
    triggerReason: "Equipment error reported",
    summary: "Print head thermistor reporting inconsistent temperatures. Member reported the first layer was not adhering properly despite correct settings.",
    stepsAttempted: [
      "AI guided member through nozzle temperature check",
      "Member confirmed filament was loaded correctly",
      "Temperature readings remained inconsistent",
      "Escalation created for hardware inspection",
    ],
    status: "new",
    createdAt: "Feb 21, 9:30 AM",
    resolutionNotes: "",
  },
  {
    id: "e3",
    userName: "Jane Cooper",
    toolName: "Laser Cutter",
    modelName: "Glowforge Pro",
    triggerReason: "User expresses uncertainty",
    summary: "Member was unsure about correct power settings for 6mm plywood. AI provided guidelines but member requested staff confirmation before proceeding.",
    stepsAttempted: [
      "AI provided recommended settings from knowledge base",
      "Member expressed uncertainty about power level",
      "AI suggested test cut on scrap",
      "Member requested human staff assistance",
    ],
    status: "acknowledged",
    createdAt: "Feb 20, 3:45 PM",
    resolutionNotes: "Reviewing with member during next visit.",
  },
  {
    id: "e4",
    userName: "Emily Davis",
    toolName: "Electronics",
    modelName: "Hakko FX-888D",
    triggerReason: "Certification expired",
    summary: "Member's electronics certification expired on Feb 15. System blocked session start and notified staff.",
    stepsAttempted: [
      "Member attempted to start soldering session",
      "System detected expired certification",
      "Access denied with explanation",
      "Escalation created for recertification",
    ],
    status: "resolved",
    createdAt: "Feb 18, 11:00 AM",
    resolutionNotes: "Recertification scheduled for Feb 22. Member acknowledged and will attend.",
  },
];

const statusColors = {
  new: "destructive" as const,
  acknowledged: "secondary" as const,
  resolved: "outline" as const,
};

export default function AdminEscalations({ params }: { params?: { id?: string } }) {
  const [escalations, setEscalations] = useState(initialEscalations);
  const [selectedId, setSelectedId] = useState<string | null>(params?.id || null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const selected = escalations.find((e) => e.id === selectedId);

  const updateStatus = (id: string, status: "acknowledged" | "resolved") => {
    setEscalations((prev) =>
      prev.map((e) =>
        e.id === id
          ? { ...e, status, resolutionNotes: notes[id] || e.resolutionNotes }
          : e
      )
    );
  };

  const renderRow = (esc: EscalationData) => (
    <div
      key={esc.id}
      role="button"
      tabIndex={0}
      className={`p-4 border-b last:border-b-0 cursor-pointer ${
        selectedId === esc.id ? "bg-muted" : "hover-elevate"
      }`}
      onClick={() => setSelectedId(esc.id)}
      onKeyDown={(e) => e.key === "Enter" && setSelectedId(esc.id)}
      data-testid={`button-escalation-${esc.id}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">{esc.userName}</span>
            <Badge variant={statusColors[esc.status]} className="no-default-hover-elevate capitalize text-xs">
              {esc.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{esc.toolName} &middot; {esc.triggerReason}</p>
        </div>
        <span className="text-[10px] text-muted-foreground shrink-0 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {esc.createdAt}
        </span>
      </div>
    </div>
  );

  const filterByStatus = (status: string) =>
    escalations.filter((e) => e.status === status);

  if (selected) {
    return (
      <div className="p-6 max-w-3xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => setSelectedId(null)} data-testid="button-back-to-inbox">
          <ArrowLeft className="h-4 w-4" />
          Back to Inbox
        </Button>

        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold tracking-tight" data-testid="text-escalation-title">
              Escalation Detail
            </h1>
            <Badge variant={statusColors[selected.status]} className="no-default-hover-elevate capitalize">
              {selected.status}
            </Badge>
          </div>
          <p className="text-muted-foreground mt-1">
            {selected.toolName} &middot; {selected.modelName}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" />
              Member Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Name</span>
              <span className="font-medium" data-testid="text-member-name">{selected.userName}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Tool</span>
              <span>{selected.toolName}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Model</span>
              <span>{selected.modelName}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Trigger</span>
              <span>{selected.triggerReason}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground">Time</span>
              <span>{selected.createdAt}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold">Summary</h2>
          <p className="text-sm text-muted-foreground" data-testid="text-escalation-summary">
            {selected.summary}
          </p>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold">Steps Attempted</h2>
          <ol className="list-decimal list-inside text-sm text-muted-foreground space-y-1">
            {selected.stepsAttempted.map((step, i) => (
              <li key={i} data-testid={`text-step-${i}`}>{step}</li>
            ))}
          </ol>
        </div>

        <div className="space-y-2">
          <h2 className="text-sm font-semibold flex items-center gap-2">
            <Paperclip className="h-4 w-4" />
            Attachments
          </h2>
          <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
            No attachments for this escalation.
          </div>
        </div>

        <Separator />

        <div className="space-y-3">
          <h2 className="text-sm font-semibold">Resolution Notes</h2>
          <Textarea
            placeholder="Add resolution notes..."
            value={notes[selected.id] ?? selected.resolutionNotes}
            onChange={(e) =>
              setNotes((prev) => ({ ...prev, [selected.id]: e.target.value }))
            }
            data-testid="textarea-resolution-notes"
          />
          <div className="flex items-center gap-2 flex-wrap">
            {selected.status === "new" && (
              <Button
                variant="outline"
                onClick={() => updateStatus(selected.id, "acknowledged")}
                data-testid="button-acknowledge"
              >
                <Eye className="h-4 w-4" />
                Acknowledge
              </Button>
            )}
            {selected.status !== "resolved" && (
              <Button
                onClick={() => updateStatus(selected.id, "resolved")}
                data-testid="button-resolve"
              >
                <CheckCircle2 className="h-4 w-4" />
                Resolve
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">
          Escalation Inbox
        </h1>
        <p className="text-muted-foreground mt-1">
          Review and resolve escalated sessions from members.
        </p>
      </div>

      <Tabs defaultValue="new">
        <TabsList data-testid="tabs-escalation-status">
          <TabsTrigger value="new" data-testid="tab-new">
            New ({filterByStatus("new").length})
          </TabsTrigger>
          <TabsTrigger value="acknowledged" data-testid="tab-acknowledged">
            Acknowledged ({filterByStatus("acknowledged").length})
          </TabsTrigger>
          <TabsTrigger value="resolved" data-testid="tab-resolved">
            Resolved ({filterByStatus("resolved").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="new">
          <Card>
            <CardContent className="p-0">
              {filterByStatus("new").length > 0 ? (
                filterByStatus("new").map(renderRow)
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No new escalations.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="acknowledged">
          <Card>
            <CardContent className="p-0">
              {filterByStatus("acknowledged").length > 0 ? (
                filterByStatus("acknowledged").map(renderRow)
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No acknowledged escalations.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resolved">
          <Card>
            <CardContent className="p-0">
              {filterByStatus("resolved").length > 0 ? (
                filterByStatus("resolved").map(renderRow)
              ) : (
                <div className="p-8 text-center text-sm text-muted-foreground">
                  No resolved escalations.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
