"use client"

import { useState, useTransition } from "react"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowLeft, Lock, Send, Mail, Clock, User, FileText, ChevronDown } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, format } from "date-fns"
import { cn } from "@/lib/utils"
import { addComment, updateTicketFields } from "@/lib/actions/tickets"
import type { TicketStatus, TicketPriority } from "@/types"

interface MacroOption {
  id: string
  name: string
  body: string
  status: string | null
  priority: string | null
}

interface TicketDetailClientProps {
  macros?: MacroOption[]
  ticket: {
    id: string
    ticketNumber: number
    subject: string
    status: TicketStatus
    priority: TicketPriority
    channel: string
    tags: string[]
    createdAt: Date
    slaDeadline: Date | null
    requester: {
      id: string
      name: string
      email: string
      createdAt: Date
    }
    assignee?: { id: string; name: string; email: string } | null
    comments: Array<{
      id: string
      body: string
      isInternal: boolean
      createdAt: Date
      author: { id: string; name: string; role: string }
    }>
  }
  agents: Array<{ id: string; name: string; email: string }>
  currentUserId: string
}

const statusColors: Record<string, string> = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  open: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  solved: "bg-gray-50 text-gray-600 border-gray-200",
  closed: "bg-gray-100 text-gray-500 border-gray-200",
}

const statusOptions: TicketStatus[] = ["new", "open", "pending", "solved", "closed"]
const priorityOptions: TicketPriority[] = ["low", "normal", "high", "urgent"]

