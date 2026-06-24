import { useEffect } from "react";
import { useLocation } from "wouter";

function AppHomeRedirect() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    async function routeUser() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const json = await res.json();

        if (!json.user) {
          setLocation("/signin");
          return;
        }

        const memberships = json.memberships ?? [];

        const adminMembership = memberships.find((m: any) =>
          ["owner", "admin", "instructor"].includes(
            String(m.role).toLowerCase(),
          ),
        );

        const memberMembership = memberships.find(
          (m: any) => String(m.role).toLowerCase() === "member",
        );

        // Admin wins if the user has both admin and member memberships
        if (adminMembership) {
          const onboardingComplete =
            json.adminMakerspace?.onboardingCompleted === true;

          setLocation(
            onboardingComplete
              ? "app/admin/setup"
              : "/app/admin/onboarding",
          );
          return;
        }

        if (memberMembership) {
          setLocation("/app/member/home");
          return;
        }

        setLocation("/");
      } catch (error) {
        console.error("Failed to route user:", error);
        setLocation("/signin");
      }
    }

    routeUser();
  }, [setLocation]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-sm text-muted-foreground">
        Loading your workspace...
      </div>
    </div>
  );
}

export default AppHomeRedirect;