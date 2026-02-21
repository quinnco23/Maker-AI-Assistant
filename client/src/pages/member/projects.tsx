import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Lightbulb,
  Clock,
  CheckCircle2,
  FileText,
  Link2,
  X,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createProjectSchema, type CreateProject, type Project } from "@shared/schema";

const initialProjects: Project[] = [
  {
    id: "p1",
    userId: "u1",
    name: "Custom Phone Stand",
    tool: "Laser Cutter",
    goal: "Design and cut a phone stand from 3mm plywood",
    status: "idea",
    notes: "Need to finalize dimensions for different phone sizes.",
    linkedSessions: [],
    createdAt: "Feb 19, 2026",
  },
  {
    id: "p2",
    userId: "u1",
    name: "LED Name Badge",
    tool: "Electronics",
    goal: "Build a rechargeable LED name badge with programmable text",
    status: "in_progress",
    notes: "PCB layout done. Need to order components. LED driver circuit tested successfully.",
    linkedSessions: ["s1", "s2"],
    createdAt: "Feb 12, 2026",
  },
  {
    id: "p3",
    userId: "u1",
    name: "Enclosure Prototype v1",
    tool: "3D Printer",
    goal: "Print a snap-fit enclosure for the LED badge electronics",
    status: "in_progress",
    notes: "First print had tolerance issues. Adjusting wall thickness.",
    linkedSessions: ["s3"],
    createdAt: "Feb 14, 2026",
  },
  {
    id: "p4",
    userId: "u1",
    name: "Acrylic Coaster Set",
    tool: "Laser Cutter",
    goal: "Engrave a set of 6 coasters with geometric patterns",
    status: "complete",
    notes: "Completed successfully. Used 4mm clear acrylic.",
    linkedSessions: ["s4", "s5"],
    createdAt: "Feb 5, 2026",
  },
];

const statusConfig = {
  idea: { label: "Idea", icon: Lightbulb, color: "text-chart-3" },
  in_progress: { label: "In Progress", icon: Clock, color: "text-chart-1" },
  complete: { label: "Complete", icon: CheckCircle2, color: "text-chart-2" },
};

export default function MemberProjects() {
  const [projects, setProjects] = useState(initialProjects);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailProject, setDetailProject] = useState<Project | null>(null);

  const form = useForm<CreateProject>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: { name: "", tool: "", goal: "" },
  });

  const onSubmit = (data: CreateProject) => {
    const newProject: Project = {
      id: `p${Date.now()}`,
      userId: "u1",
      name: data.name,
      tool: data.tool,
      goal: data.goal,
      status: "idea",
      notes: "",
      linkedSessions: [],
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setProjects((prev) => [...prev, newProject]);
    form.reset();
    setCreateOpen(false);
  };

  const columns: Array<{ key: Project["status"]; label: string }> = [
    { key: "idea", label: "Idea" },
    { key: "in_progress", label: "In Progress" },
    { key: "complete", label: "Complete" },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground mt-1">
            Track your builds from idea to completion.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)} data-testid="button-create-project">
          <Plus className="h-4 w-4 mr-2" />
          Create Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((col) => {
          const StatusIcon = statusConfig[col.key].icon;
          const filtered = projects.filter((p) => p.status === col.key);
          return (
            <div key={col.key} className="space-y-3">
              <div className="flex items-center gap-2">
                <StatusIcon className={`h-4 w-4 ${statusConfig[col.key].color}`} />
                <h2 className="text-sm font-semibold">{col.label}</h2>
                <Badge variant="secondary" className="text-[10px]">{filtered.length}</Badge>
              </div>
              {filtered.length === 0 && (
                <p className="text-xs text-muted-foreground py-4 text-center">No projects</p>
              )}
              {filtered.map((project) => (
                <Card
                  key={project.id}
                  className="hover-elevate cursor-pointer"
                  onClick={() => setDetailProject(project)}
                  data-testid={`card-project-${project.id}`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">{project.name}</CardTitle>
                    <CardDescription className="text-xs">{project.tool}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground line-clamp-2">{project.goal}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          );
        })}
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Start tracking a new project idea or build.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My new project" {...field} data-testid="input-project-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tool"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tool</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-project-tool">
                          <SelectValue placeholder="Select a tool" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Laser Cutter">Laser Cutter</SelectItem>
                        <SelectItem value="3D Printer">3D Printer</SelectItem>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Goal</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What do you want to build or achieve?"
                        {...field}
                        data-testid="input-project-goal"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit" data-testid="button-submit-project">Create</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!detailProject} onOpenChange={(open) => !open && setDetailProject(null)}>
        <DialogContent className="max-w-lg">
          {detailProject && (
            <>
              <DialogHeader>
                <DialogTitle>{detailProject.name}</DialogTitle>
                <DialogDescription>{detailProject.tool}</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Goal</p>
                  <p className="text-sm">{detailProject.goal}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Badge variant="outline">{statusConfig[detailProject.status].label}</Badge>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" />
                    Notes
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {detailProject.notes || "No notes yet."}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1.5 flex items-center gap-1.5">
                    <Link2 className="h-3.5 w-3.5" />
                    Linked Sessions
                  </p>
                  {detailProject.linkedSessions.length > 0 ? (
                    <div className="flex gap-1.5 flex-wrap">
                      {detailProject.linkedSessions.map((s) => (
                        <Badge key={s} variant="secondary" className="text-[10px]">{s}</Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No linked sessions.</p>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">Created {detailProject.createdAt}</p>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
