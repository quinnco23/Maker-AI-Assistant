import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

type StaffReviewer = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  role: string;
};

export function ScheduleStaffReviewStep({
  moduleId,
  machineId,
  onDone,
}: {
  moduleId: string;
  machineId?: string | null;
  onDone: () => void;
}) {
  const [staff, setStaff] = useState<StaffReviewer[]>([]);
  const [selectedStaffId, setSelectedStaffId] = useState("");
  const [requestedDate, setRequestedDate] = useState("");
  const [requestedTime, setRequestedTime] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadStaff() {
      const res = await fetch("/api/member/review-staff", {
        credentials: "include",
      });

      const json = await res.json();

      console.log("review staff status:", res.status);
console.log("review staff response:", json);

      if (res.ok) {
        setStaff(json.staff ?? []);
        setSelectedStaffId(json.staff?.[0]?.id ?? "");
      }
    }

    loadStaff();
  }, []);

  async function submitRequest() {
    try {
      setIsSubmitting(true);
      setMessage("");

      const res = await fetch("/api/member/certification-review-requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          certificationModuleId: moduleId,
          machineId,
          staffUserId: selectedStaffId,
          requestedDate,
          requestedTime,
          notes,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to request review");
      }

      setMessage("Review request submitted");
      setTimeout(onDone, 1200);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Failed to request review",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const selectedStaff = staff.find((s) => s.id === selectedStaffId);

  return (
    <main className="min-h-screen bg-neutral-100 p-6">
      <div className="mx-auto max-w-3xl rounded-3xl border bg-white p-6 shadow-sm">
        <p className="text-sm font-medium text-neutral-500">Final Step</p>

        <h1 className="mt-2 text-3xl font-bold text-neutral-900">
          Schedule your in-person review
        </h1>

        <p className="mt-3 text-neutral-600">
          You passed the online certification. Pick a staff reviewer and request
          a time for your hands-on machine checkoff.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-800">
              Staff reviewer
            </label>

            <div className="grid gap-3">
              {staff.map((person) => {
                const selected = selectedStaffId === person.id;
                const initials = person.fullName
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => setSelectedStaffId(person.id)}
                    className={[
                      "flex items-center gap-3 rounded-2xl border p-4 text-left transition",
                      selected
                        ? "border-neutral-900 bg-neutral-50"
                        : "border-neutral-200 hover:border-neutral-400",
                    ].join(" ")}
                  >
                    {person.avatarUrl ? (
                      <img
                        src={person.avatarUrl}
                        alt={person.fullName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-sm font-semibold text-white">
                        {initials}
                      </div>
                    )}

                    <div>
                      <div className="font-semibold text-neutral-900">
                        {person.fullName}
                      </div>
                      <div className="text-sm text-neutral-500">
                        {person.role} • {person.email}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedStaff && (
            <div className="rounded-2xl bg-neutral-50 p-4 text-sm text-neutral-700">
              Your review request will be sent to{" "}
              <span className="font-medium">{selectedStaff.fullName}</span>.
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-800">
                Preferred date
              </label>
              <input
                type="date"
                value={requestedDate}
                onChange={(e) => setRequestedDate(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-800">
                Preferred time
              </label>
              <input
                type="time"
                value={requestedTime}
                onChange={(e) => setRequestedTime(e.target.value)}
                className="w-full rounded-xl border px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-800">
              Notes for staff
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Anything staff should know before your review?"
              className="min-h-[90px] w-full rounded-xl border px-3 py-2 text-sm"
            />
          </div>

          {message && (
            <div className="rounded-xl bg-neutral-100 p-3 text-sm text-neutral-700">
              {message}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              disabled={
                isSubmitting ||
                !selectedStaffId ||
                !requestedDate ||
                !requestedTime
              }
              onClick={submitRequest}
              className="rounded-xl"
            >
              {isSubmitting ? "Submitting..." : "Request Review"}
            </Button>

            <Button variant="outline" onClick={onDone} className="rounded-xl">
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}