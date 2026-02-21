import { useState } from "react";
import { UserPlus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";

const membersData = [
  {
    id: "u1",
    name: "Jane Cooper",
    role: "member",
    certifications: ["Laser Cutter", "3D Printer"],
    lastActive: "2 hours ago",
  },
  {
    id: "u2",
    name: "Alex Rivera",
    role: "member",
    certifications: ["Laser Cutter"],
    lastActive: "30 minutes ago",
  },
  {
    id: "u3",
    name: "Sarah Chen",
    role: "staff",
    certifications: ["Laser Cutter", "3D Printer", "Electronics"],
    lastActive: "Just now",
  },
  {
    id: "u4",
    name: "Mike Johnson",
    role: "staff",
    certifications: ["3D Printer", "Electronics"],
    lastActive: "1 day ago",
  },
  {
    id: "u5",
    name: "Emily Davis",
    role: "admin",
    certifications: ["Laser Cutter", "3D Printer", "Electronics"],
    lastActive: "5 minutes ago",
  },
  {
    id: "u6",
    name: "Tom Wilson",
    role: "member",
    certifications: [],
    lastActive: "3 days ago",
  },
];

const roleBadgeVariant = (role: string) => {
  switch (role) {
    case "admin":
      return "default" as const;
    case "staff":
      return "secondary" as const;
    default:
      return "outline" as const;
  }
};

export default function AdminMembers() {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">
            Members & Staff
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage member accounts, roles, and certification status.
          </p>
        </div>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-invite-member">
              <UserPlus className="h-4 w-4" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Member</DialogTitle>
              <DialogDescription>
                Send an invitation email to add a new member to your makerspace.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <Input
                placeholder="email@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                data-testid="input-invite-email"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteOpen(false)} data-testid="button-cancel-invite">
                Cancel
              </Button>
              <Button onClick={() => setInviteOpen(false)} data-testid="button-send-invite">
                Send Invitation
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Certifications</TableHead>
                <TableHead className="text-right">Last Active</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {membersData.map((member) => (
                <TableRow key={member.id} data-testid={`row-member-${member.id}`}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Users className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{member.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={roleBadgeVariant(member.role)} className="no-default-hover-elevate capitalize">
                      {member.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 flex-wrap">
                      {member.certifications.length > 0 ? (
                        member.certifications.map((cert) => (
                          <Badge key={cert} variant="secondary" className="no-default-hover-elevate text-xs">
                            {cert}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-muted-foreground">None</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {member.lastActive}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
