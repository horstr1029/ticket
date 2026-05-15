import { db } from "@/lib/db"

export async function getCustomers(search?: string) {
  return db.user.findMany({
    where: {
      role: "customer",
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: { select: { requestedTickets: true } },
      requestedTickets: {
        where: { status: { in: ["new", "open", "pending"] } },
        select: { id: true },
      },
    },
    orderBy: { name: "asc" },
  })
}

export async function getCustomerById(id: string) {
  return db.user.findFirst({
    where: { id, role: "customer" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      requestedTickets: {
        include: {
          assignee: { select: { id: true, name: true } },
          _count: { select: { comments: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      },
    },
  })
}
