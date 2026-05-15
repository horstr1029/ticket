import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { triggerTicketEvent, triggerDashboardEvent } from "@/lib/pusher"
import { revalidatePath } from "next/cache"

// Verify webhook secret to prevent spoofing
function verifySecret(req: NextRequest): boolean {
  const secret = process.env.EMAIL_WEBHOOK_SECRET
  if (!secret) return true // skip verification if not configured
  const headerSecret = req.headers.get("x-webhook-secret")
  return headerSecret === secret
}

// Parse ticket number from subject like "Re: [Ticket #1042] ..."
function extractTicketNumber(subject: string): number | null {
  const match = subject.match(/\[Ticket #(\d+)\]/i)
  return match ? parseInt(match[1]) : null
}

// Normalize email body — strip quoted reply chains
function extractReplyBody(text: string): string {
  const lines = text.split("\n")
  const cutoff = lines.findIndex(
    (l) =>
      l.startsWith(">") ||
      l.match(/^On .+ wrote:/) ||
      l.startsWith("────")
  )
  return (cutoff > 0 ? lines.slice(0, cutoff) : lines)
    .join("\n")
    .trim()
}

export async function POST(req: NextRequest) {
  if (!verifySecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  // Support Mailgun, SendGrid, and generic formats
  const from =
    (body.sender as string) ||
    (body.from as string) ||
    (body.From as string) ||
    ""
  const subject =
    (body.subject as string) ||
    (body.Subject as string) ||
    "(No Subject)"
  const textBody =
    (body["body-plain"] as string) ||
    (body.text as string) ||
    (body.plain as string) ||
    ""
  const messageId =
    (body["Message-Id"] as string) ||
    (body.messageId as string) ||
    null

  if (!from) {
    return NextResponse.json({ error: "Missing sender" }, { status: 400 })
  }

  // Extract email address from "Name <email@domain.com>" format
  const emailMatch = from.match(/<(.+?)>/) ?? [null, from]
  const senderEmail = emailMatch[1]?.toLowerCase().trim() ?? from.toLowerCase().trim()
  const senderName = from.replace(/<.+?>/, "").trim().replace(/^"|"$/g, "") || senderEmail

  const cleanBody = extractReplyBody(textBody)
  if (!cleanBody) {
    return NextResponse.json({ ok: true, skipped: "empty body" })
  }

  // Try to find existing ticket by subject pattern
  const ticketNumber = extractTicketNumber(subject)

  if (ticketNumber) {
    // Reply to existing ticket
    const ticket = await db.ticket.findFirst({
      where: { ticketNumber },
    })

    if (ticket) {
      // Find or create the sender as a customer user
      let sender = await db.user.findUnique({ where: { email: senderEmail } })
      if (!sender) {
        sender = await db.user.create({
          data: {
            name: senderName,
            email: senderEmail,
            role: "customer",
          },
        })
      }

      await db.comment.create({
        data: {
          ticketId: ticket.id,
          authorId: sender.id,
          body: cleanBody,
          emailMessageId: messageId ?? undefined,
        },
      })

      await triggerTicketEvent(ticket.id, "ticket:comment-added", {
        body: cleanBody,
        author: { name: senderName, role: "customer" },
      })

      revalidatePath(`/tickets/${ticket.id}`)
      return NextResponse.json({ ok: true, action: "comment-added" })
    }
  }

  // No matching ticket — create a new one
  let requester = await db.user.findUnique({ where: { email: senderEmail } })
  if (!requester) {
    requester = await db.user.create({
      data: { name: senderName, email: senderEmail, role: "customer" },
    })
  }

  const newTicket = await db.ticket.create({
    data: {
      subject: subject.replace(/^(Re:|Fwd?:)\s*/i, "").trim() || "(No Subject)",
      channel: "email",
      requesterId: requester.id,
      comments: {
        create: {
          body: cleanBody,
          authorId: requester.id,
          emailMessageId: messageId ?? undefined,
        },
      },
    },
  })

  await triggerDashboardEvent("ticket:created", { ticketId: newTicket.id })
  revalidatePath("/tickets")
  revalidatePath("/dashboard")

  return NextResponse.json({ ok: true, action: "ticket-created", ticketId: newTicket.id })
}
