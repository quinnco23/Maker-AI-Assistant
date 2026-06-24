import * as React from "react";
import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  Users,
  Wrench,
  Printer,
  ScanLine,
  Cog,
  ShieldCheck,
  Plus,
  Settings,
  UserRound,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";



type MachineType =
  | "3d_printer"
  | "laser_cutter"
  | "cnc_router"
  | "vinyl_cutter"
  | "electronics"
  | "woodshop"
  | "other";

type MakerspaceProfile = {
  id: string;
  name: string;
  slug: string;
  location: string;
  description: string;
  website?: string;
  contactEmail?: string;
  logoUrl?: string;
};

type MachineRecord = {
  id: string;
  name: string;
  type: MachineType;
  brand?: string;
  model?: string;
  locationLabel: string;
  description: string;
  requiresCertification: boolean;
  status: "active" | "inactive" | "maintenance";
};

type MakerspaceMember = {
  id: string;
  fullName: string;
  email: string;
  role: "member" | "admin" | "owner" | "instructor";
  joinedAt: string;
  status: "active" | "pending" | "suspended";
};

type DashboardData = {
  makerspace: MakerspaceProfile;
  machines: MachineRecord[];
  members: MakerspaceMember[];
};

function getMachineIcon(type: MachineType) {
  switch (type) {
    case "3d_printer":
      return <Printer className="h-5 w-5" />;
    case "laser_cutter":
      return <ScanLine className="h-5 w-5" />;
    case "cnc_router":
      return <Cog className="h-5 w-5" />;
    default:
      return <Wrench className="h-5 w-5" />;
  }
}

