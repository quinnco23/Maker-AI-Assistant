import { Link } from "wouter";
import {
  Play,
  Wrench,
  FolderPlus,
  ShieldCheck,
  ArrowRight,
  Zap,
  Clock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function MemberHome() {
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-welcome">
          Welcome back, Jane
        </h1>
        <p className="text-muted-foreground mt-1">
          Pick up where you left off or start something new.
        </p>
      </div>

      <div className="rounded-md border border-chart-3/30 bg-chart-3/5 p-4 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-chart-3 mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium">Safety Reminder</p>
          <p className="text-sm text-muted-foreground">
            Always run the pre-flight checklist before operating any equipment. Review SOPs for unfamiliar tools.
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Continue</h2>
        <Card className="hover-elevate">
          <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
            <div className="space-y-1">
              <CardTitle className="text-base">Laser Cutter Session</CardTitle>
              <CardDescription className="flex items-center gap-1.5 flex-wrap">
                <Clock className="h-3.5 w-3.5" />
                Yesterday at 3:45 PM
              </CardDescription>
            </div>
            <Badge variant="outline">In Progress</Badge>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You were running a cut session on the Epilog Fusion Pro. 3 of 5 checklist items completed.
            </p>
          </CardContent>
          <CardFooter>
            <Link href="/app/member/session">
              <Button data-testid="button-continue-session">
                Resume Session
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link href="/app/member/session">
            <Card className="hover-elevate cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Play className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm">Start Session</CardTitle>
                  <CardDescription className="text-xs">Begin a guided session</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/app/member/tools">
            <Card className="hover-elevate cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-chart-2/10 text-chart-2">
                  <Wrench className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm">Tools Library</CardTitle>
                  <CardDescription className="text-xs">Browse equipment and docs</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>

          <Link href="/app/member/projects">
            <Card className="hover-elevate cursor-pointer h-full">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-chart-5/10 text-chart-5">
                  <FolderPlus className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-sm">New Project</CardTitle>
                  <CardDescription className="text-xs">Plan your next build</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {[
            { label: "Completed pre-flight checklist for Laser Cutter", time: "Yesterday", icon: ShieldCheck },
            { label: "Started a new cut session", time: "Yesterday", icon: Zap },
            { label: "Viewed Epilog Fusion Pro manual", time: "2 days ago", icon: Wrench },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 text-sm"
              data-testid={`text-activity-${i}`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                <item.icon className="h-4 w-4" />
              </div>
              <span className="flex-1">{item.label}</span>
              <span className="text-muted-foreground text-xs">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
