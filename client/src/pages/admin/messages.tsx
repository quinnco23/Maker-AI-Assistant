import { useState } from "react";
import { Mail, Clock, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

const threads = [
  {
    id: "at1",
    from: "System",
    subject: "Escalation Alert: Unknown Material",
    preview: "A new escalation has been created for the Laser Cutter...",
    date: "Feb 21",
    read: false,
    messages: [
      { from: "System", body: "A new escalation has been created for the Laser Cutter. Member Alex Rivera attempted to use an unrecognized material. The session has been paused pending staff review.", time: "Feb 21, 10:15 AM" },
    ],
  },
  {
    id: "at2",
    from: "Jane Cooper",
    subject: "Request for 3D Printer Access",
    preview: "Hi, I completed my orientation last week and would like...",
    date: "Feb 20",
    read: false,
    messages: [
      { from: "Jane Cooper", body: "Hi, I completed my orientation last week and would like to request access to the Prusa MK4. Can you enable my certification?", time: "Feb 20, 2:30 PM" },
      { from: "You", body: "Hi Jane! I can see your orientation attendance. Let me enable your 3D Printer certification now. You should be able to start sessions within the hour.", time: "Feb 20, 3:00 PM" },
      { from: "Jane Cooper", body: "Thank you so much!", time: "Feb 20, 3:05 PM" },
    ],
  },
  {
    id: "at3",
    from: "Coach Mike",
    subject: "Weekly Equipment Status Report",
    preview: "All laser cutters passed inspection. The Formlabs Form 3+...",
    date: "Feb 19",
    read: true,
    messages: [
      { from: "Coach Mike", body: "Weekly status: All laser cutters passed inspection. The Formlabs Form 3+ needs a new resin tank - ordered and arriving Thursday. Electronics bench is fully operational. No safety incidents this week.", time: "Feb 19, 9:00 AM" },
    ],
  },
  {
    id: "at4",
    from: "System",
    subject: "Checklist Completion Summary",
    preview: "Daily summary: 18 checklists completed, 2 failed, 89%...",
    date: "Feb 18",
    read: true,
    messages: [
      { from: "System", body: "Daily checklist summary: 18 checklists completed successfully, 2 failed (ventilation check on Laser Cutter #2). Overall completion rate: 89%. Failed checklists have been flagged for staff review.", time: "Feb 18, 6:00 PM" },
    ],
  },
];

export default function AdminMessages() {
  const [selectedThread, setSelectedThread] = useState(threads[0].id);
  const activeThread = threads.find((t) => t.id === selectedThread);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight" data-testid="text-page-title">
          Admin Messages
        </h1>
        <p className="text-muted-foreground mt-1">
          Staff communications, system alerts, and member requests.
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
