import { useState } from "react";
import { Mail, Clock, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const threads = [
  {
    id: "t1",
    from: "Coach Sarah",
    subject: "Laser Cutter Calibration Follow-up",
    preview: "Hi Jane, just wanted to check in on the calibration issue you reported...",
    date: "Feb 20",
    read: false,
    messages: [
      { from: "Coach Sarah", body: "Hi Jane, just wanted to check in on the calibration issue you reported during your session yesterday. Were you able to get it resolved?", time: "Feb 20, 3:15 PM" },
      { from: "You", body: "Thanks for following up! I re-ran the alignment procedure and it seems to be working now. The test cuts are coming out clean.", time: "Feb 20, 4:02 PM" },
      { from: "Coach Sarah", body: "Great to hear! Let me know if you run into any other issues. Happy making!", time: "Feb 20, 4:10 PM" },
    ],
  },
  {
    id: "t2",
    from: "Admin",
    subject: "New Safety Policy Update",
    preview: "All members: please review the updated safety guidelines for...",
    date: "Feb 18",
    read: true,
    messages: [
      { from: "Admin", body: "All members: please review the updated safety guidelines for laser cutter operations. The new policy requires goggles to be worn at all times while the machine is powered on, regardless of whether a cut is in progress.", time: "Feb 18, 10:00 AM" },
    ],
  },
  {
    id: "t3",
    from: "Coach Mike",
    subject: "3D Printer Orientation Session",
    preview: "Your orientation for the Prusa MK4 has been scheduled for...",
    date: "Feb 15",
    read: true,
    messages: [
      { from: "Coach Mike", body: "Your orientation for the Prusa MK4 has been scheduled for next Thursday at 2 PM. Please bring a USB drive with a test print file. See you there!", time: "Feb 15, 11:30 AM" },
    ],
  },
  {
    id: "t4",
    from: "System",
    subject: "Session Summary: Laser Cutter",
    preview: "Your session on Feb 12 has been saved. View your session...",
    date: "Feb 12",
    read: true,
    messages: [
      { from: "System", body: "Your session on Feb 12 has been saved. View your session summary and linked checklist results in the Sessions tab. Tool: Laser Cutter, Model: Epilog Fusion Pro, Duration: 45 minutes.", time: "Feb 12, 5:00 PM" },
    ],
  },
];

export default function MemberMessages() {
  const [selectedThread, setSelectedThread] = useState(threads[0].id);
  const activeThread = threads.find((t) => t.id === selectedThread);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
        <p className="text-muted-foreground mt-1">
          Communication with coaches and system notifications.
        </p>
      </div>

      <div className="flex rounded-md border min-h-[500px]">
        <div className="w-full max-w-xs border-r">
          <div className="p-3 border-b">
            <p className="text-sm font-medium">Threads</p>
          </div>
          <ScrollArea className="h-[450px]">
            <div>
              {threads.map((thread) => (
                <div
                  key={thread.id}
                  role="button"
                  tabIndex={0}
                  className={`p-3 cursor-pointer border-b last:border-b-0 ${
                    selectedThread === thread.id ? "bg-muted" : "hover-elevate"
                  }`}
                  onClick={() => setSelectedThread(thread.id)}
                  onKeyDown={(e) => e.key === "Enter" && setSelectedThread(thread.id)}
                  data-testid={`button-thread-${thread.id}`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className={`text-sm truncate ${!thread.read ? "font-semibold" : "font-medium"}`}>
                      {thread.from}
                    </p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{thread.date}</span>
                  </div>
                  <p className="text-xs font-medium truncate">{thread.subject}</p>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{thread.preview}</p>
                  {!thread.read && (
                    <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 flex flex-col">
          {activeThread ? (
            <>
              <div className="p-4 border-b">
                <h2 className="text-sm font-semibold" data-testid="text-message-subject">
                  {activeThread.subject}
                </h2>
                <p className="text-xs text-muted-foreground">From: {activeThread.from}</p>
              </div>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {activeThread.messages.map((msg, i) => (
                    <div key={i} className="space-y-1" data-testid={`text-msg-body-${i}`}>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <span className="text-sm font-medium">{msg.from}</span>
                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {msg.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground pl-8">{msg.body}</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center space-y-2">
                <Mail className="h-8 w-8 mx-auto" />
                <p className="text-sm">Select a thread to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
