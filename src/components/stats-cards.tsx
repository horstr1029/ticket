import { Ticket, Clock, CheckCircle, AlertTriangle } from "lucide-react"

interface StatsCardsProps {
  openTickets?: number
  pendingTickets?: number
  solvedToday?: number
  slaBreaches?: number
}

export function StatsCards({
  openTickets = 0,
  pendingTickets = 0,
  solvedToday = 0,
  slaBreaches = 0,
}: StatsCardsProps) {
  const stats = [
    {
      title: "Open Tickets",
      value: openTickets,
      icon: Ticket,
      accent: "#00c2ff",
      accentBg: "rgba(0,194,255,0.1)",
    },
    {
      title: "Pending Reply",
      value: pendingTickets,
      icon: Clock,
      accent: "#f0b429",
      accentBg: "rgba(240,180,41,0.1)",
    },
    {
      title: "Solved Today",
      value: solvedToday,
      icon: CheckCircle,
      accent: "#10d98a",
      accentBg: "rgba(16,217,138,0.1)",
    },
    {
      title: "SLA Breaches",
      value: slaBreaches,
      icon: AlertTriangle,
      accent: "#ff4757",
      accentBg: "rgba(255,71,87,0.1)",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl p-4 border"
          style={{ background: "var(--rk-surface)", borderColor: "var(--rk-border)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium" style={{ color: "var(--rk-text2)" }}>
              {stat.title}
            </p>
            <div
              className="size-8 rounded-lg flex items-center justify-center"
              style={{ background: stat.accentBg }}
            >
              <stat.icon className="size-4" style={{ color: stat.accent }} />
            </div>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--rk-text)" }}>
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  )
}
