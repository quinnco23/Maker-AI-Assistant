import { useState } from "react";
import { Settings, AlertTriangle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AdminSettings() {
  const [name, setName] = useState("Downtown Makerspace");
  const [description, setDescription] = useState(
    "A community workshop with laser cutters, 3D printers, and electronics workbenches."
  );
  const [retention, setRetention] = useState("90-days");
  const [notifications, setNotifications] = useState({
    escalations: true,
    checklistFailures: true,
    newMembers: true,
    weeklyReport: false,
  });

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1">
          Configure your makerspace preferences and policies.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Makerspace Details</CardTitle>
          <CardDescription>Basic information about your makerspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Makerspace Name</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              data-testid="input-makerspace-name"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              data-testid="input-makerspace-description"
            />
          </div>
          <Button data-testid="button-save-details">Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Retention Policy</CardTitle>
          <CardDescription>
            How long to keep session logs and conversation data.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={retention} onValueChange={setRetention}>
            <SelectTrigger data-testid="select-retention">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30-days">30 days</SelectItem>
              <SelectItem value="90-days">90 days</SelectItem>
              <SelectItem value="180-days">180 days</SelectItem>
              <SelectItem value="1-year">1 year</SelectItem>
              <SelectItem value="indefinite">Indefinite</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" data-testid="button-save-retention">
            Update Policy
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Notification Preferences</CardTitle>
          <CardDescription>
            Choose which notifications you want to receive.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "escalations" as const, label: "Escalation alerts", desc: "Get notified when a session is escalated" },
            { key: "checklistFailures" as const, label: "Checklist failures", desc: "Alert when a checklist fails" },
            { key: "newMembers" as const, label: "New member sign-ups", desc: "Notification for new registrations" },
            { key: "weeklyReport" as const, label: "Weekly digest", desc: "Summary of weekly activity" },
          ].map((pref) => (
            <div key={pref.key} className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{pref.label}</p>
                <p className="text-xs text-muted-foreground">{pref.desc}</p>
              </div>
              <Switch
                checked={notifications[pref.key]}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, [pref.key]: checked }))
                }
                data-testid={`switch-notif-${pref.key}`}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Separator />

      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Danger Zone
        </h2>
        <Card className="border-destructive/30">
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-medium">Export All Data</p>
                <p className="text-xs text-muted-foreground">
                  Download all session logs, member data, and configurations.
                </p>
              </div>
              <Button variant="outline" data-testid="button-export-data">
                Export
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-medium">Clear Session History</p>
                <p className="text-xs text-muted-foreground">
                  Permanently delete all session logs. This cannot be undone.
                </p>
              </div>
              <Button variant="destructive" data-testid="button-clear-sessions">
                Clear History
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div>
                <p className="text-sm font-medium">Reset Makerspace</p>
                <p className="text-xs text-muted-foreground">
                  Reset all configurations to factory defaults. This cannot be undone.
                </p>
              </div>
              <Button variant="destructive" data-testid="button-reset-makerspace">
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
