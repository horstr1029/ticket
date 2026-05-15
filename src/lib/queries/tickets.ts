import { db } from "@/lib/db"
import type { TicketStatus, TicketPriority } from "@/types"

const userSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  timezone: true,
  isOnline: true,
  createdAt: true,
} as const

export async function getTickets({
  search,
  status,
  priority,
}: {
  search?: string
  status?: string
  priority?: string
} = {}) {
  const ticketNumber = search ? parseInt(search) : NaN

  return db.ticket.findMany({
    where: {
      ...(status && status !== "all" ? { status: status as TicketStatus } : {}),
      ...(priority && priority !== "all"
        ? { priority: priority as TicketPriority }
        : {}),
      ...(search
        ? {
            OR: [
              { subject: { contains: search, mode: "insensitive" } },
              ...(!isNaN(ticketNumber) ? [{ ticketNumber: { equals: ticketNumber } }] : []),
            ],
          }
        : {}),
    },
    include: {
      requester: { select: userSelect },
      assignee: { select: userSelect },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })
}

export async function getTicketById(id: string) {
  return db.ticket.findUnique({
    where: { id },
    include: {
      requester: { select: userSelect },
      assignee: { select: userSelect },
      comments: {
        include: { author: { select: userSelect } },
        orderBy: { createdAt: "asc" },
      },
    },
  })
}

export async function getDashboardStats() {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const [openCount, pendingCount, solvedToday, slaBreaches] = await Promise.all([
    db.ticket.count({ where: { status: { in: ["new", "open"] } } }),
    db.ticket.count({ where: { status: "pending" } }),
    db.ticket.count({
      where: { status: "solved", solvedAt: { gte: todayStart } },
    }),
    db.ticket.count({
      where: {
        slaDeadline: { lt: now },
        status: { notIn: ["solved", "closed"] },
      },
    }),
  ])

  return { openCount, pendingCount, solvedToday, slaBreaches }
}

export async function getRecentTickets(limit = 5) {
  return db.ticket.findMany({
    include: {
      requester: { select: userSelect },
      assignee: { select: userSelect },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
}

export async function getAgentPerformance() {
  const agents = await db.user.findMany({
    where: { role: "agent" },
    select: {
      id: true,
      name: true,
      _count: {
        select: {
          assignedTickets: { where: { status: "solved" } },
        },
      },
    },
  })

  return agents
    .map((a) => ({ id: a.id, name: a.name, solved: a._count.assignedTickets }))
    .sort((a, b) => b.solved - a.solved)
    .slice(0, 5)
}

export async function getTicketsByChannel() {
  const channels = await db.ticket.groupBy({
    by: ["channel"],
    _count: { channel: true },
  })

  const total = channels.reduce((sum, c) => sum + c._count.channel, 0)

  return channels.map((c) => ({
    channel: c.channel,
    count: c._count.channel,
    pct: total > 0 ? Math.round((c._count.channel / total) * 100) : 0,
  }))
}

export async function getAgents() {
  return db.user.findMany({
    where: { role: { in: ["agent", "admin"] } },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  })
}
