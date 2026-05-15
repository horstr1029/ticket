import { Ticket, Clock, CheckCircle, AlertTriangle } from "lucide-react";

interface StatCard {
  title: string;
  value: string | number;
  change: string;
  positive: boolean;
  icon: React.ElementType;
  accent: string;
  accentBg: string;
}

const stats: StatCard[] = [
  {
    title: "Open Tickets",
    value: 84,
    change: "+12 today",
    positive: false,
    icon: Ticket,
    accent: "#00c2ff",
    accentBg: "rgba(0,194,255,0.1)",
  },
  {
    title: "Pending Reply",
    value: 23,
    change: "−3 from yesterday",
    positive: true,
    icon: Clock,
    accent: "#f0b429",
    accentBg: "rgba(240,180,41,0.1)",
  },
  {
    title: "Solved Today",
    value: 41,
    change: "+8 vs avg",
    positive: true,
    icon: CheckCircle,
    accent: "#10d98a",
    accentBg: "rgba(16,217,138,0.1)",
  },
  {
    title: "SLA Breaches",
    value: 3,
    change: "Needs attention",
    positive: false,
    icon: AlertTriangle,
    accent: "#ff4757",
    accentBg: "rgba(255,71,87,0.1)",
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className="rounded-xl p-4 border"
          style={{ background: "var(--rk-surface)", borderColor: "var(--rk-border)" }}
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-medium" style={{ color: "var(--rk-text2)" }}>{stat.title}</p>
            <div className="size-8 rounded-lg flex items-center justify-center"
              style={{ background: stat.accentBg }}>
              <stat.icon className="size-4" style={{ color: stat.accent }} />
            </div>
          </div>
          <p className="text-2xl font-bold" style={{ color: "var(--rk-text)" }}>{stat.value}</p>
          <p className="text-xs mt-1" style={{ color: stat.positive ? "var(--rk-green)" : "var(--rk-text3)" }}>
            {stat.change}
          </p>
        </div>
      ))}
    </div>
  );
}
