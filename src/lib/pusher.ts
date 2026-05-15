import Pusher from "pusher"

let pusherInstance: Pusher | null = null

export function getPusher(): Pusher | null {
  if (
    !process.env.PUSHER_APP_ID ||
    !process.env.PUSHER_KEY ||
    !process.env.PUSHER_SECRET ||
    !process.env.PUSHER_CLUSTER
  ) {
    return null
  }

  if (!pusherInstance) {
    pusherInstance = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_KEY,
      secret: process.env.PUSHER_SECRET,
      cluster: process.env.PUSHER_CLUSTER,
      useTLS: true,
    })
  }

  return pusherInstance
}

export async function triggerTicketEvent(
  ticketId: string,
  event: string,
  data: Record<string, unknown>
) {
  const pusher = getPusher()
  if (!pusher) return
  await pusher.trigger(`ticket-${ticketId}`, event, data)
}

export async function triggerDashboardEvent(
  event: string,
  data: Record<string, unknown>
) {
  const pusher = getPusher()
  if (!pusher) return
  await pusher.trigger("dashboard", event, data)
}
