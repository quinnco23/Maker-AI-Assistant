import { useState } from "react";
import { Switch, Route, useLocation, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-context";
import { AppProvider, useAppContext } from "@/lib/app-context";
import { SidebarProvider } from "@/components/ui/sidebar";
import { MemberSidebar } from "@/components/member-sidebar";
import { AdminSidebar } from "@/components/admin-sidebar";
import { TopBar } from "@/components/top-bar";
import { CommandPalette } from "@/components/command-palette";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/landing";
import SignIn from "@/pages/signin";
import SignUp from "@/pages/signup";

import MemberHome from "@/pages/member/home";
import MemberTools from "@/pages/member/tools";
import ToolDetail from "@/pages/member/tool-detail";
import MemberSession from "@/pages/member/session";
import MemberChecklists from "@/pages/member/checklists";
import MemberProjects from "@/pages/member/projects";
import MemberMessages from "@/pages/member/messages";
import MemberProfile from "@/pages/member/profile";
import MakerspaceMachineCatalogue from "@/pages/machinecat";

import AdminOverview from "@/pages/admin/overview";
import AdminSetup from "@/pages/admin/setup";
import AdminTools from "@/pages/admin/tools";
import AdminKB from "@/pages/admin/kb";
import AdminSafety from "@/pages/admin/safety";
import AdminChecklists from "@/pages/admin/checklists";
import AdminMembers from "@/pages/admin/members";
import AdminMessages from "@/pages/admin/messages";
import AdminEscalations from "@/pages/admin/escalations";
import AdminMetrics from "@/pages/admin/metrics";
import AdminSettings from "@/pages/admin/settings";
import MachineList from "./components/MachineList";
import PrusaCertificationPage from "./pages/member/rusacertland";



function AppContent() {
  const { role } = useAppContext();

  return (
    <Switch>
      <Route path="/app/member/home" component={MemberHome} />
      <Route path="/app/member/training/:toolId" component={PrusaCertificationPage} />
      {/* <Route path="/app/member/pruscert" component={PrusaCertificationPage} /> */}
      <Route path="/app/member/tools/:toolId" component={ToolDetail} />
      <Route path="/app/member/tools" component={MemberTools} />
      <Route path="/app/member/session" component={MemberSession} />
      <Route path="/app/member/checklists" component={MemberChecklists} />
      <Route path="/app/member/projects" component={MemberProjects} />
      <Route path="/app/member/messages" component={MemberMessages} />
      <Route path="/app/member/profile" component={MemberProfile} />
      
      <Route path="/app/admin/overview" component={AdminOverview} />
      <Route path="/app/admin/setup" component={AdminSetup} />
      <Route path="/app/admin/tools" component={AdminTools} />
      <Route path="/app/admin/kb" component={AdminKB} />
      <Route path="/app/admin/safety" component={AdminSafety} />
      <Route path="/app/admin/checklists" component={AdminChecklists} />
      <Route path="/app/admin/members" component={AdminMembers} />
      <Route path="/app/admin/messages" component={AdminMessages} />
      <Route path="/app/admin/escalations/:id" component={AdminEscalations} />
      <Route path="/app/admin/escalations" component={AdminEscalations} />
      <Route path="/app/admin/metrics" component={AdminMetrics} />
      <Route path="/app/admin/settings" component={AdminSettings} />
      <Route path="/app/admin/machinecat" component={MakerspaceMachineCatalogue} />
      <Route path="/app/admin/machinelist" component={MachineList} />
      <Route>
        <Redirect to={role === "member" ? "/app/member/home" : "/app/admin/overview"} />
      </Route>
    </Switch>
  );
}

function AppShell() {
  const { role } = useAppContext();
  const [commandOpen, setCommandOpen] = useState(false);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {role === "member" ? <MemberSidebar /> : <AdminSidebar />}
        <div className="flex flex-col flex-1 min-w-0">
          <TopBar onCommandOpen={() => setCommandOpen(true)} />
          <main className="flex-1 overflow-auto">
            <AppContent />
          </main>
        </div>
      </div>
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />
    </SidebarProvider>
  );
}

function MainRouter() {
  const [location] = useLocation();
  const isAppRoute = location.startsWith("/app");

  if (isAppRoute) {
    return <AppShell />;
  }

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProvider>
          <TooltipProvider>
            <Toaster />
            <MainRouter />
          </TooltipProvider>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
