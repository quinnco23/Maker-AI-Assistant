import { useEffect, useState } from "react";
import { CalendarClock, CheckCircle, XCircle, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type CertificationReviewRequest = {
  id: string;
  memberName?: string;
  memberEmail?: string;
  memberAvatarUrl?: string | null;
  certificationTitle?: string;
  machineName?: string;
  staffName?: string;
  staffEmail?: string;
  staffAvatarUrl?: string | null;
  requestedDate: string;
  requestedTime: string;
  notes?: string;
  status: "pending" | "scheduled" | "completed" | "rejected";
};

function initials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function CertificationReviewsPage() {
  const [requests, setRequests] = useState<CertificationReviewRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState("");

  async function loadRequests() {
    try {
      setIsLoading(true);

      const res = await fetch("/api/admin/certification-review-requests", {
        credentials: "include",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to load review requests");
      }

      setRequests(json.requests ?? []);
    } catch (error) {
      console.error("Failed to load review requests:", error);
      setMessage(
        error instanceof Error
          ? error.message
          : "Failed to load review requests",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function updateRequestStatus(
    requestId: string,
    action: "complete" | "reject",
  ) {
    try {
      setMessage("");

      const res = await fetch(
        `/api/admin/certification-review-requests/${requestId}/${action}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to update review request");
      }

      setMessage(
        action === "complete"
          ? "Review completed. Certification is now active."
          : "Review rejected.",
      );

      await loadRequests();
    } catch (error) {
      console.error("Failed to update request:", error);
      setMessage(
        error instanceof Error ? error.message : "Failed to update request",
      );
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
          <CalendarClock className="h-4 w-4" />
          Certification Reviews
        </div>

        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Review Schedule
        </h1>

        <p className="mt-2 text-slate-600">
          Manage hands-on machine checkoffs after members pass online
          certification.
        </p>
      </div>

      {message && (
        <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
          {message}
        </div>
      )}

      <Card className="rounded-3xl border-01shadow-sm w-full">
        <CardHeader>
          <CardTitle>Scheduled and Pending Reviews</CardTitle>
          <CardDescription>
            Complete a review when staff has verified safe setup, operation, and
            shutdown.
          </CardDescription>
        </CardHeader>

        <CardContent >
          {isLoading ? (
            <div className="text-sm text-slate-500">Loading reviews...</div>
          ) : requests.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-8 text-center text-sm text-slate-500">
              No certification review requests yet.
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="rounded-2xl border bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex gap-3">
                      {request.memberAvatarUrl ? (
                        <img
                          src={request.memberAvatarUrl}
                          alt={request.memberName ?? "Member"}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                          {initials(request.memberName)}
                        </div>
                      )}

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="font-semibold text-slate-950">
                            {request.memberName ?? "Unknown member"}
                          </div>

                          <Badge
                            variant={
                              request.status === "completed"
                                ? "default"
                                : request.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {request.status}
                          </Badge>
                        </div>

                        <div className="text-sm text-slate-500">
                          {request.memberEmail}
                        </div>

                        <div className="mt-3 text-sm text-slate-700">
                          <span className="font-medium">
                            {request.certificationTitle ?? "Certification"}
                          </span>
                          {request.machineName
                            ? ` • ${request.machineName}`
                            : ""}
                        </div>

                        <div className="mt-1 text-sm text-slate-600">
                          Requested:{" "}
                          <span className="font-medium">
                            {request.requestedDate} at {request.requestedTime}
                          </span>
                        </div>

                        {request.staffName && (
                          <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
                            {request.staffAvatarUrl ? (
                              <img
                                src={request.staffAvatarUrl}
                                alt={request.staffName}
                                className="h-7 w-7 rounded-full object-cover"
                              />
                            ) : (
                              <UserCircle className="h-5 w-5" />
                            )}
                            Reviewer:{" "}
                            <span className="font-medium">
                              {request.staffName}
                            </span>
                          </div>
                        )}

                        {request.notes && (
                          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
                            {request.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-wrap gap-2">
                      {request.status !== "completed" &&
                        request.status !== "rejected" && (
                          <>
                            <Button
                              className="rounded-xl"
                              onClick={() =>
                                updateRequestStatus(request.id, "complete")
                              }
                            >
                              <CheckCircle className="mr-2 h-4 w-4" />
                              Complete Review
                            </Button>

                            <Button
                              variant="outline"
                              className="rounded-xl text-red-600"
                              onClick={() =>
                                updateRequestStatus(request.id, "reject")
                              }
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              Reject
                            </Button>
                          </>
                        )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}