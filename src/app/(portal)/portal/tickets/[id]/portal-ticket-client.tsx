"use client"

import { useState, useTransition } from "react"
import { addPortalReply } from "@/lib/actions/portal"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

const statusColors: Record<string, string> = {
  new: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  open: "bg-green-500/15 text-green-400 border-green-500/30",
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  solved: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  closed: "bg-gray-500/15 text-gray-500 border-gray-500/30",
}

interface PortalTicketClientProps {
  ticket: {
    id: string
    ticketNumber: number
    subject: string
    status: string
    priority: string
    createdAt: Date
    assignee?: { id: string; name: string } | null
    comments: Array<{
      id: string
      body: string
      createdAt: Date
      author: { id: string; name: string; role: string }
    }>
  }
}

export function PortalTicketClient({ ticket }: PortalTicketClientProps) {
  const [replyBody, setReplyBody] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const isClosed = ticket.status === "solved" || ticket.status === "closed"

  const handleSubmit = () => {
    if (!replyBody.trim()) return
    setError(null)
    startTransition(async () => {
      const result = await addPortalReply(ticket.id, replyBody)
      if (result.error) {
        setError(result.error)
      } else {
        setReplyBody("")
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/portal"
          className="text-xs flex items-center gap-1 hover:opacity-80 transition-opacity mb-3"
          style={{ color: "var(--rk-text3)" }}
        >
          <ArrowLeft className="size-3.5" />
          Back to tickets
        </Link>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs" style={{ color: "var(--rk-text3)" }}>
                #{ticket.ticketNumber}
              </span>
              <Badge
                variant="outline"
                className={`text-[10px] h-4 px-1.5 capitalize ${statusColors[ticket.status] ?? ""}`}
              >
                {ticket.status}
              </Badge>
              <Badge variant="outline" className="text-[10px] h-4 px-1.5 capitalize">
                {ticket.priority}
              </Badge>
            </div>
            <h1 className="text-lg font-bold" style={{ color: "var(--rk-text)" }}>
              {ticket.subject}
            </h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--rk-text3)" }}>
              Opened {formatDistanceToNow(ticket.createdAt, { addSuffix: true })}
              {ticket.assignee && ` · Assigned to ${ticket.assignee.name}`}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        {ticket.comments.map((comment) => {
          const isAgent = comment.author.role === "agent" || comment.author.role === "admin"
          return (
            <div key={comment.id} className="flex gap-3">
              <Avatar className="size-8 shrink-0 mt-0.5">
                <AvatarFallback
                  className="text-xs"
                  style={
                    isAgent
                      ? { background: "rgba(0,194,255,0.15)", color: "var(--rk-accent)" }
                      : { background: "var(--rk-surface2)", color: "var(--rk-text2)" }
                  }
                >
                  {comment.author.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <Card className="shadow-none">
                  <CardContent className="p-3 text-sm leading-relaxed" style={{ color: "var(--rk-text)" }}>
                    <div className="whitespace-pre-wrap">{comment.body}</div>
                  </CardContent>
                </Card>
                <div className="flex items-center gap-2 mt-1 px-1">
                  <span className="text-xs font-medium" style={{ color: "var(--rk-text2)" }}>
                    {comment.author.name}
                  </span>
                  {isAgent && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(0,194,255,0.12)", color: "var(--rk-accent)" }}
                    >
                      Support Agent
                    </span>
                  )}
                  <span className="text-xs" style={{ color: "var(--rk-text3)" }}>
                    {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          )
        })}

        {ticket.comments.length === 0 && (
          <p className="text-sm text-center py-4" style={{ color: "var(--rk-text3)" }}>
            No messages yet
          </p>
        )}
      </div>

      {!isClosed && (
        <div
          className="border rounded-lg p-4 space-y-3"
          style={{ borderColor: "var(--rk-border)", background: "var(--rk-surface)" }}
        >
          <p className="text-xs font-medium" style={{ color: "var(--rk-text2)" }}>
            Add a reply
          </p>
          <Textarea
            placeholder="Type your reply here..."
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            className="min-h-24 resize-none text-sm"
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <Button
            size="sm"
            disabled={!replyBody.trim() || isPending}
            onClick={handleSubmit}
          >
            <Send className="size-3.5 mr-1" />
            {isPending ? "Sending…" : "Send Reply"}
          </Button>
        </div>
      )}

      {isClosed && (
        <p className="text-sm text-center py-2" style={{ color: "var(--rk-text3)" }}>
          This ticket is {ticket.status}. Open a new ticket if you need further assistance.
        </p>
      )}
    </div>
  )
}
