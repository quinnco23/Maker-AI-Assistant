import { useState } from "react";
import {
  UserCircle,
  Mail,
  Shield,
  Crosshair,
  Printer,
  Cpu,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

const certifications = [
  { id: "laser", label: "Laser Cutter", icon: Crosshair },
  { id: "3d-printer", label: "3D Printer", icon: Printer },
  { id: "electronics", label: "Electronics", icon: Cpu },
];

const safetyAcknowledgements = [
  { id: "general", label: "General Makerspace Safety Guidelines" },
  { id: "ppe", label: "PPE Requirements Acknowledged" },
  { id: "emergency", label: "Emergency Procedures Reviewed" },
  { id: "materials", label: "Approved Materials Policy Accepted" },
];

export default function MemberProfile() {
  const [certState, setCertState] = useState<Record<string, boolean>>({
    laser: true,
    "3d-printer": false,
    electronics: false,
  });

  const [safetyState, setSafetyState] = useState<Record<string, boolean>>({
    general: true,
    ppe: true,
    emergency: false,
    materials: true,
  });

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-1">
          Your account information, certifications, and safety acknowledgements.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16">
          <AvatarFallback className="text-lg font-semibold">JD</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h2 className="text-lg font-semibold" data-testid="text-user-name">Jane Doe</h2>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Mail className="h-3.5 w-3.5" />
            <span data-testid="text-user-email">jane.doe@makerspace.org</span>
          </div>
          <Badge variant="secondary">Member</Badge>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Certifications</h2>
        </div>
        <p className="text-sm text-muted-foreground">
          Self-declared certifications. Check the tools you are trained on.
        </p>
        <div className="space-y-3">
          {certifications.map((cert) => (
            <label
              key={cert.id}
              className="flex items-center gap-3 rounded-md border p-4 cursor-pointer"
              data-testid={`checkbox-cert-${cert.id}`}
            >
              <Checkbox
                checked={certState[cert.id]}
                onCheckedChange={(checked) =>
                  setCertState((prev) => ({ ...prev, [cert.id]: checked === true }))
                }
              />
              <cert.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">{cert.label}</span>
              {certState[cert.id] && (
                <Badge variant="outline" className="ml-auto text-[10px]">Certified</Badge>
              )}
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Safety Acknowledgements</h2>
        <p className="text-sm text-muted-foreground">
          Toggle to confirm you have reviewed and accepted each safety policy.
        </p>
        <div className="space-y-3">
          {safetyAcknowledgements.map((ack) => (
            <div
              key={ack.id}
              className="flex items-center justify-between gap-4 rounded-md border p-4"
              data-testid={`switch-safety-${ack.id}`}
            >
              <Label htmlFor={`safety-${ack.id}`} className="text-sm cursor-pointer flex-1">
                {ack.label}
              </Label>
              <Switch
                id={`safety-${ack.id}`}
                checked={safetyState[ack.id]}
                onCheckedChange={(checked) =>
                  setSafetyState((prev) => ({ ...prev, [ack.id]: checked }))
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
