import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function EditMemberProfilePage() {
  const [, setLocation] = useLocation();

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        setIsLoading(true);

        const res = await fetch("/api/member/profile", {
          credentials: "include",
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || "Failed to load profile");
        }

        setFullName(json.user?.fullName ?? "");
        setAvatarUrl(json.user?.avatarUrl ?? "");
        setBio(json.user?.bio ?? "");
        setPhone(json.user?.phone ?? "");
      } catch (error) {
        console.error("Failed to load profile:", error);
        setMessage(error instanceof Error ? error.message : "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    }

    loadProfile();
  }, []);

  async function handleSave() {
    try {
      setIsSaving(true);
      setMessage("");

      const res = await fetch("/api/member/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          fullName,
          avatarUrl,
          bio,
          phone,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to save profile");
      }

      setMessage("Profile saved");
      setTimeout(() => {
        setLocation("/app/member/profile");
      }, 700);
    } catch (error) {
      console.error("Failed to save profile:", error);
      setMessage(error instanceof Error ? error.message : "Failed to save profile");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return <div className="p-6 text-sm text-slate-500">Loading profile...</div>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Member Profile</h1>
          <p className="text-sm text-slate-500">
            Update your profile information and avatar.
          </p>
        </div>

        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => setLocation("/app/member/profile")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      <Card className="rounded-3xl border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
          <CardDescription>
            This information appears on your member profile.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          {message && (
            <div className="rounded-xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
              {message}
            </div>
          )}

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName || "Member avatar"}
                className="h-24 w-24 rounded-3xl object-cover"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-slate-900 text-2xl font-bold text-white">
                {fullName
                  .split(" ")
                  .map((p) => p[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase() || "M"}
              </div>
            )}

            <div className="w-full space-y-2">
              <label className="text-sm font-medium">Avatar URL</label>
              <Input
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://example.com/avatar.png"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Full Name</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Phone</label>
            <Input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Optional phone number"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell your makerspace a little about what you like to build."
              className="min-h-[120px]"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full rounded-xl sm:w-auto"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}