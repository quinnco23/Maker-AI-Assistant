import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

type ApprovalRecord = {
  id: string;
  userName?: string;
  userEmail?: string;
  certificationTitle?: string;
  machineName?: string;
  status: "pending_review" | "active" | "expired" | "revoked";
  earnedAt?: string;
  createdAt?: string;
};

export default function CertificationApprovalsPage() {
  const [approvals, setApprovals] = useState<ApprovalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  async function loadApprovals() {
    try {
      setIsLoading(true);

      const res = await fetch("/api/admin/certification-approvals", {
        credentials: "include",
        headers: {
          "x-dev-user-id": "dev-user",
        },
      });

      if (!res.ok) throw new Error("Failed to load approvals");

      const json = await res.json();
      setApprovals(json.approvals ?? []);
    } catch (error) {
      console.error("Failed to load approvals:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function updateApproval(id: string, action: "approve" | "revoke") {
    const res = await fetch(`/api/admin/certification-approvals/${id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-dev-user-id": "dev-user",
      },
      credentials: "include",
      body: JSON.stringify({ action }),
    });

    if (!res.ok) {
      throw new Error("Failed to update approval");
    }

    await loadApprovals();
  }

  useEffect(() => {
    loadApprovals();
  }, []);

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">
            Certification Approvals
          </h1>
          <p className="mt-2 text-slate-600">
            Review members who passed the online certification and need staff sign-off.
          </p>
        </div>

        <Card className="rounded-3xl border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Reviews
            </CardTitle>
            <CardDescription>
              Approve only after the member completes an in-person machine review.
            </CardDescription>
          </CardHeader>

          <CardContent>
            {isLoading ? (
              <div className="text-sm text-slate-500">Loading approvals...</div>
            ) : approvals.length === 0 ? (
              <div className="rounded-2xl border border-dashed p-6 text-sm text-slate-500">
                No pending certification reviews.
              </div>
            ) : (
              <div className="space-y-3">
                {approvals.map((approval) => (
                  <div
                    key={approval.id}
                    className="rounded-2xl border bg-white p-4"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div>
                        <div className="font-semibold text-slate-950">
                          {approval.userName ?? "Unknown member"}
                        </div>
                        <div className="text-sm text-slate-500">
                          {approval.userEmail}
                        </div>

                        <div className="mt-3 text-sm text-slate-700">
                          <span className="font-medium">
                            {approval.certificationTitle ?? "Certification"}
                          </span>
                          {approval.machineName ? ` • ${approval.machineName}` : ""}
                        </div>

                        <div className="mt-1 text-xs text-slate-500">
                          Submitted{" "}
                          {approval.createdAt
                            ? new Date(approval.createdAt).toLocaleString()
                            : "recently"}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          className="rounded-xl"
                          onClick={() => updateApproval(approval.id, "approve")}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>

                        <Button
                          variant="outline"
                          className="rounded-xl text-red-600"
                          onClick={() => updateApproval(approval.id, "revoke")}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Revoke
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}