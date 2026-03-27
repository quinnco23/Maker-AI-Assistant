import * as React from "react";
import { Link, useLocation } from "wouter";
import {
  CheckCircle2,
  Copy,
  Mail,
  Users,
  ArrowLeft,
  Rocket,
  Link as LinkIcon,
  ShieldCheck,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type PublishedMakerspace = {
  id: string;
  createdAt: string;
  makerspace?: {
    name: string;
    slug: string;
    location: string;
    description: string;
    website?: string;
  };
  machine?: {
    name: string;
    type: string;
    brand?: string;
    model?: string;
    locationLabel: string;
    description: string;
    requiresCertification: boolean;
  };
  certification?: {
    mode: "template" | "duplicate" | "custom" | "none";
    templateId?: string;
    title?: string;
    estimatedMinutes?: number;
    passingScore?: number;
  };
};

function StepProgress() {
  const steps = ["Welcome", "Makerspace", "Machine", "Certification", "Review", "Invite"];

  return (
    <div className="flex flex-wrap gap-2">
      {steps.map((step, index) => {
        const isComplete = index <= 4;
        const isCurrent = index === 5;

        return (
          <div
            key={step}
            className={[
              "rounded-full px-3 py-1.5 text-sm font-medium",
              isCurrent
                ? "bg-slate-900 text-white"
                : isComplete
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-slate-100 text-slate-600",
            ].join(" ")}
          >
            {step}
          </div>
        );
      })}
    </div>
  );
}

function parseEmails(input: string) {
  return input
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);
}

export default function InviteMembersPage() {
  const [, setLocation] = useLocation();

  const [published, setPublished] = React.useState<PublishedMakerspace | null>(null);
  const [inviteInput, setInviteInput] = React.useState("");
  const [copied, setCopied] = React.useState(false);
  const [isSending, setIsSending] = React.useState(false);
  const [sendMessage, setSendMessage] = React.useState("");

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("makerspace_published");
      const parsed: PublishedMakerspace | null = raw ? JSON.parse(raw) : null;

      if (!parsed?.makerspace?.slug) {
        setLocation("/app/admin/onboarding");
        return;
      }

      setPublished(parsed);
    } catch (error) {
      console.error(error);
      setLocation("/app/admin/onboarding");
    }
  }, [setLocation]);

  const joinUrl = React.useMemo(() => {
    if (!published?.makerspace?.slug) return "";
    return `${window.location.origin}/join/${published.makerspace.slug}`;
  }, [published]);

  async function handleCopyLink() {
    if (!joinUrl) return;

    try {
      await navigator.clipboard.writeText(joinUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleSendInvites() {
    const emails = parseEmails(inviteInput);

    if (emails.length === 0) {
      setSendMessage("Enter one or more email addresses separated by commas.");
      return;
    }

    try {
      setIsSending(true);
      setSendMessage("");

      // Replace this with your real API call later.
      // Example:
      // const res = await fetch("/api/makerspaces/invite", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   credentials: "include",
      //   body: JSON.stringify({
      //     makerspaceId: published?.id,
      //     emails,
      //   }),
      // });
      //
      // if (!res.ok) throw new Error("Failed to send invites");

      await new Promise((resolve) => setTimeout(resolve, 700));

      setSendMessage(`Invite ready for ${emails.length} member${emails.length > 1 ? "s" : ""}.`);
      setInviteInput("");
    } catch (error) {
      console.error(error);
      setSendMessage("Something went wrong while preparing invites.");
    } finally {
      setIsSending(false);
    }
  }

  if (!published) return null;

  const makerspaceName = published.makerspace?.name ?? "Your Makerspace";
  const firstMachineName = published.machine?.name ?? "First machine";

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="space-y-3">
            <Link
              href="/app/admin/onboarding/review"
              className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to review
            </Link>

            <StepProgress />
          </div>

          <div className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700">
            Step 5 of 5
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardContent className="p-8">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
                  <CheckCircle2 className="h-4 w-4" />
                  Makerspace published
                </div>

                <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">
                  {makerspaceName} is live
                </h1>

                <p className="mt-3 max-w-2xl text-base text-slate-600">
                  Your makerspace has been created with your first machine and certification setup.
                  Now invite members so they can join, learn, and get certified.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Makerspace
                    </div>
                    <div className="mt-1 font-semibold text-slate-900">{makerspaceName}</div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      First machine
                    </div>
                    <div className="mt-1 font-semibold text-slate-900">{firstMachineName}</div>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Certification
                    </div>
                    <div className="mt-1 font-semibold text-slate-900">
                      {published.certification?.title || "Not required"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Share your join link</CardTitle>
                <CardDescription>
                  Members can use this link to join your makerspace and start learning.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="rounded-2xl border bg-slate-50 p-4">
                  <div className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-slate-700">
                    <LinkIcon className="h-4 w-4" />
                    Join URL
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <div className="min-w-0 flex-1 rounded-xl bg-white px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
                      <span className="break-all">{joinUrl}</span>
                    </div>

                    <Button
                      type="button"
                      onClick={handleCopyLink}
                      className="rounded-xl"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      {copied ? "Copied" : "Copy link"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Invite by email</CardTitle>
                <CardDescription>
                  Add one or more email addresses separated by commas.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Input
                    value={inviteInput}
                    onChange={(e) => setInviteInput(e.target.value)}
                    placeholder="alex@example.com, sam@example.com"
                  />
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    onClick={handleSendInvites}
                    disabled={isSending}
                    className="rounded-xl"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    {isSending ? "Preparing..." : "Send invites"}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-xl"
                    onClick={() => setInviteInput("")}
                  >
                    Clear
                  </Button>
                </div>

                {sendMessage && (
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    {sendMessage}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>What members can do next</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-sm text-slate-600">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Users className="h-4 w-4 text-slate-700" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Join your makerspace</p>
                      <p className="mt-1">
                        Members create a profile and connect to your space online.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                      <ShieldCheck className="h-4 w-4 text-slate-700" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Complete certifications</p>
                      <p className="mt-1">
                        They can review safety requirements and complete machine training.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Rocket className="h-4 w-4 text-slate-700" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">Start using the space</p>
                      <p className="mt-1">
                        Certified members can interact with the machine catalog and your online makerspace.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-0 shadow-sm">
              <CardHeader>
                <CardTitle>Next admin actions</CardTitle>
              </CardHeader>

              <CardContent className="space-y-3">
                <Button asChild size="lg" className="w-full rounded-xl">
                  <Link href="/app/admin/dashboard">Go to dashboard</Link>
                </Button>

                <Button asChild variant="outline" size="lg" className="w-full rounded-xl">
                  <Link href="/app/admin/machines/new">Add another machine</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}