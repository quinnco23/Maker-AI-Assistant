import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { TopBar } from "@/components/top-bar";
import {
    LayoutDashboard,
    Wrench,
    BookOpen,
    Shield,
    Settings,
    Warehouse,
    ClipboardCheck,
    Award,
    UserRoundPen,
    ShieldCheck,
    CalendarClock
 
  } from "lucide-react";


  import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
    SidebarSeparator,
    SidebarProvider,
    
  } from "@/components/ui/sidebar";
  
  import { Badge } from "@/components/ui/badge";
  import { Button } from "@/components/ui/button";

  
  
  
 

  const onboardingNav = [
  {
    title: "Onboarding",
    url: "/app/admin/onboarding",
    icon: ClipboardCheck,
    alwaysEnabled: true,
  },
];

const adminNav = [
//   { title: "Overview", url: "/app/admin/overview", icon: LayoutDashboard },
  { title: "My Makerspace", url: "/app/admin/setup", icon: Warehouse },
  { title: "Machines", url: "/app/admin/machines", icon: Wrench },
  { title: "Certification Reviews", url: "/app/admin/certification-reviews", icon: CalendarClock },
  // { title: "Certifications", url: "/app/admin/machines", icon: Award },
  //{ title: "Members & Staff", url: "/app/admin/members", icon: UserRoundPen },
  //{ title: "Safety", url: "/app/admin/safety", icon: ShieldCheck },
  //{ title: "Settings", url: "/app/admin/settings", icon: Settings },
  
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);
  const isOnboardingPage = location.startsWith("/app/admin/onboarding");
  const [me, setMe] = useState<any>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const json = await res.json();
        setMe(json);

        if (!json.user) {
          setLocation("/signin");
          return;
        }

        const adminMembership = json.memberships?.find((m: any) =>
          ["owner", "admin", "instructor"].includes(m.role),
        );

        if (!adminMembership) {
          setLocation("/app/member/home");
          return;
        }

        const complete =
          json.adminMakerspace?.onboardingCompleted === true;

        setOnboardingComplete(complete);

        const isOnboardingPage = location.startsWith("/app/admin/onboarding");

        if (!complete && !isOnboardingPage) {
          setLocation("/app/admin/onboarding");
        }

        if (complete && isOnboardingPage) {
            setLocation("/app/admin/setup");
        }
      } catch (error) {
        console.error(error);
        setLocation("/signin");
      } finally {
        setIsLoading(false);
      }
    }

    load();
  }, [location, setLocation]);

  if (isLoading) {
    return <div className="">Loading...</div>;
  }

  return (
   
     <SidebarProvider>
      <Sidebar variant="floating">
  <SidebarHeader>
    <Link href="/">
      <div
        className="flex cursor-pointer items-center gap-2 px-2 py-1"
        data-testid="link-admin-logo"
      >
       {me?.adminMakerspace?.logoUrl ? (
  <img
    src={me.adminMakerspace.logoUrl}
    alt={me.adminMakerspace.name ?? "Makerspace logo"}
    className="h-8 w-8 rounded-md object-cover"
  />
) : (
  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
    M
  </div>
)}
        <div className="flex flex-col">
        <div className="flex flex-col">
  <span className="max-w-[160px] truncate text-sm font-semibold tracking-tight">
    {me?.adminMakerspace?.name ?? "Makerspace AI"}
  </span>
  <span className="text-xs text-muted-foreground">
    Admin Console
  </span>
</div>
        </div>
      </div>
    </Link>
  </SidebarHeader>

  <SidebarSeparator />

  <SidebarContent>
    <SidebarGroup>
      <SidebarGroupLabel>Setup</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {onboardingNav.map((item) => {
            const isActive =
              location === item.url || location.startsWith(item.url + "/");

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                >
                  <Link href={item.url}>
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>

    <SidebarGroup>
      <SidebarGroupLabel>Management</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {adminNav.map((item) => {
            const disabled = !onboardingComplete;
            const isActive =
              location === item.url || location.startsWith(item.url + "/");

            if (disabled) {
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    disabled
                    tooltip="Complete onboarding first"
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            }

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                >
                  <Link
                    href={item.url}
                    data-testid={`link-admin-${item.title
                      .toLowerCase()
                      .replace(/\s/g, "-")}`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  </SidebarContent>

  <SidebarFooter>
    <div className="space-y-3 px-2 py-2">
      {!onboardingComplete && (
        <div className="rounded-xl bg-amber-50 p-3 text-xs text-amber-800">
          Complete onboarding to unlock admin tools.
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
          {me?.user?.fullName
            ?.split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase() ?? "A"}
        </div>

        <div className="flex min-w-0 flex-col">
          <span className="truncate text-sm font-medium">
            {me?.user?.fullName ?? "Admin"}
          </span>
          <Badge variant="secondary" className="w-fit text-[10px]">
            Admin
          </Badge>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={async () => {
          await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });
          setLocation("/signin");
        }}
      >
        Sign out
      </Button>
    </div>
  </SidebarFooter>
</Sidebar>


      {/* Page content */}
      <div className="flex min-w-0 flex-1 flex-col">
  <TopBar />

  <main className="flex-1 overflow-auto p-5 md:p-0">
    {children}
  </main>
</div>
  </SidebarProvider>
  );
}