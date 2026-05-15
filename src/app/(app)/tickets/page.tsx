import { Suspense } from "react"
import { PageHeader } from "@/components/page-header"
import { TicketTable } from "@/components/ticket-table"
import { TicketFilters } from "@/components/ticket-filters"
import { buttonVariants } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import Link from "next/link"
import { getTickets } from "@/lib/queries/tickets"

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const { q, status, priority } = await searchParams

  const [allTickets, filtered] = await Promise.all([
    getTickets(),
    getTickets({ search: q, status, priority }),
  ])

  const byStatus = (s: string | string[]) => {
    const statuses = Array.isArray(s) ? s : [s]
    return allTickets.filter((t) => statuses.includes(t.status))
  }

  return (
    <>
      <PageHeader
        title="Tickets"
        description={`${allTickets.length} tickets total`}
        actions={
          <Link href="/tickets/new" className={buttonVariants({ size: "sm" })}>
            <Plus className="size-3.5 mr-1" />
            New Ticket
          </Link>
        }
      />
      <main className="flex-1 overflow-auto p-6 space-y-4">
        <Tabs defaultValue={status && status !== "all" ? status : "all"}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs">
                All ({allTickets.length})
              </TabsTrigger>
              <TabsTrigger value="open" className="text-xs">
                Open ({byStatus(["open", "new"]).length})
              </TabsTrigger>
              <TabsTrigger value="pending" className="text-xs">
                Pending ({byStatus("pending").length})
              </TabsTrigger>
              <TabsTrigger value="solved" className="text-xs">
                Solved ({byStatus("solved").length})
              </TabsTrigger>
            </TabsList>

            <Suspense>
              <TicketFilters />
            </Suspense>
          </div>

          <TabsContent value="all" className="mt-4">
            <TicketTable tickets={filtered as Parameters<typeof TicketTable>[0]["tickets"]} />
          </TabsContent>
          <TabsContent value="open" className="mt-4">
            <TicketTable
              tickets={filtered.filter(
                (t) => t.status === "open" || t.status === "new"
              ) as Parameters<typeof TicketTable>[0]["tickets"]}
            />
          </TabsContent>
          <TabsContent value="pending" className="mt-4">
            <TicketTable
              tickets={filtered.filter(
                (t) => t.status === "pending"
              ) as Parameters<typeof TicketTable>[0]["tickets"]}
            />
          </TabsContent>
          <TabsContent value="solved" className="mt-4">
            <TicketTable
              tickets={filtered.filter(
                (t) => t.status === "solved"
              ) as Parameters<typeof TicketTable>[0]["tickets"]}
            />
          </TabsContent>
        </Tabs>
      </main>
    </>
  )
}
