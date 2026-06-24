import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { TopBar } from "@/components/top-bar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MemberSidebar } from "@/components/member-sidebar";

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const json = await res.json();

        if (!json.user) {
          setLocation("/signin");
          return;
        }

        const memberMembership = json.memberships?.find(
          (m: any) =>
            String(m.role).toLowerCase() === "member" &&
            m.status === "active",
        );

        if (!memberMembership) {
          setLocation("/");
          return;
        }
      } catch (error) {
        console.error(error);
        setLocation("/signin");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [setLocation]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <SidebarProvider>
      <MemberSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />

        <main className="flex-1 overflow-auto px-3 pb-3 md:px-0 md:pb-0">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}