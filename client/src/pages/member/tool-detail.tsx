import { Link } from "wouter";
import { FileText, Download, Crosshair } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

interface DocumentCard {
  title: string;
  tags: string[];
}

const documents: Record<string, DocumentCard[]> = {
  manuals: [
    { title: "Epilog Fusion Pro - User Manual", tags: ["Official", "v2.1"] },
    { title: "Material Settings Guide", tags: ["Reference"] },
    { title: "Software Setup (Epilog Dashboard)", tags: ["Setup"] },
  ],
  specs: [
    { title: "Epilog Fusion Pro - Technical Specifications", tags: ["Hardware"] },
    { title: "Laser Power & Speed Matrix", tags: ["Reference", "Chart"] },
  ],
  sop: [
    { title: "Standard Operating Procedure - Laser Cutter", tags: ["Mandatory"] },
    { title: "Job File Preparation SOP", tags: ["Workflow"] },
  ],
  safety: [
    { title: "Laser Safety Guidelines", tags: ["Critical", "Required"] },
    { title: "Emergency Shutdown Procedure", tags: ["Emergency"] },
    { title: "PPE Requirements", tags: ["Required"] },
  ],
  troubleshooting: [
    { title: "Common Cut Quality Issues", tags: ["FAQ"] },
    { title: "Alignment & Calibration Guide", tags: ["Maintenance"] },
    { title: "Error Code Reference", tags: ["Reference"] },
  ],
};

function DocumentList({ items }: { items: DocumentCard[] }) {
  return (
    <div className="space-y-3 mt-4">
      {items.map((doc, i) => (
        <div
          key={i}
          className="flex items-start justify-between gap-4 rounded-md border p-4"
          data-testid={`text-doc-${i}`}
        >
          <div className="flex items-start gap-3">
            <FileText className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div className="space-y-1.5">
              <p className="text-sm font-medium">{doc.title}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {doc.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <Button variant="outline" size="sm" data-testid={`button-open-pdf-${i}`}>
            <Download className="h-3.5 w-3.5 mr-1.5" />
            Open PDF
          </Button>
        </div>
      ))}
    </div>
  );
}

export default function ToolDetail({ params }: { params: { toolId: string } }) {
  const toolName = params.toolId === "laser" ? "Laser Cutter" : params.toolId;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/app/member/tools" data-testid="link-breadcrumb-tools">
                Tools Library
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{toolName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Crosshair className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-tool-name">
            {toolName}
          </h1>
          <p className="text-muted-foreground text-sm">Fabrication</p>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="manuals">
        <TabsList>
          <TabsTrigger value="manuals" data-testid="tab-manuals">Manuals</TabsTrigger>
          <TabsTrigger value="specs" data-testid="tab-specs">Specs</TabsTrigger>
          <TabsTrigger value="sop" data-testid="tab-sop">SOP</TabsTrigger>
          <TabsTrigger value="safety" data-testid="tab-safety">Safety</TabsTrigger>
          <TabsTrigger value="troubleshooting" data-testid="tab-troubleshooting">Troubleshooting</TabsTrigger>
        </TabsList>

        {Object.entries(documents).map(([key, docs]) => (
          <TabsContent key={key} value={key}>
            <DocumentList items={docs} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
