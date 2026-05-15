"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { calculateSlaDeadline } from "@/lib/sla"
import { runAutomations } from "@/lib/automation-engine"
import { sendTicketConfirmationEmail } from "@/lib/email"
import type { TicketPriority } from "@/types"

async function requireCustomer() {
  const session = await auth()
  if (!session?.user) throw new Error("Unauthorized")
  return session.user
}

export type PortalFormState = { error?: string } | undefined

export async function submitPortalTicket(
  _state: PortalFormState,
  formData: FormData
): Promise<PortalFormState> {
  const user = await requireCustomer()

  const subject = (formData.get("subject") as string)?.trim()
  const body = (formData.get("body") as string)?.trim()

  if (!subject) return { error: "Subject is required" }
  if (!body) return { error: "Description is required" }

  const slaPolicy = await db.slaPolicy.findFirst({ where: { isDefault: true } })
  const now = new Date()
  const slaDeadline = slaPolicy
    ? calculateSlaDeadline(now, slaPolicy.resolutionTime, slaPolicy.businessHoursOnly)
    : null

  const ticket = await db.ticket.create({
    data: {
      subject,
      priority: "normal" as TicketPriority,
      channel: "web",
      requesterId: user.id,
      slaDeadline,
      slaPolicyId: slaPolicy?.id ?? null,
      comments: { create: { body, authorId: user.id } },
    },
    include: { requester: true },
  })

  await Promise.all([
    runAutomations("ticket.created", ticket),
    sendTicketConfirmationEmail({
      to: ticket.requester.email,
      toName: ticket.requester.name,
      subject: ticket.subject,
      ticketNumber: ticket.ticketNumber,
      ticketId: ticket.id,
    }),
  ])

  revalidatePath("/portal")
  redirect(`/portal/tickets/${ticket.id}`)
}

export async function addPortalReply(
  ticketId: string,
  body: string
): Promise<{ error?: string }> {
  const user = await requireCustomer()

  if (!body.trim()) return { error: "Reply cannot be empty" }

  const ticket = await db.ticket.findFirst({
    where: { id: ticketId, requesterId: user.id },
  })
  if (!ticket) return { error: "Ticket not found" }

  await db.comment.create({
    data: {
      ticketId,
      authorId: user.id,
      body: body.trim(),
      isInternal: false,
    },
  })

  revalidatePath(`/portal/tickets/${ticketId}`)
  return {}
}
