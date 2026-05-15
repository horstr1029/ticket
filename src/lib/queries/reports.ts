import { db } from "@/lib/db"
import { subDays, startOfDay, format } from "date-fns"

export async function getTicketVolumeByDay(days = 7) {
  const since = startOfDay(subDays(new Date(), days - 1))
  const tickets = await db.ticket.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  })

  const result: { label: string; count: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const day = subDays(new Date(), i)
    const dayStart = startOfDay(day)
    const dayEnd = new Date(dayStart.getTime() + 86400000)
    const count = tickets.filter(
      (t) => t.createdAt >= dayStart && t.createdAt < dayEnd
    ).length
    result.push({ label: format(day, "EEE"), count })
  }
  return result
}

export async function getResolutionTimeDistribution() {
  const tickets = await db.ticket.findMany({
    where: { status: { in: ["solved", "closed"] }, solvedAt: { not: null } },
    select: { createdAt: true, solvedAt: true },
  })

  const buckets = [
    { label: "< 1 hour",    maxHours: 1,        count: 0 },
    { label: "1–4 hours",   maxHours: 4,        count: 0 },
    { label: "4–24 hours",  maxHours: 24,       count: 0 },
    { label: "> 24 hours",  maxHours: Infinity,  count: 0 },
  ]

  for (const t of tickets) {
    if (!t.solvedAt) continue
    const hours = (t.solvedAt.getTime() - t.createdAt.getTime()) / 3_600_000
    for (const bucket of buckets) {
      if (hours <= bucket.maxHours) {
        bucket.count++
        break
      }
    }
  }

  const total = buckets.reduce((s, b) => s + b.count, 0)
  return buckets.map((b) => ({
    label: b.label,
    count: b.count,
    pct: total > 0 ? Math.round((b.count / total) * 100) : 0,
  }))
}

export async function getAgentLeaderboard() {
  const agents = await db.user.findMany({
    where: { role: { in: ["agent", "admin"] } },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          assignedTickets: { where: { status: { in: ["solved", "closed"] } } },
        },
      },
    },
  })
  return agents
    .map((a) => ({ id: a.id, name: a.name, solved: a._count.assignedTickets }))
    .sort((a, b) => b.solved - a.solved)
    .slice(0, 8)
}

export async function getTicketStatsSummary() {
  const now = new Date()
  const weekAgo = subDays(now, 7)
  const prevWeekStart = subDays(now, 14)

  const [thisWeek, prevWeek, totalOpen, breached] = await Promise.all([
    db.ticket.count({ where: { createdAt: { gte: weekAgo } } }),
    db.ticket.count({ where: { createdAt: { gte: prevWeekStart, lt: weekAgo } } }),
    db.ticket.count({ where: { status: { in: ["new", "open", "pending"] } } }),
    db.ticket.count({
      where: { slaDeadline: { lt: now }, status: { notIn: ["solved", "closed"] } },
    }),
  ])

  const volumeDelta =
    prevWeek > 0 ? Math.round(((thisWeek - prevWeek) / prevWeek) * 100) : null

  return { thisWeek, volumeDelta, totalOpen, breached }
}
