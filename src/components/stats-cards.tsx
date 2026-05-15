import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Clock, CheckCircle, AlertTriangle, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCard {
  title: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down" | "neutral";
  icon: React.ElementType;
  iconColor: string;
}

const stats: StatCard[] = [
  {
    title: "Open Tickets",
    value: 84,
    change: "+12 today",
    trend: "up",
    icon: Ticket,
    iconColor: "text-blue-600",
  },
  {
    title: "Pending Reply",
    value: 23,
    change: "-3 from yesterday",
    trend: "down",
    icon: Clock,
    iconColor: "text-amber-600",
  },
  {
    title: "Solved Today",
    value: 41,
    change: "+8 vs avg",
    trend: "up",
    icon: CheckCircle,
    iconColor: "text-emerald-600",
  },
  {
    title: "SLA Breaches",
    value: 3,
    change: "Needs attention",
    trend: "down",
    icon: AlertTriangle,
    iconColor: "text-red-600",
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <div className={cn("rounded-md bg-muted/60 p-1.5", stat.iconColor)}>
              <stat.icon className="size-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.change && (
              <p
                className={cn(
                  "text-xs mt-1 flex items-center gap-1",
                  stat.trend === "up" && stat.title !== "SLA Breaches"
                    ? "text-emerald-600"
                    : stat.trend === "down" && stat.title === "Pending Reply"
                    ? "text-emerald-600"
                    : "text-red-600"
                )}
              >
                {stat.trend === "up" ? (
                  <TrendingUp className="size-3" />
                ) : (
                  <TrendingDown className="size-3" />
                )}
                {stat.change}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
