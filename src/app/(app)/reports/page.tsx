import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Users, Clock, BarChart3 } from "lucide-react"
import {
  getTicketVolumeByDay,
  getResolutionTimeDistribution,
  getAgentLeaderboard,
  getTicketStatsSummary,
} from "@/lib/queries/reports"
import { getDashboardStats } from "@/lib/queries/tickets"

export default async function ReportsPage() {
  const [volume, resolution, leaderboard, summary, stats] = await Promise.all([
    getTicketVolumeByDay(7),
    getResolutionTimeDistribution(),
    getAgentLeaderboard(),
    getTicketStatsSummary(),
    getDashboardStats(),
  ])

  const maxVol = Math.max(...volume.map((d) => d.count), 1)

  return (
    <>
      <PageHeader title="Reports" description="Analytics and performance metrics" />
      <main className="flex-1 overflow-auto p-6 space-y-6">

        {/* Summary cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Tickets this week",
              value: summary.thisWeek,
              sub: summary.volumeDelta !== null
                ? `${summary.volumeDelta >= 0 ? "+" : ""}${summary.volumeDelta}% vs last week`
                : "No prior data",
              icon: TrendingUp,
            },
            {
              label: "Open tickets",
              value: summary.totalOpen,
              sub: "new, open & pending",
              icon: BarChart3,
            },
            {
              label: "SLA breaches",
              value: summary.breached,
              sub: "active tickets past deadline",
              icon: Clock,
            },
            {
              label: "Agents",
              value: leaderboard.length,
              sub: "on the team",
              icon: Users,
            },
          ].map((card) => (
            <Card key={card.label} className="shadow-none">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs" style={{ color: "var(--rk-text3)" }}>{card.label}</p>
                  <card.icon className="size-4" style={{ color: "var(--rk-accent)" }} />
                </div>
                <p className="text-2xl font-bold" style={{ color: "var(--rk-text)" }}>{card.value}</p>
                <p className="text-xs mt-0.5" style={{ color: "var(--rk-text3)" }}>{card.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agents">Agent Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 grid gap-4 md:grid-cols-2">
            {/* Ticket volume chart */}
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="size-4" style={{ color: "var(--rk-accent)" }} />
                  Ticket Volume — Last 7 Days
                </CardTitle>
              </CardHeader>
              <CardContent>
                {volume.every((d) => d.count === 0) ? (
                  <p className="text-xs text-center py-8" style={{ color: "var(--rk-text3)" }}>
                    No tickets in the last 7 days
                  </p>
                ) : (
                  <div className="flex items-end gap-1 h-28">
                    {volume.map((d) => (
                      <div key={d.label} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-[10px] tabular-nums" style={{ color: "var(--rk-text3)" }}>
                          {d.count > 0 ? d.count : ""}
                        </span>
                        <div
                          className="w-full rounded-sm transition-all"
                          style={{
                            height: `${Math.max((d.count / maxVol) * 80, d.count > 0 ? 4 : 0)}px`,
                            background: "var(--rk-accent)",
                            opacity: d.count > 0 ? 0.8 : 0.15,
                          }}
                        />
                        <span className="text-[10px]" style={{ color: "var(--rk-text3)" }}>
                          {d.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resolution time */}
            <Card className="shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="size-4" style={{ color: "var(--rk-accent)" }} />
                  Resolution Time Distribution
                </CardTitle>
              </CardHeader>
              <CardContent>
                {resolution.every((r) => r.count === 0) ? (
                  <p className="text-xs text-center py-8" style={{ color: "var(--rk-text3)" }}>
                    No resolved tickets yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {resolution.map((row) => (
                      <div key={row.label} className="flex items-center gap-3 text-xs">
                        <span className="w-24" style={{ color: "var(--rk-text3)" }}>{row.label}</span>
                        <div
                          className="flex-1 h-2 rounded-full overflow-hidden"
                          style={{ background: "var(--rk-surface2)" }}
                        >
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${row.pct}%`, background: "var(--rk-accent)" }}
                          />
                        </div>
                        <span className="tabular-nums w-8 text-right" style={{ color: "var(--rk-text2)" }}>
                          {row.count}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Ticket breakdown */}
            <Card className="shadow-none md:col-span-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <BarChart3 className="size-4" style={{ color: "var(--rk-accent)" }} />
                  Current Queue Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  {[
                    { label: "Open", value: stats.openCount, color: "var(--rk-green)" },
                    { label: "Pending", value: stats.pendingCount, color: "#f0b429" },
                    { label: "Solved today", value: stats.solvedToday, color: "var(--rk-accent)" },
                    { label: "SLA breached", value: stats.slaBreaches, color: "#ff4757" },
                  ].map((item) => (
                    <div key={item.label} className="text-center">
                      <p className="text-3xl font-bold" style={{ color: item.color }}>
                        {item.value}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--rk-text3)" }}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="mt-4">
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="size-4" style={{ color: "var(--rk-accent)" }} />
                  Agent Leaderboard — Tickets Resolved
                </CardTitle>
              </CardHeader>
              <CardContent>
                {leaderboard.length === 0 ? (
                  <p className="text-xs text-center py-8" style={{ color: "var(--rk-text3)" }}>
                    No resolved tickets yet
                  </p>
                ) : (
                  <div className="divide-y" style={{ borderColor: "var(--rk-border)" }}>
                    {leaderboard.map((agent, i) => (
                      <div key={agent.id} className="flex items-center gap-4 py-3">
                        <span
                          className="text-lg font-bold w-6 text-center"
                          style={{ color: i === 0 ? "var(--rk-accent)" : "var(--rk-text3)" }}
                        >
                          {i + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium" style={{ color: "var(--rk-text)" }}>
                            {agent.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold" style={{ color: "var(--rk-text)" }}>
                            {agent.solved}
                          </p>
                          <p className="text-xs" style={{ color: "var(--rk-text3)" }}>resolved</p>
                        </div>
                        <div
                          className="h-2 rounded-full"
                          style={{
                            width: `${Math.max((agent.solved / (leaderboard[0]?.solved || 1)) * 120, 4)}px`,
                            background: "var(--rk-accent)",
                            opacity: 0.6,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  )
}
