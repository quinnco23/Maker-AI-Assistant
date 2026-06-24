import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/lib/theme-context";
import { AppProvider } from "@/lib/app-context";
import NotFound from "@/pages/not-found";

import Landing from "@/pages/landing";
import SignIn from "@/pages/signin";
import SignUp from "@/pages/signup";

import MemberHome from "@/pages/member/home";
import ToolDetail from "@/pages/member/tool-detail";
import MemberSession from "@/pages/member/session";
import MemberChecklists from "@/pages/member/checklists";
import MemberProjects from "@/pages/member/projects";
import MemberMessages from "@/pages/member/messages";
import MemberMachineDetailPage from "./pages/member/MemberMachineDetailPage";
import MemberKnowledgePage from "./pages/member/knowledge";
import MemberProfilePage from "./pages/member/MemberProfile";
import EditMemberProfilePage from "./pages/member/EditMemberprofilePage";
import PrusaCertificationPage from "./pages/member/rusacertland";
import MemberSignUp from "./pages/memberSignUp";

import MakerspaceMachineCatalogue from "@/pages/machinecat";
import JoinMakerspacePage from "./pages/JoinMakerspacePage";
import DiscoverMakerspacesPage from "./pages/DiscoverMakerspacePage";

import AdminLayout from "./layouts/AdminLayout";
import MemberLayout from "./layouts/MemberLayout";

import AdminMakerspaceProfilePage from "./pages/admin/AdminMakerspaceProfilePage";
import ReviewPublishPage from "./pages/admin/ReviewPublishPage";
import InviteMembersPage from "./pages/admin/InviteMembersPage";
import AdminOverview from "@/pages/admin/overview";
import AdminKB from "@/pages/admin/kb";
import AdminSafety from "@/pages/admin/safety";
import AdminChecklists from "@/pages/admin/checklists";
import AdminMembers from "@/pages/admin/members";
import AdminMessages from "@/pages/admin/messages";
import AdminEscalations from "@/pages/admin/escalations";
import AdminMetrics from "@/pages/admin/metrics";
import AdminSettings from "@/pages/admin/settings";
import MachineList from "./components/MachineList";
import AdminOnboardingWelcome from "./pages/admin/AdminOnboardingWelcome";
import CreateMakerspacePage from "./pages/admin/CreateMakerspacePage";
import CreateMachinePage from "./pages/admin/CreateMachinePage";
import CreateCertificationPage from "./pages/admin/CreateCertificationPage";
import ManageMachinesPage from "./pages/admin/ManageMachinesPage";
import EditMachinePage from "./pages/admin/EditMachinePage";
import MachineCertificationPage from "./pages/admin/MachineCertificationPage";
import CertificationApprovalsPage from "./pages/admin/CertificationApprovalsPage";
import CertificationReviewsPage from "./pages/admin/CedrtificationReviewsPage";
import AdminCertificationPreviewPage from "./pages/admin/AdminCertificationPreviewPage";
import AppHomeRedirect from "./pages/AppHomeRedirect";

function MemberRoute({ children }: { children: React.ReactNode }) {
  return <MemberLayout>{children}</MemberLayout>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}

function AppContent() {
  return (
    <Switch>
      {/* Member routes */}


      <Route path="/app/member/machines/:machineId">
        <MemberRoute>
          <MemberMachineDetailPage />
        </MemberRoute>
      </Route>

      <Route path="/app/member/home">
        <MemberRoute>
          <MemberHome />
        </MemberRoute>
      </Route>

      <Route path="/app/member/training/:moduleId">
        <MemberRoute>
          <PrusaCertificationPage />
        </MemberRoute>
      </Route>

      <Route path="/app/member/knowledge">
        <MemberRoute>
          <MemberKnowledgePage />
        </MemberRoute>
      </Route>

      {/* <Route path="/app/member/tools/:toolId">
        <MemberRoute>
          <ToolDetail />
        </MemberRoute>
      </Route> */}

      <Route path="/app/member/tools">
        <MemberRoute>
          <MakerspaceMachineCatalogue />
        </MemberRoute>
      </Route>

      <Route path="/app/member/session">
        <MemberRoute>
          <MemberSession />
        </MemberRoute>
      </Route>

      

      <Route path="/app/member/checklists">
        <MemberRoute>
          <MemberChecklists />
        </MemberRoute>
      </Route>

      <Route path="/app/member/projects">
        <MemberRoute>
          <MemberProjects />
        </MemberRoute>
      </Route>

      <Route path="/app/member/messages">
        <MemberRoute>
          <MemberMessages />
        </MemberRoute>
      </Route>

     

      <Route path="/app/member/profile/edit">
        <MemberRoute>
          <EditMemberProfilePage />
        </MemberRoute>
      </Route>

      <Route path="/app/member/profile">
        <MemberRoute>
          <MemberProfilePage />
        </MemberRoute>
      </Route>

      {/* Admin routes */}
      <Route path="/app/admin/overview">
        <AdminRoute>
          <AdminOverview />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/setup">
        <AdminRoute>
          <AdminMakerspaceProfilePage />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/machines/new">
        <AdminRoute>
          <MakerspaceMachineCatalogue />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/machines/:machineId/certification/preview">
        <AdminRoute>
          <AdminCertificationPreviewPage />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/machines/:machineId/certification">
        <AdminRoute>
          <MachineCertificationPage />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/machines/:machineId">
        <AdminRoute>
          <EditMachinePage />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/machines">
        <AdminRoute>
          <MakerspaceMachineCatalogue />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/certification-reviews">
        <AdminRoute>
          <CertificationReviewsPage />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/manmachines">
        <AdminRoute>
          <ManageMachinesPage />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/kb">
        <AdminRoute>
          <AdminKB />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/safety">
        <AdminRoute>
          <AdminSafety />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/checklists">
        <AdminRoute>
          <AdminChecklists />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/members">
        <AdminRoute>
          <AdminMembers />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/messages">
        <AdminRoute>
          <AdminMessages />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/escalations/:id">
        <AdminRoute>
          <AdminEscalations />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/escalations">
        <AdminRoute>
          <AdminEscalations />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/metrics">
        <AdminRoute>
          <AdminMetrics />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/settings">
        <AdminRoute>
          <AdminSettings />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/machinecat">
        <AdminRoute>
          <MakerspaceMachineCatalogue />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/machinelist">
        <AdminRoute>
          <MachineList />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/onboarding/invite">
        <AdminRoute>
          <InviteMembersPage />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/onboarding/review">
        <AdminRoute>
          <ReviewPublishPage />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/onboarding/certification">
        <AdminRoute>
          <CreateCertificationPage />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/onboarding/makerspace">
        <AdminRoute>
          <CreateMakerspacePage />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/onboarding/machine">
        <AdminRoute>
          <CreateMachinePage />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/onboarding">
        <AdminRoute>
          <AdminOnboardingWelcome />
        </AdminRoute>
      </Route>

      <Route path="/app/admin/certification-approvals">
        <AdminRoute>
          <CertificationApprovalsPage />
        </AdminRoute>
      </Route>

      <Route path="/app">
        <AppHomeRedirect />
      </Route>
    </Switch>
  );
}

function MainRouter() {
  const [location] = useLocation();
  const isAppRoute = location.startsWith("/app");

  if (isAppRoute) {
    return <AppContent />;
  }

  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/signin" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/join/:slug/signup" component={MemberSignUp} />
      <Route path="/join/:slug" component={JoinMakerspacePage} />
      <Route path="/discover" component={DiscoverMakerspacesPage} />
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