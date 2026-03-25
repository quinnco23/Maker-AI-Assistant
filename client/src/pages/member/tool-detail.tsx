import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { FileText, Crosshair, Settings } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
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
  url: string;
}

type CertificationStatus = {
  machineSlug: string;
  status: "certified" | "not_certified" | "expired" | "pending";
  issuedAt: string | null;
  expiresAt: string | null;
};

const documents: Record<string, DocumentCard[]> = {
  manuals: [
    {
      title: "Prusa MK4S - User Manual",
      tags: ["Official", "v2.1"],
      url: "https://www.prusa3d.com/downloads/manual/prusa3d_manual_MK4_MK39_103_en.pdf",
    },
    {
      title: "Material Settings Guide",
      tags: ["Reference"],
      url: "https://help.prusa3d.com/product/mk4/material-guide_220",
    },
    {
      title: "Setup",
      tags: ["Setup"],
      url: "https://your-site.com/pdfs/software-setup-epilog-dashboard.pdf",
    },
  ],
  specs: [
    {
      title: "Epilog Fusion Pro - Technical Specifications",
      tags: ["Hardware"],
      url: "https://your-site.com/pdfs/epilog-fusion-pro-specs.pdf",
    },
    {
      title: "Laser Power & Speed Matrix",
      tags: ["Reference", "Chart"],
      url: "https://your-site.com/pdfs/laser-power-speed-matrix.pdf",
    },
  ],
  sop: [
    {
      title: "Standard Operating Procedure - Laser Cutter",
      tags: ["Mandatory"],
      url: "https://your-site.com/pdfs/laser-cutter-sop.pdf",
    },
    {
      title: "Job File Preparation SOP",
      tags: ["Workflow"],
      url: "https://your-site.com/pdfs/job-file-preparation-sop.pdf",
    },
  ],
  safety: [
    {
      title: "Laser Safety Guidelines",
      tags: ["Critical", "Required"],
      url: "https://your-site.com/pdfs/laser-safety-guidelines.pdf",
    },
    {
      title: "Emergency Shutdown Procedure",
      tags: ["Emergency"],
      url: "https://your-site.com/pdfs/emergency-shutdown-procedure.pdf",
    },
    {
      title: "PPE Requirements",
      tags: ["Required"],
      url: "https://your-site.com/pdfs/ppe-requirements.pdf",
    },
  ],
  troubleshooting: [
    {
      title: "Common Cut Quality Issues",
      tags: ["FAQ"],
      url: "https://your-site.com/pdfs/common-cut-quality-issues.pdf",
    },
    {
      title: "Alignment & Calibration Guide",
      tags: ["Maintenance"],
      url: "https://your-site.com/pdfs/alignment-calibration-guide.pdf",
    },
    {
      title: "Error Code Reference",
      tags: ["Reference"],
      url: "https://your-site.com/pdfs/error-code-reference.pdf",
    },
  ],
};

function slugifyToolName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/%20/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function DocumentList({ items }: { items: DocumentCard[] }) {
  return (
    <div className="mt-4 space-y-3">
      {items.map((doc, i) => (
        <div
          key={i}
          className="flex items-start justify-between gap-4 rounded-md border p-4"
          data-testid={`text-doc-${i}`}
        >
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="space-y-1.5">
              <p className="text-sm font-medium">{doc.title}</p>
              <div className="flex flex-wrap items-center gap-1.5">
                {doc.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <a href={doc.url} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" data-testid={`button-open-pdf-${i}`}>
              <Settings className="mr-1.5 h-3.5 w-3.5" />
              Open
            </Button>
          </a>
        </div>
      ))}
    </div>
  );
}

function CertificationCard({
  isLoading,
  certification,
  trainingHref,
}: {
  isLoading: boolean;
  certification: CertificationStatus | null;
  trainingHref: string;
}) {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold">Operator Certification</h3>

        {isLoading ? (
          <p className="mt-2 text-sm text-slate-500">Checking certification...</p>
        ) : certification?.status === "certified" ? (
          <div className="mt-3">
            <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
              Certified to operate
            </div>
            {certification.expiresAt && (
              <p className="mt-2 text-sm text-slate-600">
                Expires: {new Date(certification.expiresAt).toLocaleDateString()}
              </p>
            )}
          </div>
        ) : certification?.status === "expired" ? (
          <div className="mt-3">
            <div className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
              Certification expired
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Renewal is required before operating this machine.
            </p>
            <Button asChild className="mt-3 rounded-xl">
              <Link href={trainingHref}>Renew certification</Link>
            </Button>
          </div>
        ) : certification?.status === "pending" ? (
          <div className="mt-3">
            <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
              Pending review
            </div>
            <p className="mt-2 text-sm text-slate-600">
              Your training is complete and awaiting approval.
            </p>
          </div>
        ) : (
          <div className="mt-3">
            <div className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-700">
              Not certified
            </div>
            <p className="mt-2 text-sm text-slate-600">
              You must complete training before using this machine.
            </p>
            <Button asChild className="mt-3 rounded-xl">
              <Link href={trainingHref}>Start certification</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function ToolDetail({ params }: { params: { toolId: string } }) {
  const toolName = decodeURIComponent(params.toolId);
  const machineSlug = useMemo(() => slugifyToolName(toolName), [toolName]);

  const [certification, setCertification] = useState<CertificationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadCertification() {
      try {
        setIsLoading(true);

        const res = await fetch(`/api/machines/${machineSlug}/certification-status`, {
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error("Failed to fetch certification");
        }

        const data: CertificationStatus = await res.json();

        if (mounted) {
          setCertification(data);
        }
      } catch (error) {
        if (mounted) {
          setCertification({
            machineSlug,
            status: "not_certified",
            issuedAt: null,
            expiresAt: null,
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadCertification();

    return () => {
      mounted = false;
    };
  }, [machineSlug]);

  const trainingHref = `/app/member/training/${machineSlug}`;

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
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
          <p className="text-sm text-muted-foreground">Fabrication</p>
        </div>
      </div>

     

      <Separator />

      <CertificationCard
        isLoading={isLoading}
        certification={certification}
        trainingHref={trainingHref}
      />

      <Tabs defaultValue="manuals">
        <TabsList>
          <TabsTrigger value="manuals" data-testid="tab-manuals">
            Manuals
          </TabsTrigger>
          <TabsTrigger value="specs" data-testid="tab-specs">
            Specs
          </TabsTrigger>
          <TabsTrigger value="sop" data-testid="tab-sop">
            SOP
          </TabsTrigger>
          <TabsTrigger value="safety" data-testid="tab-safety">
            Safety
          </TabsTrigger>
          <TabsTrigger value="troubleshooting" data-testid="tab-troubleshooting">
            Troubleshooting
          </TabsTrigger>
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