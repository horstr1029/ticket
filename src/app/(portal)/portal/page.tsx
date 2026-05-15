import { auth } from "@/lib/auth"
import { getMyTickets } from "@/lib/queries/portal"
import Link from "next/link"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Inbox } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

const statusColors: Record<string, string> = {
  new: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  open: "bg-green-500/15 text-green-400 border-green-500/30",
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  solved: "bg-gray-500/15 text-gray-400 border-gray-500/30",
  closed: "bg-gray-500/15 text-gray-500 border-gray-500/30",
}

export default async function PortalPage() {
  const session = await auth()
  const tickets = await getMyTickets(session!.user.id)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold" style={{ color: "var(--rk-text)" }}>
            My Support Tickets
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--rk-text3)" }}>
            Track and manage your support requests
          </p>
        </div>
        <Link href="/portal/new" className={buttonVariants({ size: "sm" })}>
          <Plus className="size-3.5 mr-1" />
          New Ticket
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--rk-text3)" }}>
          <Inbox className="size-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium mb-1" style={{ color: "var(--rk-text2)" }}>
            No tickets yet
          </p>
          <p className="text-xs mb-4">Submit a request and we&apos;ll get back to you.</p>
          <Link href="/portal/new" className={buttonVariants({ size: "sm" })}>
            <Plus className="size-3.5 mr-1" />
            Submit a request
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((t) => (
            <Link key={t.id} href={`/portal/tickets/${t.id}`}>
              <Card className="shadow-none hover:border-[var(--rk-accent)]/40 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs" style={{ color: "var(--rk-text3)" }}>
                        #{t.ticketNumber}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] h-4 px-1.5 capitalize ${statusColors[t.status] ?? ""}`}
                      >
                        {t.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium truncate" style={{ color: "var(--rk-text)" }}>
                      {t.subject}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--rk-text3)" }}>
                      {t._count.comments} message{t._count.comments !== 1 ? "s" : ""} ·{" "}
                      {formatDistanceToNow(t.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                  {t.assignee && (
                    <div className="text-right shrink-0">
                      <p className="text-xs" style={{ color: "var(--rk-text3)" }}>
                        Assigned to
                      </p>
                      <p className="text-xs font-medium" style={{ color: "var(--rk-text2)" }}>
                        {t.assignee.name}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
