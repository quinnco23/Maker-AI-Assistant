import { Link } from "wouter";
import {
  ClipboardCheck,
  Crosshair,
  Printer,
  Cpu,
  CheckCircle2,
  XCircle,
  Play,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const checklistGroups = [
  {
    tool: "Laser Cutter",
    icon: Crosshair,
    checklists: [
      { id: "lc-preflight", name: "Pre-flight Safety Check", items: 5, mandatory: true },
      { id: "lc-shutdown", name: "Post-session Shutdown", items: 3, mandatory: true },
    ],
  },
  {
    tool: "3D Printer",
    icon: Printer,
    checklists: [
      { id: "3dp-preflight", name: "Pre-print Checklist", items: 4, mandatory: true },
    ],
  },
  {
    tool: "Electronics",
    icon: Cpu,
    checklists: [
      { id: "elec-bench", name: "Workbench Safety Check", items: 3, mandatory: false },
    ],
  },
];

const runHistory = [
  { id: "1", checklist: "Pre-flight Safety Check", tool: "Laser Cutter", date: "Feb 20, 2026", passed: true },
  { id: "2", checklist: "Post-session Shutdown", tool: "Laser Cutter", date: "Feb 20, 2026", passed: true },
  { id: "3", checklist: "Pre-flight Safety Check", tool: "Laser Cutter", date: "Feb 18, 2026", passed: false },
  { id: "4", checklist: "Pre-print Checklist", tool: "3D Printer", date: "Feb 15, 2026", passed: true },
  { id: "5", checklist: "Workbench Safety Check", tool: "Electronics", date: "Feb 10, 2026", passed: true },
];

export default function MemberChecklists() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Checklists</h1>
          <p className="text-muted-foreground mt-1">
            Safety and operational checklists for all equipment.
          </p>
        </div>
        <Link href="/app/member/session">
          <Button data-testid="button-start-checklist">
            <Play className="h-4 w-4 mr-2" />
            Start Checklist
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {checklistGroups.map((group) => (
          <div key={group.tool} className="space-y-3">
            <div className="flex items-center gap-2">
              <group.icon className="h-4 w-4 text-muted-foreground" />
              <h2 className="text-base font-semibold">{group.tool}</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {group.checklists.map((cl) => (
                <Card key={cl.id} className="hover-elevate" data-testid={`card-checklist-${cl.id}`}>
                  <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
                    <div>
                      <CardTitle className="text-sm">{cl.name}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {cl.items} items
                      </CardDescription>
                    </div>
                    {cl.mandatory && (
                      <Badge variant="outline" className="text-[10px]">Mandatory</Badge>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-4">Run History</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Checklist</TableHead>
              <TableHead>Tool</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runHistory.map((run) => (
              <TableRow key={run.id} data-testid={`row-history-${run.id}`}>
                <TableCell className="font-medium text-sm">{run.checklist}</TableCell>
                <TableCell className="text-sm">{run.tool}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{run.date}</TableCell>
                <TableCell>
                  {run.passed ? (
                    <div className="flex items-center gap-1.5 text-chart-2 text-sm">
                      <CheckCircle2 className="h-4 w-4" />
                      Passed
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 text-destructive text-sm">
                      <XCircle className="h-4 w-4" />
                      Failed
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
