import { db } from "@/lib/db"
import { PageHeader } from "@/components/page-header"
import { AutomationsList } from "./automations-list"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"

export default async function AutomationsPage() {
  const automations = await db.automation.findMany({
    orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
  })

  return (
    <>
      <PageHeader
        title="Automations"
        description="Trigger-based rules to streamline your workflow"
        actions={
          <Link
            href="/admin/automations/new"
            className={buttonVariants({ size: "sm" })}
          >
            <Plus className="size-3.5 mr-1" />
            New Automation
          </Link>
        }
      />
      <main className="flex-1 overflow-auto p-6">
        <AutomationsList automations={automations} />
      </main>
    </>
  )
}
