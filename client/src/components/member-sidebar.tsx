import { Link, useLocation } from "wouter";
import {
  Home,
  Wrench,
  Play,
  ClipboardCheck,
  FolderKanban,
  MessageSquare,
  UserCircle,
  UserRound

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
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { LogOut } from "lucide-react";

const memberNav = [
  { title: "My MakersSpace", url: "/app/member/home", icon: Home },
  { title: "My Profile", url: "/app/member/profile", icon: UserCircle },
  //  { title: "My Profile", url: "/app/member/profile", icon: UserCircle },
  // { title: "Machines", url: "/app/member/tools", icon: Wrench },
  { title: "learn", url: "/app/member/knowledge", icon: ClipboardCheck },

  // { title: "Start Session", url: "/app/member/session", icon: Play },
  // { title: "Certifications", url: "/app/member/checklists", icon: ClipboardCheck },
 { title: "Projects", url: "/app/member/projects", icon: FolderKanban },
  // { title: "Messages", url: "/app/member/messages", icon: MessageSquare },
  // { title: "Profile", url: "/app/member/profile", icon: UserCircle },
];

export function MemberSidebar() {
  const [location] = useLocation();

  const [me, setMe] = useState<any>(null);

useEffect(() => {
  async function loadMe() {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      const json = await res.json();
      console.log("member sidebar me:", json);

      setMe(json);
    } catch (error) {
      console.error("Failed to load member profile:", error);
    }
  }

  loadMe();
}, []);

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/">
        <div className="flex flex-col">
        {me?.memberMakerspace?.logoUrl ? (
  <img
    src={me.memberMakerspace.logoUrl}
    alt={me.memberMakerspace.name}
    className="h-8 w-8 rounded-md object-cover"
  />
) : (
  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
    M
  </div>
)}

  <span className="text-xs text-muted-foreground">
    Member Portal
  </span>
</div>
        </Link>
        <button
  className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 transition hover:bg-slate-100"
  onClick={async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      window.location.href = "/signin";
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  }}
>
  <LogOut className="h-4 w-4" />
  Sign Out
</button>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {memberNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url || location.startsWith(item.url + "/")}
                    tooltip={item.title}
                  >
                    <Link href={item.url} data-testid={`link-member-${item.title.toLowerCase().replace(/\s/g, "-")}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
      <div className="flex items-center gap-2">
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
    {me?.user?.fullName
      ?.split(" ")
      .map((part: string) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() ?? "M"}
  </div>

  <div className="flex flex-col">
    <span className="text-sm font-medium">
      {me?.user?.fullName ?? "Member"}
    </span>

    <span className="text-xs text-muted-foreground">
      Member
    </span>
  </div>
</div>
      </SidebarFooter>
    </Sidebar>
  );
}
