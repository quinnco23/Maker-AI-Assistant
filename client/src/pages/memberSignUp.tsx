import { useEffect, useState } from "react";
import { Link, useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

export default function MemberSignUp() {
  const [, params] = useRoute("/join/:slug/signup");
  const slug = params?.slug;

  const [, setLocation] = useLocation();

  const [makerspaceName, setMakerspaceName] = useState("this makerspace");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.title = "Join Makerspace - Makerspace AI Assistant";
  }, []);

  useEffect(() => {
    async function loadMakerspace() {
      if (!slug) return;

      try {
        setIsLoading(true);

        const res = await fetch(`/api/makerspaces/by-slug/${slug}`);

        if (!res.ok) {
          throw new Error("Makerspace not found");
        }

        const json = await res.json();
        setMakerspaceName(json.makerspace?.name ?? "this makerspace");
      } catch (error) {
        console.error("Failed to load makerspace:", error);
        setErrorMessage("Could not find this makerspace.");
      } finally {
        setIsLoading(false);
      }
    }

    loadMakerspace();
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!slug) {
      setErrorMessage("Missing makerspace slug.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const signupRes = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName,
          email,
          password,
        }),
      });

      const signupJson = await signupRes.json();

      if (!signupRes.ok) {
        throw new Error(signupJson.message || "Failed to create account");
      }

      const joinRes = await fetch(`/api/makerspaces/by-slug/${slug}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      const joinJson = await joinRes.json();

      if (!joinRes.ok) {
        throw new Error(joinJson.message || "Failed to join makerspace");
      }

      setLocation("/app/member/home");
    } catch (error) {
      console.error("Member signup failed:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Member signup failed",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">

<Link href="/" data-testid="link-home" >

            <img src="/Logo330.png" className="h-20" />
          </Link>

      <div className="mb-6">
        <Link href="/" data-testid="link-back-home">
          <Button variant="ghost" size="sm">
            <ArrowLeft />
            Back to home
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">
            Join {isLoading ? "Makerspace" : makerspaceName}
          </CardTitle>
          <CardDescription>
            Create your member account to access machines and certifications.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Jane Member"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="member@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? "Joining..." : "Create Member Account"}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin">
              <span className="font-medium text-foreground underline underline-offset-4">
                Sign in
              </span>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}