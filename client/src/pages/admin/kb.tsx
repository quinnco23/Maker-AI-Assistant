import { useState } from "react";
import { Link } from "wouter";
import { Upload, ExternalLink, FileText, Search } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";

interface KBDoc {
  id: string;
  title: string;
  tool: string;
  model: string;
  topic: string;
  tags: string[];
  published: boolean;
}

const initialDocs: KBDoc[] = [
  { id: "d1", title: "Epilog Fusion Pro Operating Manual", tool: "Laser Cutter", model: "Epilog Fusion Pro", topic: "Operation", tags: ["SOP", "Safety"], published: true },
  { id: "d2", title: "Laser Cutter Material Guide", tool: "Laser Cutter", model: "All", topic: "Materials", tags: ["Reference", "Materials"], published: true },
  { id: "d3", title: "Prusa MK4 Quick Start Guide", tool: "3D Printer", model: "Prusa MK4", topic: "Setup", tags: ["Quick Start", "FDM"], published: true },
  { id: "d4", title: "Resin Safety Data Sheet", tool: "3D Printer", model: "Formlabs Form 3+", topic: "Safety", tags: ["SDS", "Safety", "Resin"], published: false },
  { id: "d5", title: "Soldering Station Best Practices", tool: "Electronics", model: "Hakko FX-888D", topic: "Technique", tags: ["Best Practices"], published: true },
  { id: "d6", title: "General Shop Safety Orientation", tool: "General", model: "N/A", topic: "Safety", tags: ["Orientation", "Safety"], published: true },
];

export default function AdminKB() {
  const [docs, setDocs] = useState(initialDocs);
  const [search, setSearch] = useState("");

  const togglePublished = (id: string) => {
    setDocs((prev) =>
      prev.map((d) => (d.id === id ? { ...d, published: !d.published } : d))
    );
  };

  const filtered = docs.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.tool.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">
            Knowledge Base
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage SOPs, manuals, and reference documents for your makerspace.
          </p>
        </div>
        <Link href="/app/member/tools">
          <Button variant="outline" data-testid="button-preview-member">
            <ExternalLink className="h-4 w-4" />
            Preview as member
          </Button>
        </Link>
      </div>

      <div
        className="border-2 border-dashed rounded-md p-8 text-center space-y-3"
        data-testid="dropzone-kb-upload"
      >
        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Drag and drop documents here, or click to browse
        </p>
        <Button variant="outline" size="sm" data-testid="button-kb-browse">
          Browse Files
        </Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
            data-testid="input-kb-search"
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Tool</TableHead>
                <TableHead className="hidden md:table-cell">Model</TableHead>
                <TableHead className="hidden lg:table-cell">Topic</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Published</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((doc) => (
                <TableRow key={doc.id} data-testid={`row-doc-${doc.id}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="font-medium">{doc.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{doc.tool}</TableCell>
                  <TableCell className="text-muted-foreground hidden md:table-cell">{doc.model}</TableCell>
                  <TableCell className="text-muted-foreground hidden lg:table-cell">{doc.topic}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 flex-wrap">
                      {doc.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="no-default-hover-elevate text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Switch
                      checked={doc.published}
                      onCheckedChange={() => togglePublished(doc.id)}
                      data-testid={`switch-publish-${doc.id}`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
