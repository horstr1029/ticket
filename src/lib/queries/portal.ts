import { db } from "@/lib/db"

export async function getMyTickets(userId: string) {
  return db.ticket.findMany({
    where: { requesterId: userId },
    include: {
      assignee: { select: { id: true, name: true } },
      _count: { select: { comments: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  })
}

export async function getMyTicketById(id: string, userId: string) {
  return db.ticket.findFirst({
    where: { id, requesterId: userId },
    include: {
      assignee: { select: { id: true, name: true } },
      comments: {
        where: { isInternal: false },
        include: {
          author: { select: { id: true, name: true, role: true } },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  })
}
