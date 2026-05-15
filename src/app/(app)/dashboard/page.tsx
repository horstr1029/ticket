import { PageHeader } from "@/components/page-header";
import { StatsCards } from "@/components/stats-cards";
import { TicketTable } from "@/components/ticket-table";
import { buttonVariants } from "@/components/ui/button";
import { Plus, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Ticket } from "@/types";

const mockTickets: Ticket[] = [
  {
    id: "1",
    ticketNumber: 1042,
    subject: "Cannot log in to my account after password reset",
    status: "open",
    priority: "high",
    channel: "email",
    tags: ["auth", "urgent"],
    assigneeId: "agent1",
    requesterId: "user1",
    groupId: null,
    slaDeadline: new Date(Date.now() + 3600000),
    solvedAt: null,
    createdAt: new Date(Date.now() - 3600000 * 2),
    updatedAt: new Date(),
    requester: { id: "user1", name: "Sarah Johnson", email: "sarah@example.com", role: "customer", avatarUrl: null, timezone: "UTC", isOnline: false, createdAt: new Date() },
    assignee: { id: "agent1", name: "Mike Chen", email: "mike@company.com", role: "agent", avatarUrl: null, timezone: "UTC", isOnline: true, createdAt: new Date() },
  },
  {
    id: "2",
    ticketNumber: 1041,
    subject: "Billing invoice shows incorrect amount for March",
    status: "pending",
    priority: "normal",
    channel: "web",
    tags: ["billing"],
    assigneeId: null,
    requesterId: "user2",
    groupId: null,
    slaDeadline: new Date(Date.now() + 7200000),
    solvedAt: null,
    createdAt: new Date(Date.now() - 3600000 * 5),
    updatedAt: new Date(),
    requester: { id: "user2", name: "Tom Williams", email: "tom@example.com", role: "customer", avatarUrl: null, timezone: "UTC", isOnline: false, createdAt: new Date() },
    assignee: undefined,
  },
  {
    id: "3",
    ticketNumber: 1040,
    subject: "Feature request: Export data as CSV",
    status: "new",
    priority: "low",
    channel: "web",
    tags: ["feature-request"],
    assigneeId: null,
    requesterId: "user3",
    groupId: null,
    slaDeadline: null,
    solvedAt: null,
    createdAt: new Date(Date.now() - 3600000 * 8),
    updatedAt: new Date(),
    requester: { id: "user3", name: "Priya Patel", email: "priya@example.com", role: "customer", avatarUrl: null, timezone: "UTC", isOnline: false, createdAt: new Date() },
    assignee: undefined,
  },
  {
    id: "4",
    ticketNumber: 1039,
    subject: "API integration returning 401 on all endpoints",
    status: "open",
    priority: "urgent",
    channel: "api",
    tags: ["api", "integration"],
    assigneeId: "agent2",
    requesterId: "user4",
    groupId: null,
    slaDeadline: new Date(Date.now() + 1800000),
    solvedAt: null,
    createdAt: new Date(Date.now() - 3600000),
    updatedAt: new Date(),
    requester: { id: "user4", name: "DataCorp Inc.", email: "dev@datacorp.io", role: "customer", avatarUrl: null, timezone: "UTC", isOnline: true, createdAt: new Date() },
    assignee: { id: "agent2", name: "Lisa Park", email: "lisa@company.com", role: "agent", avatarUrl: null, timezone: "UTC", isOnline: true, createdAt: new Date() },
  },
];

export default function DashboardPage() {
  return (
    <>
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
      <main className="flex-1 overflow-auto p-6 space-y-6" style={{ background: "var(--rk-bg)" }}>
        <StatsCards />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold" style={{ color: "var(--rk-text)" }}>Recent Tickets</h2>
              <Link href="/tickets" className={buttonVariants({ variant: "ghost", size: "sm" }) + " text-xs"} style={{ color: "var(--rk-text2)" }}>
                View all <ArrowRight className="size-3 ml-1" />
              </Link>
            </div>
            <TicketTable tickets={mockTickets.slice(0, 4)} />
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold" style={{ color: "var(--rk-text)" }}>Activity</h2>
            <div className="rounded-xl border p-4" style={{ background: "var(--rk-surface)", borderColor: "var(--rk-border)" }}>
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--rk-text2)" }}>Team Performance</p>
              <div className="space-y-3">
                {[
                  { name: "Mike Chen", solved: 18, avatar: "MC" },
                  { name: "Lisa Park", solved: 14, avatar: "LP" },
                  { name: "James Reed", solved: 11, avatar: "JR" },
                  { name: "Ana Torres", solved: 9, avatar: "AT" },
                ].map((agent) => (
                  <div key={agent.name} className="flex items-center gap-3">
                    <div className="size-7 rounded-full flex items-center justify-center text-[10px] font-bold"
                      style={{ background: "rgba(0,194,255,0.12)", color: "var(--rk-accent)" }}>
                      {agent.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: "var(--rk-text)" }}>{agent.name}</p>
                      <div className="mt-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--rk-border)" }}>
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${(agent.solved / 20) * 100}%`, background: "var(--rk-accent)" }}
                        />
                      </div>
                    </div>
                    <span className="text-xs tabular-nums font-medium" style={{ color: "var(--rk-text2)" }}>
                      {agent.solved}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border p-4" style={{ background: "var(--rk-surface)", borderColor: "var(--rk-border)" }}>
              <p className="text-xs font-semibold mb-3" style={{ color: "var(--rk-text2)" }}>By Channel</p>
              <div className="space-y-2">
                {[
                  { channel: "Email", count: 52, pct: 62 },
                  { channel: "Web Widget", count: 21, pct: 25 },
                  { channel: "Phone", count: 8, pct: 9 },
                  { channel: "API", count: 3, pct: 4 },
                ].map((row) => (
                  <div key={row.channel} className="flex items-center gap-3 text-xs">
                    <span className="w-20" style={{ color: "var(--rk-text2)" }}>{row.channel}</span>
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--rk-border)" }}>
                      <div
                        className="h-full rounded-full"
                        style={{ width: `${row.pct}%`, background: "var(--rk-accent)" }}
                      />
                    </div>
                    <span className="text-muted-foreground tabular-nums w-6 text-right">
                      {row.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
