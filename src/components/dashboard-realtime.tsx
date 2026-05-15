"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getPusherClient } from "@/lib/pusher-client"

export function DashboardRealtime() {
  const router = useRouter()

  useEffect(() => {
    const pusher = getPusherClient()
    if (!pusher) return

    const channel = pusher.subscribe("dashboard")

    const refresh = () => router.refresh()

    channel.bind("ticket:created", refresh)
    channel.bind("stats:updated", refresh)

    return () => {
      channel.unbind_all()
      pusher.unsubscribe("dashboard")
    }
  }, [router])

  return null
}
