import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Home,
  Wrench,
  Play,
  ClipboardCheck,
  FolderKanban,
  MessageSquare,
  UserCircle,
  LayoutDashboard,
  Wand2,
  BookOpen,
  Shield,
  Users,
  AlertTriangle,
  BarChart3,
  Settings,
} from "lucide-react";
import { useAppContext } from "@/lib/app-context";

const memberCommands = [
  { title: "Home", url: "/app/member/home", icon: Home },
  { title: "Tools Library", url: "/app/member/tools", icon: Wrench },
  { title: "Start Session", url: "/app/member/session", icon: Play },
  { title: "Checklists", url: "/app/member/checklists", icon: ClipboardCheck },
  { title: "Projects", url: "/app/member/projects", icon: FolderKanban },
  { title: "Messages", url: "/app/member/messages", icon: MessageSquare },
  { title: "Profile", url: "/app/member/profile", icon: UserCircle },
];

const adminCommands = [
  { title: "Overview", url: "/app/admin/overview", icon: LayoutDashboard },
  { title: "Setup Wizard", url: "/app/admin/setup", icon: Wand2 },
  { title: "Tools & Models", url: "/app/admin/tools", icon: Wrench },
  { title: "Knowledge Base", url: "/app/admin/kb", icon: BookOpen },
  { title: "Safety Rules", url: "/app/admin/safety", icon: Shield },
  { title: "Checklists", url: "/app/admin/checklists", icon: ClipboardCheck },
  { title: "Members & Staff", url: "/app/admin/members", icon: Users },
  { title: "Escalations", url: "/app/admin/escalations", icon: AlertTriangle },
  { title: "Metrics", url: "/app/admin/metrics", icon: BarChart3 },
  { title: "Settings", url: "/app/admin/settings", icon: Settings },
];

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const [, navigate] = useLocation();
  const { role } = useAppContext();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  const handleSelect = (url: string) => {
    navigate(url);
    onOpenChange(false);
  };

  const commands = role === "member" ? memberCommands : adminCommands;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search pages and actions..." data-testid="input-command-search" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading={role === "member" ? "Member Pages" : "Admin Pages"}>
          {commands.map((cmd) => (
            <CommandItem key={cmd.url} onSelect={() => handleSelect(cmd.url)} data-testid={`command-${cmd.title.toLowerCase().replace(/\s/g, "-")}`}>
              <cmd.icon className="mr-2 h-4 w-4" />
              <span>{cmd.title}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          <CommandItem onSelect={() => handleSelect(role === "member" ? "/app/member/session" : "/app/admin/setup")}>
            <Play className="mr-2 h-4 w-4" />
            <span>{role === "member" ? "Start New Session" : "Open Setup Wizard"}</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
