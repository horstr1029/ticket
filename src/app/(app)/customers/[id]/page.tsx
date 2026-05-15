import { notFound } from "next/navigation"
import { getCustomerById } from "@/lib/queries/customers"
import { PageHeader } from "@/components/page-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { ArrowLeft, Mail, Ticket, MessageSquare } from "lucide-react"
import Link from "next/link"
import { format, formatDistanceToNow } from "date-fns"

const statusColors: Record<string, string> = {
  new: "bg-blue-500/15 text-blue-400",
  open: "bg-green-500/15 text-green-400",
  pending: "bg-amber-500/15 text-amber-400",
  solved: "bg-gray-500/15 text-gray-400",
  closed: "bg-gray-500/15 text-gray-500",
}

export default async function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const customer = await getCustomerById(id)
  if (!customer) notFound()

  const openCount = customer.requestedTickets.filter(
    (t) => t.status === "new" || t.status === "open" || t.status === "pending"
  ).length
  const solvedCount = customer.requestedTickets.filter(
    (t) => t.status === "solved" || t.status === "closed"
  ).length

  return (
    <>
      <PageHeader
        title={customer.name}
        description={customer.email}
        actions={
          <Link
            href="/customers"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ArrowLeft className="size-3.5 mr-1" />
            Back
          </Link>
        }
      />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-4xl space-y-6">
          {/* Customer profile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="shadow-none">
              <CardContent className="p-4 flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarFallback
                    className="text-base font-semibold"
                    style={{ background: "rgba(0,194,255,0.12)", color: "var(--rk-accent)" }}
                  >
                    {customer.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold" style={{ color: "var(--rk-text)" }}>
                    {customer.name}
                  </p>
                  <p className="text-xs flex items-center gap-1 mt-0.5" style={{ color: "var(--rk-text3)" }}>
                    <Mail className="size-3" />
                    {customer.email}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--rk-text3)" }}>
                    Customer since {format(customer.createdAt, "MMM d, yyyy")}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Ticket className="size-4" style={{ color: "var(--rk-accent)" }} />
                  <span className="text-xs" style={{ color: "var(--rk-text3)" }}>Ticket Summary</span>
                </div>
                <div className="flex gap-4 mt-2">
                  <div>
                    <p className="text-xl font-bold" style={{ color: "var(--rk-text)" }}>
                      {customer.requestedTickets.length}
                    </p>
                    <p className="text-xs" style={{ color: "var(--rk-text3)" }}>total</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold" style={{ color: "#f0b429" }}>{openCount}</p>
                    <p className="text-xs" style={{ color: "var(--rk-text3)" }}>open</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold" style={{ color: "var(--rk-green)" }}>{solvedCount}</p>
                    <p className="text-xs" style={{ color: "var(--rk-text3)" }}>resolved</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="size-4" style={{ color: "var(--rk-accent)" }} />
                  <span className="text-xs" style={{ color: "var(--rk-text3)" }}>Last Activity</span>
                </div>
                {customer.requestedTickets[0] ? (
                  <>
                    <p className="text-sm font-medium mt-2 line-clamp-1" style={{ color: "var(--rk-text)" }}>
                      {customer.requestedTickets[0].subject}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--rk-text3)" }}>
                      {formatDistanceToNow(customer.requestedTickets[0].createdAt, { addSuffix: true })}
                    </p>
                  </>
                ) : (
                  <p className="text-xs mt-2" style={{ color: "var(--rk-text3)" }}>No activity</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Ticket history */}
          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Ticket History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {customer.requestedTickets.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: "var(--rk-text3)" }}>
                  No tickets yet
                </p>
              ) : (
                <div className="divide-y" style={{ borderColor: "var(--rk-border)" }}>
                  {customer.requestedTickets.map((ticket) => (
                    <Link
                      key={ticket.id}
                      href={`/tickets/${ticket.id}`}
                      className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--rk-surface2)] transition-colors block"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-mono" style={{ color: "var(--rk-text3)" }}>
                            #{ticket.ticketNumber}
                          </span>
                          <Badge
                            variant="secondary"
                            className={`text-[10px] h-4 px-1.5 capitalize ${statusColors[ticket.status] ?? ""}`}
                          >
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-sm font-medium truncate" style={{ color: "var(--rk-text)" }}>
                          {ticket.subject}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--rk-text3)" }}>
                          {ticket._count.comments} message{ticket._count.comments !== 1 ? "s" : ""} ·{" "}
                          {formatDistanceToNow(ticket.createdAt, { addSuffix: true })}
                          {ticket.assignee && ` · ${ticket.assignee.name}`}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