export function TicketDetailClient({
  ticket,
  agents,
  macros = [],
  currentUserId: _currentUserId,
}: TicketDetailClientProps) {
  const [replyBody, setReplyBody] = useState("")
  const [isInternal, setIsInternal] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<TicketStatus>(ticket.status)
  const [currentStatus, setCurrentStatus] = useState<TicketStatus>(ticket.status)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleStatusChange = (status: TicketStatus) => {
    setCurrentStatus(status)
    startTransition(async () => {
      await updateTicketFields(ticket.id, { status })
    })
  }

  const handlePriorityChange = (priority: TicketPriority) => {
    startTransition(async () => {
      await updateTicketFields(ticket.id, { priority })
    })
  }

  const handleAssigneeChange = (assigneeId: string | null) => {
    startTransition(async () => {
      await updateTicketFields(ticket.id, {
        assigneeId: assigneeId === "unassigned" || assigneeId === null ? null : assigneeId,
      })
    })
  }

  const handleSubmitReply = () => {
    if (!replyBody.trim()) return
    setError(null)
    startTransition(async () => {
      const result = await addComment(
        ticket.id,
        replyBody,
        isInternal,
        submitStatus !== currentStatus ? submitStatus : undefined
      )
      if (result.error) {
        setError(result.error)
      } else {
        setReplyBody("")
        if (submitStatus !== currentStatus) setCurrentStatus(submitStatus)
      }
    })
  }

  return (
    <>
      <PageHeader
        title={`#${ticket.ticketNumber} — ${ticket.subject}`}
        actions={
          <Link
            href="/tickets"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ArrowLeft className="size-3.5 mr-1" />
            Back
          </Link>
        }
      />
      <main className="flex-1 overflow-hidden flex">
        {/* Thread */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-6 space-y-4">
            <div className="flex items-start gap-3">
              <Badge
                variant="outline"
                className={cn("text-xs", statusColors[currentStatus])}
              >
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

            <div className="space-y-6">
              {ticket.comments.map((comment) => (
                <div
                  key={comment.id}
                  className={cn("flex gap-3", comment.isInternal && "opacity-80")}
                >
                  <Avatar className="size-8 mt-0.5 shrink-0">
                    <AvatarFallback
                      className={cn(
                        "text-xs",
                        comment.author.role === "agent" || comment.author.role === "admin"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted"
                      )}
                    >
                      {comment.author.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "rounded-lg p-4 text-sm",
                        comment.isInternal
                          ? "bg-amber-50 border border-amber-200"
                          : "bg-card border"
                      )}
                    >
                      {comment.isInternal && (
                        <div className="flex items-center gap-1 text-xs text-amber-700 mb-2 font-medium">
                          <Lock className="size-3" />
                          Internal note — not visible to customer
                        </div>
                      )}
                      <p className="leading-relaxed text-foreground whitespace-pre-wrap">
                        {comment.body}
                      </p>
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

              {ticket.comments.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No messages yet
                </p>
              )}
            </div>
          </div>

          {/* Reply composer */}
          <div className="border-t bg-background p-4 space-y-3">
            <Tabs
              value={isInternal ? "internal" : "reply"}
              onValueChange={(v) => setIsInternal(v === "internal")}
            >
              <TabsList className="h-7">
                <TabsTrigger value="reply" className="text-xs h-5">
                  Reply
                </TabsTrigger>
                <TabsTrigger value="internal" className="text-xs h-5">
                  <Lock className="size-3 mr-1" />
                  Internal Note
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative">
              <Textarea
                placeholder={
                  isInternal
                    ? "Add an internal note visible only to agents..."
                    : "Write a reply to the customer..."
                }
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
                className={cn(
                  "min-h-24 resize-none text-sm",
                  isInternal &&
                    "border-amber-300 bg-amber-50/50 focus-visible:ring-amber-400"
                )}
              />
              {macros.length > 0 && (
                <div className="absolute bottom-2 right-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger render={
                      <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2">
                        <FileText className="size-3" />
                        Macro
                        <ChevronDown className="size-3" />
                      </Button>
                    } />
                    <DropdownMenuContent align="end" className="w-52">
                      {macros.map((m) => (
                        <DropdownMenuItem
                          key={m.id}
                          onClick={() => setReplyBody(m.body)}
                          className="text-xs"
                        >
                          {m.name}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <div className="flex items-center justify-between">
              <Select
                value={submitStatus}
                onValueChange={(v) => setSubmitStatus(v as TicketStatus)}
              >
                <SelectTrigger className="h-8 w-36 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s} className="text-xs capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                size="sm"
                disabled={!replyBody.trim() || isPending}
                onClick={handleSubmitReply}
              >
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
                <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Ticket Details
                </CardTitle>
              </CardHeader>
              <CardContent className="px-3 pb-3 space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <Select
                    value={currentStatus}
                    onValueChange={(v) => handleStatusChange(v as TicketStatus)}
                    disabled={isPending}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => (
                        <SelectItem key={s} value={s} className="text-xs capitalize">
                          {s}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Priority</p>
                  <Select
                    defaultValue={ticket.priority}
                    onValueChange={(v) => handlePriorityChange(v as TicketPriority)}
                    disabled={isPending}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((p) => (
                        <SelectItem key={p} value={p} className="text-xs capitalize">
                          {p}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Assignee</p>
                  <Select
                    defaultValue={ticket.assignee?.id ?? "unassigned"}
                    onValueChange={handleAssigneeChange}
                    disabled={isPending}
                  >
                    <SelectTrigger className="h-7 text-xs">
                      <SelectValue placeholder="Unassigned" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned" className="text-xs">
                        Unassigned
                      </SelectItem>
                      {agents.map((agent) => (
                        <SelectItem key={agent.id} value={agent.id} className="text-xs">
                          {agent.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Tags</p>
                  <div className="flex flex-wrap gap-1">
                    {ticket.tags.length > 0 ? (
                      ticket.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[10px] h-4 px-1.5">
                          {tag}
                        </Badge>
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">No tags</span>
                    )}
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
                    <AvatarFallback className="text-xs">
                      {ticket.requester.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
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
                  className={
                    buttonVariants({ variant: "outline", size: "sm" }) +
                    " w-full h-7 text-xs"
                  }
                >
                  View profile
                </Link>
              </CardContent>
            </Card>
          </div>
        </aside>
      </main>
    </>
  )
}