function getMachineTypeLabel(type: MachineType) {
  return type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function getRoleBadgeVariant(role: MakerspaceMember["role"]) {
  switch (role) {
    case "owner":
      return "default";
    case "admin":
      return "secondary";
    case "instructor":
      return "secondary";
    default:
      return "outline";
  }
}

function getStatusBadgeClass(status: MachineRecord["status"] | MakerspaceMember["status"]) {
  switch (status) {
    case "active":
      return "bg-emerald-100 text-emerald-800";
    case "maintenance":
      return "bg-amber-100 text-amber-800";
    case "inactive":
    case "suspended":
      return "bg-rose-100 text-rose-800";
    case "pending":
      return "bg-blue-100 text-blue-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}



export default function AdminMakerspaceProfilePage() {
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const [location] = useLocation();

  const [me, setMe] = useState<any>(null);


useEffect(() => {
  async function loadMe() {
    try {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      const json = await res.json();

      setMe(json);
    } catch (error) {
      console.error("Failed to load user:", error);
    }
  }

  loadMe();
}, []);
  

React.useEffect(() => {
  async function loadData() {
    try {
      setIsLoading(true);

      const res = await fetch("/api/admin/makerspace", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to load makerspace");
      }

      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Failed to load makerspace profile:", error);
      setData(null);
    } finally {
      setIsLoading(false);
    }
  }

  if (location.startsWith("/app/admin")) {
    loadData();
  }
}, [location]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-2xl border bg-white p-6">Loading makerspace profile...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-7xl p-6">
        <div className="rounded-2xl border bg-white p-6">Could not load makerspace.</div>
      </div>
    );
  }

  const { makerspace, machines, members } = data;

  return (
    <div className="  min-h-screen overflow-x-hidden">
       <div className="flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-sm sm:p-6 lg:flex-row lg:items-start lg:justify-between">
       <div className="flex  items-center gap-4 text-center  flex-col lg:flex-row sm:items-start sm:text-left">
      {me?.adminMakerspace?.logoUrl ? (
        <img
          src={me.adminMakerspace.logoUrl}
          alt={me.adminMakerspace.name ?? "Makerspace logo"}
          className="size-32 shrink-0 rounded-xl object-cover "
        />
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary text-sm font-bold text-primary-foreground sm:h-14 sm:w-14">
          M
        </div>
      )}

          <div className="min-w-0">
            <h1 className="truncate text-xl font-bold tracking-tight sm:text-2xl">
              {makerspace.name}
            </h1>

            <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {makerspace.location}
              </span>

              {makerspace.website && (
                <span className="inline-flex items-center gap-1">
                  <Globe className="h-4 w-4" />
                  {makerspace.website}
                </span>
              )}

              {makerspace.contactEmail && (
                <span className="inline-flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {makerspace.contactEmail}
                </span>
              )}
            </div>

            <p className="mt-3 max-w-3xl text-slate-600">{makerspace.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-xl">
            <Link href="/app/admin/machines/new">
              <Plus className="mr-2 h-4 w-4" />
              Add machine
            </Link>
          </Button>

          <Button asChild variant="outline" className="rounded-xl">
            <Link href="/app/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              Edit makerspace
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Machines" value={String(machines.length)} icon={<Wrench className="h-5 w-5" />} />
        <StatCard label="Members" value={String(members.length)} icon={<Users className="h-5 w-5" />} />
        <StatCard
          label="Certification Required"
          value={String(machines.filter((m) => m.requiresCertification).length)}
          icon={<ShieldCheck className="h-5 w-5" />}
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Machines</CardTitle>
              <CardDescription>Equipment added to this makerspace</CardDescription>
            </div>

            <Button asChild variant="outline" size="sm" className="rounded-xl">
              <Link href="/app/admin/machines">Manage all</Link>
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            {machines.length === 0 ? (
              <EmptyState
                title="No machines yet"
                description="Add your first machine to start building your catalog."
                actionHref="/app/admin/machines/new"
                actionLabel="Add machine"
              />
            ) : (
              machines.map((machine) => (
                <div
                  key={machine.id}
                  className="rounded-2xl border bg-white p-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                        {getMachineIcon(machine.type)}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{machine.name}</h3>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(
                              machine.status,
                            )}`}
                          >
                            {machine.status}
                          </span>
                          {machine.requiresCertification && (
                            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                              Certification required
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-sm text-slate-600">
                          {[machine.brand, machine.model].filter(Boolean).join(" • ") ||
                            getMachineTypeLabel(machine.type)}
                        </p>

                        <p className="mt-2 text-sm text-slate-600">{machine.description}</p>

                        <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                          <span>{getMachineTypeLabel(machine.type)}</span>
                          <span>Location: {machine.locationLabel}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
  <Button asChild variant="outline" size="sm" className="rounded-xl " > 
    <Link className="bg-white p-2 rounded-xl text-black border-2 border-black" href={`/app/admin/machines/${machine.id}`}>Edit</Link>
  </Button>
  <Link className="bg-primary p-2 rounded-xl text-white "  href={`/app/admin/machines/${machine.id}/certification`}>
  Manage Certification
</Link>
</div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Members</CardTitle>
              <CardDescription>Users connected to this makerspace</CardDescription>
            </div>

            <Button asChild variant="outline" size="sm" className="rounded-xl">
              <Link href="/app/admin/members">Manage all</Link>
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            {members.length === 0 ? (
              <EmptyState
                title="No members yet"
                description="Invite people to join your makerspace."
                actionHref="/app/admin/onboarding/invite"
                actionLabel="Invite members"
              />
            ) : (
              members.map((member) => (
                <div key={member.id} className="rounded-2xl border bg-white p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
                        <UserRound className="h-5 w-5 text-slate-600" />
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-slate-900">{member.fullName}</p>
                          <Badge variant={getRoleBadgeVariant(member.role)}>
                            {member.role}
                          </Badge>
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${getStatusBadgeClass(
                              member.status,
                            )}`}
                          >
                            {member.status}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-600">{member.email}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <Button asChild variant="ghost" size="sm" className="rounded-xl">
                      <Link href={`/app/admin/members/${member.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <Card className="rounded-3xl border-0 shadow-sm">
      <CardContent className="flex items-center justify-between p-5">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-2xl font-bold text-slate-900">{value}</p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({
  title,
  description,
  actionHref,
  actionLabel,
}: {
  title: string;
  description: string;
  actionHref: string;
  actionLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed bg-slate-50 p-6 text-center">
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{description}</p>
      <Button asChild className="mt-4 rounded-xl">
        <Link href={actionHref}>{actionLabel}</Link>
      </Button>
    </div>
  );
}