"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Lock, Send, Mail, Clock, Tag, User, Users } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { cn } from "@/lib/utils";

const ticket = {
  id: "1",
  ticketNumber: 1042,
  subject: "Cannot log in to my account after password reset",
  status: "open" as const,
  priority: "high" as const,
  channel: "email" as const,
  tags: ["auth", "urgent"],
  createdAt: new Date(Date.now() - 7200000),
  updatedAt: new Date(),
  slaDeadline: new Date(Date.now() + 3600000),
  requester: { id: "u1", name: "Sarah Johnson", email: "sarah@example.com", role: "customer" as const, avatarUrl: null, timezone: "UTC", isOnline: false, createdAt: new Date(Date.now() - 86400000 * 30) },
  assignee: { id: "a1", name: "Mike Chen", email: "mike@co.com", role: "agent" as const, avatarUrl: null, timezone: "UTC", isOnline: true, createdAt: new Date() },
  comments: [
    {
      id: "c1",
      body: "Hi, I tried to reset my password using the link sent to my email, but after clicking it and setting a new password, I can't log in. The page just says 'Invalid credentials'. I've tried three times now. Please help!",
      isInternal: false,
      createdAt: new Date(Date.now() - 7200000),
      author: { id: "u1", name: "Sarah Johnson", email: "sarah@example.com", role: "customer" as const, avatarUrl: null, timezone: "UTC", isOnline: false, createdAt: new Date() },
    },
    {
      id: "c2",
      body: "I checked the auth logs — looks like the password reset token was consumed but the session wasn't properly updated. Trying the force-logout fix.",
      isInternal: true,
      createdAt: new Date(Date.now() - 5400000),
      author: { id: "a1", name: "Mike Chen", email: "mike@co.com", role: "agent" as const, avatarUrl: null, timezone: "UTC", isOnline: true, createdAt: new Date() },
    },
    {
      id: "c3",
      body: "Hi Sarah, thank you for reaching out! I can see there was an issue with the password reset process on our end. I've manually cleared your session cache. Please try logging in again with your new password — it should work now. Let me know if you still have any trouble!",
      isInternal: false,
      createdAt: new Date(Date.now() - 3600000),
      author: { id: "a1", name: "Mike Chen", email: "mike@co.com", role: "agent" as const, avatarUrl: null, timezone: "UTC", isOnline: true, createdAt: new Date() },
    },
  ],
};

const statusOptions = ["new", "open", "pending", "solved", "closed"];
const priorityOptions = ["low", "normal", "high", "urgent"];

const statusColors: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  open: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  solved: "bg-gray-50 text-gray-600 border-gray-200",
  closed: "bg-gray-100 text-gray-500 border-gray-200",
};

export default function TicketDetailPage() {
  const [replyBody, setReplyBody] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(ticket.status);

  return (
    <>
      <PageHeader
        title={`#${ticket.ticketNumber} — ${ticket.subject}`}
        actions={
          <Link href="/tickets" className={buttonVariants({ variant: "outline", size: "sm" })}>
            <ArrowLeft className="size-3.5 mr-1" />
            Back
          </Link>
        }
      />
      <main className="flex-1 overflow-hidden flex">
        {/* Thread */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-6 space-y-4">
            {/* Ticket header */}
            <div className="flex items-start gap-3">
              <Badge variant="outline" className={cn("text-xs", statusColors[currentStatus])}>
                {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} priority
              </Badge>
              <Badge variant="outline" className="text-xs capitalize">
                <Mail className="size-3 mr-1" />
                {ticket.channel}
              </Badge>
              <div className="ml-auto text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="size-3" />
                Opened {formatDistanceToNow(ticket.createdAt, { addSuffix: true })}
              </div>
            </div>

            <Separator />

            {/* Comments */}
            <div className="space-y-6">
              {ticket.comments.map((comment) => (
                <div key={comment.id} className={cn("flex gap-3", comment.isInternal && "opacity-80")}>
                  <Avatar className="size-8 mt-0.5 shrink-0">
                    <AvatarFallback className={cn("text-xs", comment.author.role === "agent" ? "bg-primary/10 text-primary" : "bg-muted")}>
                      {comment.author.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className={cn("rounded-lg p-4 text-sm", comment.isInternal ? "bg-amber-50 border border-amber-200" : "bg-card border")}>
                      {comment.isInternal && (
                        <div className="flex items-center gap-1 text-xs text-amber-700 mb-2 font-medium">
                          <Lock className="size-3" />
                          Internal note — not visible to customer
                        </div>
                      )}
                      <p className="leading-relaxed text-foreground">{comment.body}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 px-1">
                      <span className="text-xs font-medium">{comment.author.name}</span>
                      <span className="text-xs text-muted-foreground">·</span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reply composer */}
          <div className="border-t bg-background p-4 space-y-3">
            <div className="flex gap-2 items-center">
              <Tabs value={isInternal ? "internal" : "reply"} onValueChange={(v) => setIsInternal(v === "internal")}>
                <TabsList className="h-7">
                  <TabsTrigger value="reply" className="text-xs h-5">Reply</TabsTrigger>
                  <TabsTrigger value="internal" className="text-xs h-5">
                    <Lock className="size-3 mr-1" />
                    Internal Note
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <Textarea
              placeholder={isInternal ? "Add an internal note visible only to agents..." : "Write a reply to the customer..."}
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              className={cn("min-h-24 resize-none text-sm", isInternal && "border-amber-300 bg-amber-50/50 focus-visible:ring-amber-400")}
            />
            <div className="flex items-center justify-between">
              <Select defaultValue={currentStatus} onValueChange={(v) => setCurrentStatus(v as typeof currentStatus)}>
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" disabled={!replyBody.trim()}>
                <Send className="size-3.5 mr-1" />
                {isInternal ? "Add Note" : "Send Reply"}
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:flex w-72 flex-col border-l bg-muted/20 overflow-auto">
          <div className="p-4 space-y-4">
            <Card className="shadow-none">
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Ticket Details</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Select value={currentStatus} onValueChange={(v) => setCurrentStatus(v as typeof currentStatus)}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => (
                        <SelectItem key={s} value={s} className="text-xs capitalize">{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Priority</p>
                  <Select defaultValue={ticket.priority}>
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((p) => (
                        <SelectItem key={p} value={p} className="text-xs capitalize">{p}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Assignee</p>
                  <div className="flex items-center gap-2 h-7 px-2 rounded-md border bg-background text-xs">
                    <Avatar className="size-4">
                      <AvatarFallback className="text-[9px]">MC</AvatarFallback>
                    </Avatar>
                    Mike Chen
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {ticket.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-[10px] h-4 px-1.5">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                {ticket.slaDeadline && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">SLA Deadline</p>
                    <p className="text-xs text-amber-600 font-medium">
                      {formatDistanceToNow(ticket.slaDeadline, { addSuffix: true })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardHeader className="pb-2 pt-3 px-3">
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
                  <User className="size-3" /> Requester
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarFallback className="text-xs">SJ</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-medium">{ticket.requester.name}</p>
                    <p className="text-xs text-muted-foreground">{ticket.requester.email}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Customer since {format(ticket.requester.createdAt, "MMM yyyy")}
                </p>
                <Link
                  href={`/customers/${ticket.requester.id}`}
                  className={buttonVariants({ variant: "outline", size: "sm" }) + " w-full h-7 text-xs"}
                >
                  View profile
                </Link>
              </CardContent>
            </Card>
          </div>
        </aside>
      </main>
    </>
  );
}
