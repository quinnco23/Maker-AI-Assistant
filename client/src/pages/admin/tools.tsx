import { useState } from "react";
import { Wrench, Plus, Cpu, Printer, Zap } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface ToolData {
  id: string;
  name: string;
  icon: typeof Wrench;
  enabled: boolean;
  models: { id: string; name: string; manufacturer: string; sopReady: boolean }[];
}

const initialTools: ToolData[] = [
  {
    id: "laser",
    name: "Laser Cutter",
    icon: Zap,
    enabled: true,
    models: [
      { id: "m1", name: "Epilog Fusion Pro", manufacturer: "Epilog", sopReady: true },
      { id: "m2", name: "Glowforge Pro", manufacturer: "Glowforge", sopReady: true },
      { id: "m3", name: "Universal VLS6.75", manufacturer: "Universal Laser Systems", sopReady: false },
    ],
  },
  {
    id: "3d",
    name: "3D Printer",
    icon: Printer,
    enabled: true,
    models: [
      { id: "m4", name: "Prusa MK4", manufacturer: "Prusa Research", sopReady: true },
      { id: "m5", name: "Formlabs Form 3+", manufacturer: "Formlabs", sopReady: false },
    ],
  },
  {
    id: "electronics",
    name: "Electronics",
    icon: Cpu,
    enabled: false,
    models: [
      { id: "m6", name: "Hakko FX-888D", manufacturer: "Hakko", sopReady: false },
    ],
  },
];

export default function AdminTools() {
  const [tools, setTools] = useState(initialTools);

  const toggleTool = (id: string) => {
    setTools((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">
            Tools & Models
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage equipment categories and machine models.
          </p>
        </div>
        <Button data-testid="button-add-model">
          <Plus className="h-4 w-4" />
          Add Model
        </Button>
      </div>

      <div className="space-y-6">
        {tools.map((tool) => (
          <Card key={tool.id}>
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <tool.icon className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-base">{tool.name}</CardTitle>
                  <CardDescription>{tool.models.length} model{tool.models.length !== 1 ? "s" : ""} configured</CardDescription>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {tool.enabled ? "Enabled" : "Disabled"}
                </span>
                <Switch
                  checked={tool.enabled}
                  onCheckedChange={() => toggleTool(tool.id)}
                  data-testid={`switch-tool-${tool.id}`}
                />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model Name</TableHead>
                    <TableHead>Manufacturer</TableHead>
                    <TableHead className="text-right">SOP Ready</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tool.models.map((model) => (
                    <TableRow key={model.id} data-testid={`row-model-${model.id}`}>
                      <TableCell className="font-medium">{model.name}</TableCell>
                      <TableCell className="text-muted-foreground">{model.manufacturer}</TableCell>
                      <TableCell className="text-right">
                        {model.sopReady ? (
                          <Badge variant="secondary" className="no-default-hover-elevate">Ready</Badge>
                        ) : (
                          <Badge variant="outline" className="no-default-hover-elevate">Pending</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
