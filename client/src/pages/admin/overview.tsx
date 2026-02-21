import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ClipboardCheck,
  Shield,
  Accessibility,
  Clock,
  TrendingUp,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const kpis = [
  { label: "Sessions Today", value: "24", icon: Activity, color: "text-chart-1", bg: "bg-chart-1/10" },
  { label: "Escalations", value: "3", icon: AlertTriangle, color: "text-chart-4", bg: "bg-chart-4/10" },
  { label: "Checklist Completion", value: "89%", icon: ClipboardCheck, color: "text-chart-2", bg: "bg-chart-2/10" },
  { label: "Deflection Estimate", value: "72%", icon: TrendingUp, color: "text-chart-5", bg: "bg-chart-5/10" },
];

const gates = [
  { label: "Supported tools configured", status: "complete" as const },
  { label: "SOP readiness", status: "complete" as const },
  { label: "Safety rules configured", status: "complete" as const },
  { label: "Accessibility enabled", status: "complete" as const },
  { label: "Retention policy set", status: "partial" as const },
];

export default function AdminOverview() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">
          Dashboard Overview
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor your makerspace at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="hover-elevate" data-testid={`card-kpi-${kpi.label.toLowerCase().replace(/\s/g, "-")}`}>
            <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
              <CardDescription className="text-sm font-medium">{kpi.label}</CardDescription>
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md ${kpi.bg} ${kpi.color}`}>
                <kpi.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold tracking-tight" data-testid={`text-kpi-value-${kpi.label.toLowerCase().replace(/\s/g, "-")}`}>
                {kpi.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-4">Decision Gates</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Readiness Checklist</CardTitle>
            <CardDescription>
              Review system readiness before going live with your makerspace.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {gates.map((gate) => (
              <div key={gate.label} className="flex items-center gap-3" data-testid={`gate-${gate.label.toLowerCase().replace(/\s/g, "-")}`}>
                {gate.status === "complete" ? (
                  <CheckCircle2 className="h-5 w-5 text-chart-2 shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-chart-3 shrink-0" />
                )}
                <span className="text-sm flex-1">{gate.label}</span>
                {gate.status === "complete" ? (
                  <Badge variant="secondary" className="no-default-hover-elevate">Complete</Badge>
                ) : (
                  <Badge variant="outline" className="no-default-hover-elevate">Partial</Badge>
                )}
              </div>
            ))}
            <Separator />
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-muted-foreground">Overall readiness</span>
              <span className="text-sm font-medium">80%</span>
            </div>
            <Progress value={80} className="h-2" />
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { label: "New escalation: Unknown material detected on Laser Cutter", time: "10 minutes ago", icon: AlertTriangle, iconColor: "text-chart-4" },
            { label: "Pre-flight checklist completed by Alex Rivera", time: "25 minutes ago", icon: ClipboardCheck, iconColor: "text-chart-2" },
            { label: "Safety rules updated for Electronics workbench", time: "1 hour ago", icon: Shield, iconColor: "text-chart-1" },
            { label: "Accessibility settings reviewed", time: "2 hours ago", icon: Accessibility, iconColor: "text-chart-5" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-sm" data-testid={`text-recent-${i}`}>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <item.icon className={`h-4 w-4 ${item.iconColor}`} />
              </div>
              <span className="flex-1">{item.label}</span>
              <span className="text-muted-foreground text-xs flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {item.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
