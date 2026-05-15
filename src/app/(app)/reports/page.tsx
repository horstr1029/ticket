import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCards } from "@/components/stats-cards";
import { TrendingUp, Users, Clock, Star } from "lucide-react";

export default function ReportsPage() {
  return (
    <>
      <PageHeader title="Reports" description="Analytics and performance metrics" />
      <main className="flex-1 overflow-auto p-6 space-y-6">
        <StatsCards />

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="agents">Agent Performance</TabsTrigger>
            <TabsTrigger value="csat">CSAT</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TrendingUp className="size-4 text-primary" />
                  Ticket Volume (Last 7 Days)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-end gap-1 h-24">
                  {[32, 28, 41, 35, 52, 44, 38].map((v, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-sm bg-primary/80"
                        style={{ height: `${(v / 52) * 80}px` }}
                      />
                      <span className="text-[10px] text-muted-foreground">
                        {["M", "T", "W", "T", "F", "S", "S"][i]}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Clock className="size-4 text-primary" />
                  Avg Resolution Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: "< 1 hour", count: 18, pct: 44 },
                    { label: "1–4 hours", count: 12, pct: 29 },
                    { label: "4–24 hours", count: 8, pct: 20 },
                    { label: "> 24 hours", count: 3, pct: 7 },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-3 text-xs">
                      <span className="w-24 text-muted-foreground">{row.label}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${row.pct}%` }} />
                      </div>
                      <span className="text-muted-foreground tabular-nums">{row.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agents" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Users className="size-4 text-primary" />
                  Agent Leaderboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="divide-y">
                  {[
                    { name: "Mike Chen", solved: 41, avg: "2h 14m", csat: 98 },
                    { name: "Lisa Park", solved: 38, avg: "1h 52m", csat: 97 },
                    { name: "James Reed", solved: 29, avg: "3h 10m", csat: 94 },
                    { name: "Ana Torres", solved: 24, avg: "2h 45m", csat: 96 },
                  ].map((agent, i) => (
                    <div key={agent.name} className="flex items-center gap-4 py-3">
                      <span className="text-lg font-bold text-muted-foreground w-6">{i + 1}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{agent.name}</p>
                        <p className="text-xs text-muted-foreground">Avg {agent.avg} resolution</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold">{agent.solved}</p>
                        <p className="text-xs text-muted-foreground">solved</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-600">{agent.csat}%</p>
                        <p className="text-xs text-muted-foreground">CSAT</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="csat" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Star className="size-4 text-primary" />
                  Customer Satisfaction
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-6">
                  <p className="text-5xl font-bold text-primary">96%</p>
                  <p className="text-sm text-muted-foreground mt-1">Overall CSAT this month</p>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Excellent (5★)", pct: 72 },
                    { label: "Good (4★)", pct: 18 },
                    { label: "Neutral (3★)", pct: 6 },
                    { label: "Poor (1–2★)", pct: 4 },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center gap-3 text-xs">
                      <span className="w-28 text-muted-foreground">{row.label}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${row.pct}%` }} />
                      </div>
                      <span className="text-muted-foreground w-8 text-right">{row.pct}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
