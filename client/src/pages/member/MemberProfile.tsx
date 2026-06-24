import { useEffect, useState } from "react";
import { Award, CalendarClock, FolderKanban, Newspaper, UserCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription,  } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";

export default function MemberProfilePage() {
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [, setLocation] = useLocation();
    const earnedCertifications = profile?.certifications ?? [];
    

    useEffect(() => {
        async function loadProfile() {
            try {
                setIsLoading(true);

                const res = await fetch("/api/member/profile", {
                    credentials: "include",
                });

                const json = await res.json();

                console.log("member profile:", json);

                if (!res.ok) {
                    throw new Error(json.message || "Failed to load profile");
                }

                setProfile(json);
            } catch (error) {
                console.error("Failed to load member profile:", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadProfile();
    }, []);

    if (isLoading) {
        return <div className="p-6 text-sm text-slate-500">Loading profile...</div>;
    }

    const user = profile?.user;
    const makerspace = profile?.makerspace;

    const pendingCertifications =
        profile?.pendingCertifications ?? [];

    const completedCertifications =
        profile?.completedCertifications ?? [];

    const reviewRequests =
        profile?.reviewRequests ?? [];

    const bookings =
        profile?.bookings ?? [];

    const announcements =
        profile?.announcements ?? [];

    const machines =
        profile?.machines ?? [];

    function EmptyState({ text }: { text: string }) {
        return (
            <div className="rounded-2xl border border-dashed p-6 text-sm text-slate-500">
                {text}
            </div>
        );
    }

    function getCertificationBadge(status: string) {
        if (status === "active") {
          return {
            label: "Certified",
            className: "bg-emerald-100 text-emerald-800",
          };
        }
      
        if (status === "pending_review") {
          return {
            label: "Pending staff review",
            className: "bg-amber-100 text-amber-800",
          };
        }
      
        if (status === "expired") {
          return {
            label: "Expired",
            className: "bg-slate-100 text-slate-700",
          };
        }
      
        return {
          label: status,
          className: "bg-slate-100 text-slate-700",
        };
      }


      const certifications = profile?.certifications ?? [];
    return (
        
        <div className="space-y-6">
            {/* <Card className="rounded-3xl border-0 shadow-sm">
                <CardContent className="flex items-center gap-4 p-6">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-lg font-bold text-white">
                        {user?.fullName
                            ?.split(" ")
                            .map((p: string) => p[0])
                            .join("")
                            .slice(0, 2)
                            .toUpperCase() ?? <UserCircle />}
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-slate-950">
                            {user?.fullName ?? "Member Profile"}
                        </h1>
                        <p className="text-sm text-slate-500">{user?.email}</p>
                        <p className="mt-1 text-sm text-slate-600">
                            Member at {makerspace?.name ?? "Makerspace"}
                        </p>
                    </div>
                </CardContent>
            </Card> */}

<div className="rounded-3xl bg-white p-6 shadow-sm">
  <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
    {user?.avatarUrl ? (
        <div className="flex flex-col items-center gap-4  sm:flex-column sm:text-center ">
      <img
        src={user.avatarUrl}
        alt={user.fullName ?? "Member avatar"}
        className="size-32 rounded-2xl object-cover"
      />

      <Button
        
        className="bg-transparent hover:bg-slate-500 text-slate-800 font-semibold hover:text-white py-2 px-4 border border-black-500 hover:border-transparent rounded"
        onClick={() => setLocation("/app/member/profile/edit")}
      >
        Edit Profile
      </Button>
      </div>
      
    ) : (
      <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-900 text-2xl font-bold text-white">
        {user?.fullName
          ?.split(" ")
          .map((p: string) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() ?? "M"}
      </div>
    )}

   

    <div className="min-w-0 flex-1">
      <h1 className="text-3xl font-bold text-slate-950">
        {user?.fullName ?? "Member"}
      </h1>

      <p className="mt-1 text-sm text-slate-500">
        {user?.email}
      </p>

      {user?.bio && (
        <p className="mt-3 max-w-2xl text-sm text-slate-600">
          {user.bio}
        </p>
      )}

      {user?.phone && (
        <p className="mt-2 text-sm text-slate-500">
          {user.phone}
        </p>
      )}

      <p className="mt-2 text-sm text-slate-600">
        Member at {makerspace?.name ?? "Makerspace"}
      </p>

      
    </div>
  </div>
</div>
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4  justify-center">
  {/* <StatCard label="Certifications" value={certifications.length} />
  <StatCard label="Pending Reviews" value={reviewRequests.length} />
   {/* <StatCard label="Projects" value={projects.length} />  
  <StatCard label="Bookings" value={bookings.length} /> */}
  <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Earned Certifications</CardTitle>
            <CardDescription>
              Certifications you’ve completed successfully.
            </CardDescription>
          </CardHeader>
  
          <CardContent className="space-y-4">
            {earnedCertifications.length === 0 ? (
              <div className="rounded-2xl border border-dashed bg-slate-50 p-6 text-center">
                <h3 className="font-semibold text-slate-900">No certifications earned yet</h3>
                <p className="mt-2 text-sm text-slate-600">
                  Complete machine certifications to unlock access and earn badges.
                </p>
              </div>
            ) : (
              earnedCertifications.map((cert) => (
                <div key={cert.id} className="rounded-2xl border bg-white p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="inline-flex items-center gap-2 font-semibold text-slate-900">
                        <Award className="h-4 w-4 text-amber-500" />
                        {cert.machineName}
                      </div>
                      <p className="mt-1 text-sm text-slate-600">
    {cert.status === "pending_review"
      ? "Online certification complete. Awaiting staff review."
      : `Earned ${new Date(cert.earnedAt).toLocaleDateString()}`}
  </p>
                      {cert.expiresAt && (
                        <p className="mt-1 text-sm text-slate-500">
                          Expires {new Date(cert.expiresAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
  
                    <div
    className={[
      "rounded-full px-3 py-1 text-xs font-medium",
      cert.status === "active"
        ? "bg-emerald-100 text-emerald-800"
        : cert.status === "pending_review"
          ? "bg-amber-100 text-amber-800"
          : "bg-slate-100 text-slate-700",
    ].join(" ")}
  >
    {cert.status === "active"
      ? "Certified"
      : cert.status === "pending_review"
        ? "Pending staff review"
        : cert.status}
  </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
</div>

<Card className="rounded-3xl border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FolderKanban className="h-5 w-5" />
                            Projects
                        </CardTitle>
                        <CardDescription>
                            Track projects, builds, and machine usage.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-2xl border border-dashed p-6 text-sm text-slate-500">
                            No projects yet.
                        </div>
                    </CardContent>
                </Card>

            <div className="grid gap-6 lg:grid-cols-2">
            {/* <Card className="rounded-3xl border-0 shadow-sm">
  <CardHeader>
    <CardTitle>Certifications</CardTitle>
    <CardDescription>
      Your completed certifications and pending staff reviews.
    </CardDescription>
  </CardHeader>

  <CardContent className="space-y-3">
    {certifications.length === 0 ? (
      <EmptyState text="No certifications yet." />
    ) : (
      certifications.map((cert: any) => {
        const badge = getCertificationBadge(cert.status);

        return (
          <div key={cert.id} className="rounded-2xl border p-4">
            <div className="font-semibold">
              {cert.certificationTitle ?? "Certification"}
            </div>

            <div className="text-sm text-slate-500">
              {cert.machineName ?? "Machine"}
            </div>

            <div
              className={[
                "mt-3 inline-flex rounded-full px-3 py-1 text-xs font-medium",
                badge.className,
              ].join(" ")}
            >
              {badge.label}
            </div>

            {cert.status === "pending_review" && (
              <p className="mt-2 text-sm text-slate-600">
                Online certification complete. Waiting for staff review.
              </p>
            )}

            {cert.status === "active" && cert.earnedAt && (
              <p className="mt-2 text-sm text-slate-600">
                Earned {new Date(cert.earnedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        );
      })
    )}
  </CardContent>
</Card> */}
               
               
              

                {/* <Card className="rounded-3xl border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle>Review Requests</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {reviewRequests.length === 0 ? (
                            <EmptyState text="No review requests scheduled." />
                        ) : (
                            reviewRequests.map((request: any) => (
                                <div key={request.id} className="rounded-2xl border p-4">
                                    <div className="font-semibold">{request.certificationTitle}</div>
                                    <div className="text-sm text-slate-500">
                                        {request.machineName} • {request.requestedDate} at{" "}
                                        {request.requestedTime}
                                    </div>
                                    <div className="mt-2 text-sm text-slate-600">
                                        Reviewer: {request.staffName ?? "Not assigned"}
                                    </div>
                                    <Badge variant="secondary" className="mt-3">
                                        {request.status}
                                    </Badge>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card> */}
                
                {/* <Card className="rounded-3xl border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle>Makerspace News</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {announcements.length === 0 ? (
                            <EmptyState text="No announcements yet." />
                        ) : (
                            announcements.map((post: any) => (
                                <div key={post.id} className="rounded-2xl border p-4">
                                    <div className="font-semibold">{post.title}</div>
                                    <p className="mt-1 text-sm text-slate-600">{post.body}</p>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card> */}

                <Card className="rounded-3xl border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle>Available Machines</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {machines.map((machine: any) => (
                            <div key={machine.id} className="rounded-2xl border p-4">
                                <div className="font-semibold">{machine.name}</div>
                                <div className="text-sm text-slate-500">
                                    {machine.brand} {machine.model} • {machine.locationLabel}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>



                <Card className="rounded-3xl border-0 shadow-sm">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CalendarClock className="h-5 w-5" />
                            Upcoming Bookings
                        </CardTitle>
                        <CardDescription>
                            Machine reservations will appear here.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-2xl border border-dashed p-6 text-sm text-slate-500">
                            Booking system coming soon.
                        </div>
                    </CardContent>
                </Card>

               

               
            </div>
        </div>
    );
}

function StatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="text-sm text-slate-500">
          {label}
        </div>

        <div className="mt-1 text-2xl font-bold text-slate-950">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}