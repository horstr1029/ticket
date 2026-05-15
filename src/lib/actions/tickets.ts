"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { triggerTicketEvent, triggerDashboardEvent } from "@/lib/pusher"
import { sendReplyEmail, sendTicketConfirmationEmail } from "@/lib/email"
import { runAutomations } from "@/lib/automation-engine"
import { calculateSlaDeadline } from "@/lib/sla"
import type { TicketStatus, TicketPriority, TicketChannel } from "@/types"

export type TicketFormState = { error?: string } | undefined

async function getDefaultSlaPolicy() {
  return db.slaPolicy.findFirst({ where: { isDefault: true } })
}

export async function createTicket(
  _state: TicketFormState,
  formData: FormData
): Promise<TicketFormState> {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  const subject = (formData.get("subject") as string)?.trim()
  const body = (formData.get("body") as string)?.trim()
  const priority = (formData.get("priority") as TicketPriority) ?? "normal"
  const channel = (formData.get("channel") as TicketChannel) ?? "web"

  if (!subject) return { error: "Subject is required" }

  const slaPolicy = await getDefaultSlaPolicy()
  const now = new Date()
  const slaDeadline = slaPolicy
    ? calculateSlaDeadline(now, slaPolicy.resolutionTime, slaPolicy.businessHoursOnly)
    : null

  const ticket = await db.ticket.create({
    data: {
      subject,
      priority,
      channel,
      requesterId: session.user.id,
      slaDeadline,
      slaPolicyId: slaPolicy?.id ?? null,
      comments: body
        ? { create: { body, authorId: session.user.id } }
        : undefined,
    },
    include: { requester: true },
  })

  await Promise.all([
    runAutomations("ticket.created", ticket),
    triggerDashboardEvent("ticket:created", { ticketId: ticket.id }),
    sendTicketConfirmationEmail({
      to: ticket.requester.email,
      toName: ticket.requester.name,
      subject: ticket.subject,
      ticketNumber: ticket.ticketNumber,
      ticketId: ticket.id,
    }),
  ])

  revalidatePath("/tickets")
  revalidatePath("/dashboard")
  redirect(`/tickets/${ticket.id}`)
}

export async function updateTicketStatus(
  ticketId: string,
  status: TicketStatus
) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const ticket = await db.ticket.update({
    where: { id: ticketId },
    data: {
      status,
      ...(status === "solved" ? { solvedAt: new Date() } : {}),
      ...(status !== "solved" ? { solvedAt: null } : {}),
    },
  })

  await Promise.all([
    runAutomations("ticket.status_changed", ticket),
    triggerTicketEvent(ticketId, "ticket:status-changed", { status }),
    triggerDashboardEvent("stats:updated", {}),
  ])

  revalidatePath(`/tickets/${ticketId}`)
  revalidatePath("/tickets")
  revalidatePath("/dashboard")
}

export async function updateTicketFields(
  ticketId: string,
  data: {
    status?: TicketStatus
    priority?: TicketPriority
    assigneeId?: string | null
  }
) {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")

  const ticket = await db.ticket.update({
    where: { id: ticketId },
    data: {
      ...data,
      ...(data.status === "solved" ? { solvedAt: new Date() } : {}),
      ...(data.status && data.status !== "solved" ? { solvedAt: null } : {}),
    },
  })

  const sideEffects: Promise<unknown>[] = [
    triggerTicketEvent(ticketId, "ticket:updated", data),
  ]

  if (data.status) {
    sideEffects.push(
      runAutomations("ticket.status_changed", ticket),
      triggerDashboardEvent("stats:updated", {})
    )
  }

  await Promise.all(sideEffects)

  revalidatePath(`/tickets/${ticketId}`)
  revalidatePath("/tickets")
  revalidatePath("/dashboard")
}

export async function bulkUpdateTickets(
  ids: string[],
  data: { status?: TicketStatus; priority?: TicketPriority; assigneeId?: string | null }
): Promise<{ error?: string }> {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }
  if (ids.length === 0) return { error: "No tickets selected" }

  await db.ticket.updateMany({
    where: { id: { in: ids } },
    data: {
      ...data,
      ...(data.status === "solved" ? { solvedAt: new Date() } : {}),
      ...(data.status && data.status !== "solved" ? { solvedAt: null } : {}),
    },
  })

  revalidatePath("/tickets")
  revalidatePath("/dashboard")
  return {}
}

export async function addComment(
  ticketId: string,
  body: string,
  isInternal: boolean,
  newStatus?: TicketStatus
): Promise<{ error?: string }> {
  const session = await auth()
  if (!session?.user) return { error: "Unauthorized" }

  if (!body.trim()) return { error: "Comment cannot be empty" }

  const [comment, ticket] = await db.$transaction(async (tx) => {
    const c = await tx.comment.create({
      data: {
        ticketId,
        authorId: session.user.id,
        body: body.trim(),
        isInternal,
      },
      include: { author: { select: { id: true, name: true, role: true } } },
    })

    const t = await tx.ticket.findUnique({
      where: { id: ticketId },
      include: { requester: { select: { id: true, name: true, email: true } } },
    })

    if (newStatus) {
      await tx.ticket.update({
        where: { id: ticketId },
        data: {
          status: newStatus,
          ...(newStatus === "solved" ? { solvedAt: new Date() } : {}),
          ...(newStatus !== "solved" ? { solvedAt: null } : {}),
        },
      })
    }

    return [c, t]
  })

  const sideEffects: Promise<unknown>[] = [
    triggerTicketEvent(ticketId, "ticket:comment-added", {
      id: comment.id,
      body: comment.body,
      isInternal: comment.isInternal,
      createdAt: comment.createdAt,
      author: comment.author,
    }),
  ]

  if (newStatus) {
    const updated = await db.ticket.findUnique({ where: { id: ticketId } })
    if (updated) sideEffects.push(runAutomations("ticket.status_changed", updated))
    sideEffects.push(
      triggerDashboardEvent("stats:updated", {}),
      triggerTicketEvent(ticketId, "ticket:status-changed", { status: newStatus })
    )
  }

  if (!isInternal && ticket?.requester) {
    const agent = await db.user.findUnique({
      where: { id: session.user.id },
      select: { name: true },
    })
    if (ticket) {
      sideEffects.push(
        sendReplyEmail({
          to: ticket.requester.email,
          toName: ticket.requester.name,
          subject: (ticket as { subject: string }).subject ?? "",
          ticketNumber: (ticket as { ticketNumber: number }).ticketNumber ?? 0,
          ticketId,
          agentName: agent?.name ?? "Support Team",
          body: body.trim(),
        })
      )
    }
  }

  await Promise.all(sideEffects)

  revalidatePath(`/tickets/${ticketId}`)
  revalidatePath("/tickets")
  revalidatePath("/dashboard")
  return {}
}
