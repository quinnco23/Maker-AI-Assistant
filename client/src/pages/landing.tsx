import { useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Wrench,
  ClipboardCheck,
  PhoneCall,
  ShieldAlert,
  Award,
  ArrowUpRight,
  Upload,
  ShieldCheck,
  Eye,
  BarChart3,
  BookOpen,
  ListChecks,
  FolderKanban,
  MessageSquare,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "@/lib/theme-context";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <Button
      size="icon"
      variant="ghost"
      onClick={toggleTheme}
      data-testid="button-theme-toggle"
    >
      {theme === "light" ? <Moon /> : <Sun />}
    </Button>
  );
}

export default function Landing() {
  useEffect(() => {
    document.title = "Makerspace AI Assistant - Safety-First Virtual Coach";
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute(
        "content",
        "Makerspace AI Assistant gives members step-by-step guidance on high-use tools while enforcing pre-flight checklists and escalating to staff when risk is detected."
      );
    } else {
      const newMeta = document.createElement("meta");
      newMeta.name = "description";
      newMeta.content =
        "Makerspace AI Assistant gives members step-by-step guidance on high-use tools while enforcing pre-flight checklists and escalating to staff when risk is detected.";
      document.head.appendChild(newMeta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3 flex-wrap">
          <Link href="/" data-testid="link-home">
            <span className="text-lg font-semibold tracking-tight">Makerspace AI</span>
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <ThemeToggle />
            <Link href="/signin">
              <Button variant="ghost" data-testid="link-signin">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button data-testid="link-signup-nav">Create a Makerspace</Button>
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center sm:py-32">
          <Badge variant="secondary" className="mb-6">
            Safety-First AI Coaching
          </Badge>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Your makerspace&apos;s safety-first virtual coach.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            Makerspace AI Assistant gives members step-by-step guidance on high-use
            tools&mdash;starting with 3D printers, laser cutters, and
            electronics&mdash;while enforcing pre-flight checklists and escalating to
            staff when risk is detected.
          </p>
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link href="/signup">
              <Button size="lg" data-testid="button-create-makerspace">
                Create a Makerspace
              </Button>
            </Link>
            <Link href="/app/member/home">
              <Button size="lg" variant="outline" data-testid="button-try-demo">
                Try Member Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">How It Works</h2>
          <p className="mt-2 text-muted-foreground">
            Three steps from selecting a tool to safe, guided operation.
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {[
            {
              icon: Wrench,
              step: "1",
              title: "Choose Tool + Machine Model",
              description:
                "Select the tool you need and its specific make and model. The assistant loads the right manual and safety data.",
            },
            {
              icon: ClipboardCheck,
              step: "2",
              title: "Run Pre-Flight Checklist",
              description:
                "Walk through a guided checklist before powering on. Get step-by-step help for your task with safety guardrails.",
            },
            {
              icon: PhoneCall,
              step: "3",
              title: "Risk Detected \u2192 Coach Handoff",
              description:
                "If the AI detects a safety concern, it generates a handoff summary and connects you with a certified coach.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="flex flex-col items-center text-center"
              data-testid={`step-${item.step}`}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-md bg-primary/10 text-primary">
                <item.icon className="h-7 w-7" />
              </div>
              <Badge variant="outline" className="mt-4">
                Step {item.step}
              </Badge>
              <h3 className="mt-3 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Safety-First by Design
            </h2>
            <p className="mt-2 text-muted-foreground">
              Every interaction is built around keeping your members safe.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: ShieldAlert,
                title: "Prohibited Materials",
                description:
                  "The assistant knows which materials are banned for each tool and will block unsafe operations before they start.",
              },
              {
                icon: Award,
                title: "Certification Gating",
                description:
                  "Members must hold valid certifications for each tool. Uncertified users are guided to training resources.",
              },
              {
                icon: ArrowUpRight,
                title: "Escalation Ladder",
                description:
                  "A clear escalation path from AI guidance to coach handoff to emergency stop ensures no risk goes unaddressed.",
              },
            ].map((item) => (
              <Card
                key={item.title}
                className="hover-elevate"
                data-testid={`card-safety-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <CardHeader>
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{item.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Built for Everyone
          </h2>
          <p className="mt-2 text-muted-foreground">
            Powerful admin controls. Intuitive member experience.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <Card className="hover-elevate" data-testid="card-for-admins">
            <CardHeader>
              <Badge variant="outline" className="w-fit">
                For Admins
              </Badge>
              <CardTitle className="text-xl">Manage Your Makerspace</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[
                  { icon: Upload, text: "Upload SOPs and machine manuals" },
                  { icon: ShieldCheck, text: "Define safety rules and prohibited materials" },
                  { icon: Eye, text: "View and resolve escalations in real time" },
                  { icon: BarChart3, text: "Track usage metrics and safety trends" },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="hover-elevate" data-testid="card-for-members">
            <CardHeader>
              <Badge variant="outline" className="w-fit">
                For Members
              </Badge>
              <CardTitle className="text-xl">Learn and Build Safely</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {[
                  { icon: BookOpen, text: "Access machine manuals and quick-start guides" },
                  { icon: ListChecks, text: "Complete pre-flight checklists before every use" },
                  { icon: FolderKanban, text: "Keep project logs and track your builds" },
                  { icon: MessageSquare, text: "Get AI-guided help sessions with safety rails" },
                ].map((item) => (
                  <li key={item.text} className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6 text-sm text-muted-foreground flex-wrap">
          <span data-testid="text-copyright">
            Makerspace AI Assistant
          </span>
          <div className="flex items-center gap-6 flex-wrap">
            <Link href="#" data-testid="link-privacy">
              <span className="hover:text-foreground transition-colors">Privacy</span>
            </Link>
            <Link href="#" data-testid="link-terms">
              <span className="hover:text-foreground transition-colors">Terms</span>
            </Link>
            <Link href="#" data-testid="link-contact">
              <span className="hover:text-foreground transition-colors">Contact</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
