"use server"

import { db } from "@/lib/db"
import { triggerDashboardEvent } from "@/lib/pusher"
import { sendTicketConfirmationEmail } from "@/lib/email"

export type WidgetState =
  | { success: true; ticketNumber: number }
  | { error: string }
  | undefined

export async function submitWidgetTicket(
  _state: WidgetState,
  formData: FormData
): Promise<WidgetState> {
  const name = (formData.get("name") as string)?.trim()
  const email = (formData.get("email") as string)?.trim().toLowerCase()
  const subject = (formData.get("subject") as string)?.trim()
  const body = (formData.get("body") as string)?.trim()

  if (!name || !email || !subject || !body) {
    return { error: "All fields are required" }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address" }
  }

  let requester = await db.user.findUnique({ where: { email } })
  if (!requester) {
    requester = await db.user.create({
      data: { name, email, role: "customer" },
    })
  }

  const ticket = await db.ticket.create({
    data: {
      subject,
      channel: "web",
      requesterId: requester.id,
      comments: { create: { body, authorId: requester.id } },
    },
  })

  await Promise.all([
    triggerDashboardEvent("ticket:created", { ticketId: ticket.id }),
    sendTicketConfirmationEmail({
      to: email,
      toName: name,
      subject,
      ticketNumber: ticket.ticketNumber,
      ticketId: ticket.id,
    }),
  ])

  return { success: true, ticketNumber: ticket.ticketNumber }
}
