"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getPusherClient } from "@/lib/pusher-client"

interface TicketRealtimeProps {
  ticketId: string
}

export function TicketRealtime({ ticketId }: TicketRealtimeProps) {
  const router = useRouter()

  useEffect(() => {
    const pusher = getPusherClient()
    if (!pusher) return

    const channel = pusher.subscribe(`ticket-${ticketId}`)

    const refresh = () => router.refresh()

    channel.bind("ticket:comment-added", refresh)
    channel.bind("ticket:status-changed", refresh)
    channel.bind("ticket:updated", refresh)

    return () => {
      channel.unbind_all()
      pusher.unsubscribe(`ticket-${ticketId}`)
    }
  }, [ticketId, router])

  return null
}
