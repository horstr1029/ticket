import { notFound } from "next/navigation"
import { auth } from "@/lib/auth"
import { getTicketById, getAgents } from "@/lib/queries/tickets"
import { getActiveMacros } from "@/lib/queries/macros"
import { TicketDetailClient } from "./ticket-detail-client"
import { TicketRealtime } from "@/components/ticket-realtime"

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [ticket, agents, macros, session] = await Promise.all([
    getTicketById(id),
    getAgents(),
    getActiveMacros(),
    auth(),
  ])

  if (!ticket) notFound()

  return (
    <>
      <TicketRealtime ticketId={id} />
      <TicketDetailClient
        ticket={ticket}
        agents={agents}
        macros={macros}
        currentUserId={session?.user?.id ?? ""}
      />
    </>
  )
}
