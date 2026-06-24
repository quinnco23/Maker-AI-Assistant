import * as React from "react";
import { Link, useRoute, useLocation } from "wouter";
import { Building2, MapPin, Globe, ArrowLeft, CheckCircle2 } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


type Makerspace = {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  website?: string;
  logoUrl?: string;
};

export default function JoinMakerspacePage() {
  const [, params] = useRoute("/join/:slug");
  const [, setLocation] = useLocation();

  const slug = params?.slug;

  const [makerspace, setMakerspace] = React.useState<Makerspace | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isJoining, setIsJoining] = React.useState(false);
  const [joinSuccess, setJoinSuccess] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    async function loadMakerspace() {
      if (!slug) {
        setError("Missing makerspace slug.");
        setIsLoading(false);
        return;
      }
  
      try {
        setIsLoading(true);
        setError("");
  
        const res = await fetch(`/api/makerspaces/by-slug/${slug}`, {
          credentials: "include",
        });
  
        const json = await res.json();
  
        if (!res.ok) {
          throw new Error(json.message || "Failed to load makerspace");
        }
  
        setMakerspace(json.makerspace);
      } catch (error) {
        console.error("Failed to load makerspace:", error);
        setError("Could not find this makerspace.");
        setMakerspace(null);
      } finally {
        setIsLoading(false);
      }
    }
  
    loadMakerspace();
  }, [slug]);

  async function handleJoin() {
    if (!slug) return;

    try {
      setIsJoining(true);
      setError("");

      const res = await fetch(`/api/makerspaces/by-slug/${slug}/join`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to join makerspace");
      }

      await res.json();
      setJoinSuccess(true);

      setTimeout(() => {
        setLocation("/app/member/home");
      }, 900);
    } catch (error) {
      console.error("Failed to join makerspace:", error);
      setError("Could not join this makerspace.");
    } finally {
      setIsJoining(false);
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="rounded-2xl border bg-white p-6">Loading makerspace...</div>
      </div>
    );
  }

  if (!makerspace) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardContent className="space-y-4 p-8">
            <h1 className="text-2xl font-bold text-slate-900">Makerspace not found</h1>
            <p className="text-slate-600">
              The join link may be incorrect or this makerspace may no longer be available.
            </p>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/">Back to home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-5xl p-6 md:p-10">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="rounded-3xl border-0 shadow-sm">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
                  <Building2 className="h-8 w-8 text-slate-500" />
                </div>

                <div>
                  <div className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                    Join Makerspace
                  </div>

                  <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                    {makerspace.name}
                  </h1>

                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-600">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {makerspace.location}
                    </span>

                    {makerspace.website && (
                      <span className="inline-flex items-center gap-1">
                        <Globe className="h-4 w-4" />
                        {makerspace.website}
                      </span>
                    )}
                  </div>

                  <p className="mt-4 max-w-2xl text-slate-600">
                    {makerspace.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-0 shadow-sm">
            <CardHeader>
              <CardTitle>Become a member</CardTitle>
              <CardDescription>
                Join this makerspace to view machines, complete certifications, and participate.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {joinSuccess ? (
                <div className="rounded-2xl bg-emerald-50 p-4 text-emerald-900">
                  <div className="inline-flex items-center gap-2 font-medium">
                    <CheckCircle2 className="h-4 w-4" />
                    Joined successfully
                  </div>
                  <p className="mt-1 text-sm">
                    Redirecting you to your member dashboard...
                  </p>
                </div>
              ) : (
                <>
                  <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    You’ll be added as a member and can start working through required certifications.
                  </div>

                  {error && (
                    <div className="rounded-2xl bg-rose-50 p-4 text-sm text-rose-900">
                      {error}
                    </div>
                  )}

<Button
  onClick={() => setLocation(`/join/${makerspace.slug}/signup`)}
  className="w-full rounded-xl"
>
  Join {makerspace.name}
</Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}