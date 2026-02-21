import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Wand2,
  Wrench,
  BookOpen,
  Shield,
  ClipboardCheck,
  Users,
  MessageSquare,
  AlertTriangle,
  BarChart3,
  Settings,
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

const adminNav = [
  { title: "Overview", url: "/app/admin/overview", icon: LayoutDashboard },
  { title: "Setup Wizard", url: "/app/admin/setup", icon: Wand2 },
  { title: "Tools & Models", url: "/app/admin/tools", icon: Wrench },
  { title: "Knowledge Base", url: "/app/admin/kb", icon: BookOpen },
  { title: "Safety Rules", url: "/app/admin/safety", icon: Shield },
  { title: "Checklists", url: "/app/admin/checklists", icon: ClipboardCheck },
  { title: "Members & Staff", url: "/app/admin/members", icon: Users },
  { title: "Messages", url: "/app/admin/messages", icon: MessageSquare },
  { title: "Escalations", url: "/app/admin/escalations", icon: AlertTriangle },
  { title: "Metrics", url: "/app/admin/metrics", icon: BarChart3 },
  { title: "Settings", url: "/app/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const [location] = useLocation();

  return (
    <Sidebar>
      <SidebarHeader>
        <Link href="/">
          <div className="flex items-center gap-2 px-2 py-1 cursor-pointer" data-testid="link-admin-logo">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground font-bold text-sm">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">Makerspace AI</span>
              <span className="text-xs text-muted-foreground">Admin Console</span>
            </div>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={location === item.url || location.startsWith(item.url + "/")}
                    tooltip={item.title}
                  >
                    <Link href={item.url} data-testid={`link-admin-${item.title.toLowerCase().replace(/\s/g, "-")}`}>
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
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
              PS
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Prof. Smith</span>
              <Badge variant="secondary" className="w-fit text-[10px]">Admin</Badge>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
