import { Link, useLocation } from "wouter";
import {
  Home,
  Wrench,
  Play,
  ClipboardCheck,
  FolderKanban,
  MessageSquare,
  UserCircle,
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

const memberNav = [
  { title: "Home", url: "/app/member/home", icon: Home },
  { title: "Tools Library", url: "/app/member/tools", icon: Wrench },
  { title: "Start Session", url: "/app/member/session", icon: Play },
  { title: "Checklists", url: "/app/member/checklists", icon: ClipboardCheck },
  { title: "Projects", url: "/app/member/projects", icon: FolderKanban },
  { title: "Messages", url: "/app/member/messages", icon: MessageSquare },
  { title: "Profile", url: "/app/member/profile", icon: UserCircle },
];

export function MemberSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/">
          <div className="flex items-center gap-2 px-2 py-1 cursor-pointer" data-testid="link-logo">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">Makerspace AI</span>
              <span className="text-xs text-muted-foreground">Member Portal</span>
            </div>
          </div>
        </Link>
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
        <div className="px-2 py-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
              JD
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Jane Doe</span>
              <Badge variant="secondary" className="w-fit text-[10px]">Member</Badge>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
