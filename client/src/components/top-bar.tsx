import { Sun, Moon, Search, Bell, Globe, ArrowLeftRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useTheme } from "@/lib/theme-context";
import { useAppContext } from "@/lib/app-context";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface TopBarProps {
  onCommandOpen?: () => void;
}

export function TopBar({ onCommandOpen }: TopBarProps) {
  const { theme, toggleTheme } = useTheme();
  const { role, setRole, plainLanguage, togglePlainLanguage } = useAppContext();

  return (
    <header className="flex items-center justify-between gap-2 border-b px-3 py-2 bg-background sticky top-0 z-50" role="banner">
      <div className="flex items-center gap-2">
        <SidebarTrigger data-testid="button-sidebar-toggle" aria-label="Toggle sidebar" />

        <Button
          variant="outline"
          size="sm"
          className="hidden md:flex items-center gap-2 text-muted-foreground min-w-[200px] justify-start"
          onClick={onCommandOpen}
          data-testid="button-command-palette"
          aria-label="Open command palette"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="text-xs">Search...</span>
          <kbd className="ml-auto pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">Cmd</span>K
          </kbd>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        {role === "member" && (
          <div className="hidden sm:flex items-center gap-1.5 mr-2">
            <Globe className="h-3.5 w-3.5 text-muted-foreground" />
            <Label htmlFor="plain-lang" className="text-xs text-muted-foreground cursor-pointer">
              Plain Language
            </Label>
            <Switch
              id="plain-lang"
              checked={plainLanguage}
              onCheckedChange={togglePlainLanguage}
              data-testid="switch-plain-language"
              aria-label="Toggle plain language mode"
            />
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="relative"
          data-testid="button-notifications"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground flex items-center justify-center">
            3
          </span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          data-testid="button-theme-toggle"
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>

        <div className="hidden lg:block">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRole(role === "member" ? "admin" : "member")}
            data-testid="button-role-switch"
            aria-label="Switch role"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">
              Switch to {role === "member" ? "Admin" : "Member"}
            </span>
            <Badge variant="outline" className="ml-1.5 text-[10px]">Dev</Badge>
          </Button>
        </div>
      </div>
    </header>
  );
}
