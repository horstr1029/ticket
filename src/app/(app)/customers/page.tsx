import { PageHeader } from "@/components/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { buttonVariants } from "@/components/ui/button"
import { ExternalLink, Users } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { getCustomers } from "@/lib/queries/customers"
import { CustomerSearch } from "./customer-search"

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const customers = await getCustomers(q)

  return (
    <>
      <PageHeader
        title="Customers"
        description={`${customers.length} customer${customers.length !== 1 ? "s" : ""}${q ? ` matching "${q}"` : ""}`}
      />
      <main className="flex-1 overflow-auto p-6 space-y-4">
        <CustomerSearch defaultValue={q} />

        {customers.length === 0 ? (
          <div className="text-center py-16" style={{ color: "var(--rk-text3)" }}>
            <Users className="size-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">
              {q ? `No customers matching "${q}"` : "No customers yet"}
            </p>
          </div>
        ) : (
          <div
            className="rounded-xl border overflow-hidden"
            style={{ borderColor: "var(--rk-border)", background: "var(--rk-surface)" }}
          >
            {customers.map((customer, i) => (
              <div
                key={customer.id}
                className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--rk-surface2)] transition-colors"
                style={{
                  borderBottom: i < customers.length - 1 ? `1px solid var(--rk-border)` : undefined,
                }}
              >
                <Avatar className="size-9 shrink-0">
                  <AvatarFallback
                    className="text-xs font-semibold"
                    style={{ background: "rgba(0,194,255,0.12)", color: "var(--rk-accent)" }}
                  >
                    {customer.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "var(--rk-text)" }}>
                    {customer.name}
                  </p>
                  <p className="text-xs truncate" style={{ color: "var(--rk-text3)" }}>
                    {customer.email}
                  </p>
                </div>
                <div className="hidden md:flex items-center gap-6 text-xs">
                  <div className="text-center">
                    <p className="font-semibold" style={{ color: "var(--rk-text)" }}>
                      {customer._count.requestedTickets}
                    </p>
                    <p style={{ color: "var(--rk-text3)" }}>tickets</p>
                  </div>
                  <div className="text-center">
                    <p
                      className="font-semibold"
                      style={{
                        color:
                          customer.requestedTickets.length > 0
                            ? "#f0b429"
                            : "var(--rk-green)",
                      }}
                    >
                      {customer.requestedTickets.length}
                    </p>
                    <p style={{ color: "var(--rk-text3)" }}>open</p>
                  </div>
                  <div className="hidden lg:block" style={{ color: "var(--rk-text3)" }}>
                    Joined {formatDistanceToNow(customer.createdAt, { addSuffix: true })}
                  </div>
                </div>
                <Link
                  href={`/customers/${customer.id}`}
                  className={buttonVariants({ variant: "ghost", size: "icon" }) + " size-7"}
                >
                  <ExternalLink className="size-3.5" style={{ color: "var(--rk-text3)" }} />
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  )
}
