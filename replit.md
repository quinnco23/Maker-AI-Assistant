# Makerspace AI Assistant

## Overview
A multi-tenant SaaS skeleton for a Makerspace AI Assistant application. It provides a guided demo experience with three core surfaces: Landing Page (marketing), Member Dashboard, and Admin Dashboard. The app uses mock data and non-functional placeholders where needed, focusing on UI/UX and structure.

## Recent Changes
- Feb 21, 2026: Initial build of complete skeleton with all pages

## Architecture
- **Frontend**: React + Vite + TypeScript with shadcn/ui components
- **Backend**: Express.js (minimal, in-memory mock data)
- **Styling**: Tailwind CSS with semantic tokens, dark mode support
- **Routing**: wouter for client-side routing
- **State**: React context for role switching and theme

## Project Structure
```
client/src/
  App.tsx                    # Main router with role-based app shell
  lib/
    theme-context.tsx        # Dark mode provider
    app-context.tsx          # Role & plain language state
  components/
    member-sidebar.tsx       # Member navigation sidebar
    admin-sidebar.tsx        # Admin navigation sidebar
    top-bar.tsx              # Top bar with search, theme, role switch
    command-palette.tsx      # Cmd+K command palette
  pages/
    landing.tsx              # Marketing landing page
    signin.tsx               # Mock sign in
    signup.tsx               # Mock sign up
    member/
      home.tsx               # Member dashboard home
      tools.tsx              # Tools library grid
      tool-detail.tsx        # Tool detail with tabs (Laser Cutter)
      session.tsx            # Guided session stepper with escalation
      checklists.tsx         # Checklists view
      projects.tsx           # Projects kanban
      messages.tsx           # Messages threads
      profile.tsx            # Profile & certifications
    admin/
      overview.tsx           # Admin KPI dashboard
      setup.tsx              # 3-step setup wizard
      tools.tsx              # Tool management
      kb.tsx                 # Knowledge base management
      safety.tsx             # Safety rules editor
      checklists.tsx         # Checklist builder
      members.tsx            # Member/staff table
      messages.tsx           # Admin messages
      escalations.tsx        # Escalation inbox with detail view
      metrics.tsx            # Metrics with recharts
      settings.tsx           # Makerspace settings
server/
  routes.ts                  # Minimal API routes
  storage.ts                 # In-memory mock storage
shared/
  schema.ts                  # TypeScript interfaces for all data types
```

## Key Routes
- `/` - Landing page
- `/signin`, `/signup` - Auth pages (mock)
- `/app/member/*` - Member dashboard pages
- `/app/admin/*` - Admin dashboard pages

## Demo Flow
1. Admin completes Setup Wizard -> uploads SOP -> publishes
2. Member opens Tools Library -> sees published SOP
3. Member starts session -> picks "unknown material" -> sees STOP + escalation summary
4. Admin opens Escalations inbox -> sees the new handoff packet

## User Preferences
- Inter font family
- Blue primary color scheme (217 91% 35%)
- Dark mode toggle available
- Role switcher (Dev menu) for switching between member/admin views
