import { auth } from "@/lib/auth"
import { getMyTicketById } from "@/lib/queries/portal"
import { notFound } from "next/navigation"
import { PortalTicketClient } from "./portal-ticket-client"

export default async function PortalTicketPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const session = await auth()
  const ticket = await getMyTicketById(id, session!.user.id)

  if (!ticket) notFound()

  return <PortalTicketClient ticket={ticket} />
}
