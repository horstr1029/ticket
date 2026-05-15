import { Resend } from "resend"

let resendInstance: Resend | null = null

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null
  if (!resendInstance) resendInstance = new Resend(process.env.RESEND_API_KEY)
  return resendInstance
}

const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "HelpDesk <support@helpdesk.io>"

export async function sendReplyEmail({
  to,
  toName,
  subject,
  ticketNumber,
  ticketId,
  agentName,
  body,
}: {
  to: string
  toName: string
  subject: string
  ticketNumber: number
  ticketId: string
  agentName: string
  body: string
}) {
  const resend = getResend()
  if (!resend) return

  const ticketSubject = `Re: [Ticket #${ticketNumber}] ${subject}`

  await resend.emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: ticketSubject,
    replyTo: `support+${ticketId}@${process.env.RESEND_REPLY_DOMAIN ?? "helpdesk.io"}`,
    text: [
      `Hi ${toName},`,
      "",
      body,
      "",
      `— ${agentName}`,
      "",
      `────────────────────`,
      `Ticket #${ticketNumber}: ${subject}`,
      `View ticket: ${process.env.NEXTAUTH_URL ?? "http://localhost:3005"}/tickets/${ticketId}`,
    ].join("\n"),
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a2332">
        <p>Hi ${toName},</p>
        <div style="white-space:pre-wrap;line-height:1.6">${body.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
        <p style="color:#5a7a9a">— ${agentName}</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0" />
        <p style="font-size:12px;color:#8899b4">
          Ticket #${ticketNumber}: ${subject}<br/>
          <a href="${process.env.NEXTAUTH_URL ?? "http://localhost:3005"}/tickets/${ticketId}" style="color:#00c2ff">View ticket</a>
        </p>
      </div>
    `,
  })
}

export async function sendTicketConfirmationEmail({
  to,
  toName,
  subject,
  ticketNumber,
  ticketId,
}: {
  to: string
  toName: string
  subject: string
  ticketNumber: number
  ticketId: string
}) {
  const resend = getResend()
  if (!resend) return

  await resend.emails.send({
    from: FROM_EMAIL,
    to: [to],
    subject: `[Ticket #${ticketNumber}] ${subject}`,
    text: [
      `Hi ${toName},`,
      "",
      "We've received your support request and will get back to you as soon as possible.",
      "",
      `Ticket #${ticketNumber}: ${subject}`,
      `View your ticket: ${process.env.NEXTAUTH_URL ?? "http://localhost:3005"}/tickets/${ticketId}`,
    ].join("\n"),
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a2332">
        <p>Hi ${toName},</p>
        <p>We've received your support request and will get back to you as soon as possible.</p>
        <div style="background:#f8fafc;border-left:3px solid #00c2ff;padding:16px;margin:24px 0;border-radius:4px">
          <p style="margin:0;font-weight:600">Ticket #${ticketNumber}</p>
          <p style="margin:4px 0 0;color:#5a7a9a">${subject}</p>
        </div>
        <p>
          <a href="${process.env.NEXTAUTH_URL ?? "http://localhost:3005"}/tickets/${ticketId}" style="background:#00c2ff;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;display:inline-block">
            View Ticket
          </a>
        </p>
      </div>
    `,
  })
}
