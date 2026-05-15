import { DashboardRealtime } from "@/components/dashboard-realtime"
import { PageHeader } from "@/components/page-header"
import { StatsCards } from "@/components/stats-cards"
import { TicketTable } from "@/components/ticket-table"
import { buttonVariants } from "@/components/ui/button"
import { Plus, ArrowRight } from "lucide-react"
import Link from "next/link"
import {
  getDashboardStats,
  getRecentTickets,
  getAgentPerformance,
  getTicketsByChannel,
} from "@/lib/queries/tickets"

export default async function DashboardPage() {
  const [stats, recentTickets, agentStats, channelStats] = await Promise.all([
    getDashboardStats(),
    getRecentTickets(5),
    getAgentPerformance(),
    getTicketsByChannel(),
  ])

  const channelLabels: Record<string, string> = {
    email: "Email",
    web: "Web Widget",
    phone: "Phone",
    api: "API",
  }

  const maxSolved = agentStats[0]?.solved ?? 1

  return (
    <>
      <DashboardRealtime />
      <PageHeader
        title="Dashboard"
        description="Overview of your support queue"
        actions={
          <Link href="/tickets/new" className={buttonVariants({ size: "sm" })}>
            <Plus className="size-3.5 mr-1" />
            New Ticket
          </Link>
        }
      />
      <main
        className="flex-1 overflow-auto p-6 space-y-6"
        style={{ background: "var(--rk-bg)" }}
      >
        <StatsCards
          openTickets={stats.openCount}
          pendingTickets={stats.pendingCount}
          solvedToday={stats.solvedToday}
          slaBreaches={stats.slaBreaches}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold" style={{ color: "var(--rk-text)" }}>
                Recent Tickets
              </h2>
              <Link
                href="/tickets"
                className={
                  buttonVariants({ variant: "ghost", size: "sm" }) + " text-xs"
                }
                style={{ color: "var(--rk-text2)" }}
              >
                View all <ArrowRight className="size-3 ml-1" />
              </Link>
            </div>
            <TicketTable tickets={recentTickets as Parameters<typeof TicketTable>[0]["tickets"]} />
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold" style={{ color: "var(--rk-text)" }}>
              Activity
            </h2>

            <div
              className="rounded-xl border p-4"
              style={{ background: "var(--rk-surface)", borderColor: "var(--rk-border)" }}
            >
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--rk-text2)" }}>
                Team Performance
              </p>
              {agentStats.length === 0 ? (
                <p className="text-xs" style={{ color: "var(--rk-text3)" }}>
                  No agent data yet
                </p>
              ) : (
                <div className="space-y-3">
                  {agentStats.map((agent) => (
                    <div key={agent.id} className="flex items-center gap-3">
                      <div
                        className="size-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{
                          background: "rgba(0,194,255,0.12)",
                          color: "var(--rk-accent)",
                        }}
                      >
                        {agent.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                          .slice(0, 2)
                          .toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-xs font-medium truncate"
                          style={{ color: "var(--rk-text)" }}
                        >
                          {agent.name}
                        </p>
                        <div
                          className="mt-1 h-1 rounded-full overflow-hidden"
                          style={{ background: "var(--rk-border)" }}
                        >
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${maxSolved > 0 ? (agent.solved / maxSolved) * 100 : 0}%`,
                              background: "var(--rk-accent)",
                            }}
                          />
                        </div>
                      </div>
                      <span
                        className="text-xs tabular-nums font-medium"
                        style={{ color: "var(--rk-text2)" }}
                      >
                        {agent.solved}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className="rounded-xl border p-4"
              style={{ background: "var(--rk-surface)", borderColor: "var(--rk-border)" }}
            >
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--rk-text2)" }}>
                By Channel
              </p>
              {channelStats.length === 0 ? (
                <p className="text-xs" style={{ color: "var(--rk-text3)" }}>
                  No ticket data yet
                </p>
              ) : (
                <div className="space-y-2">
                  {channelStats.map((row) => (
                    <div key={row.channel} className="flex items-center gap-3 text-xs">
                      <span className="w-20" style={{ color: "var(--rk-text2)" }}>
                        {channelLabels[row.channel] ?? row.channel}
                      </span>
                      <div
                        className="flex-1 h-1 rounded-full overflow-hidden"
                        style={{ background: "var(--rk-border)" }}
                      >
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${row.pct}%`,
                            background: "var(--rk-accent)",
                          }}
                        />
                      </div>
                      <span
                        className="tabular-nums w-6 text-right"
                        style={{ color: "var(--rk-text3)" }}
                      >
                        {row.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
