import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";

export default function SignUp() {
  const [, setLocation] = useLocation();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    document.title = "Sign Up - Makerspace AI Assistant";
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLocation("/app/admin/onboarding");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
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
          <CardTitle className="text-xl">Create a Makerspace</CardTitle>
          <CardDescription>
            Set up your makerspace and start onboarding members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Makerspace Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="My Makerspace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="input-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-email"
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
                data-testid="input-password"
              />
            </div>
            <Button type="submit" className="w-full" data-testid="button-signup">
              Create Makerspace
            </Button>
          </form>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
              or continue with
            </span>
          </div>

          <div className="space-y-2">
            <Button variant="outline" className="w-full" data-testid="button-signup-google">
              <Mail />
              Google
            </Button>
            <Button variant="outline" className="w-full" data-testid="button-signup-passkey">
              <KeyRound />
              Passkey
            </Button>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/signin" data-testid="link-goto-signin">
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
