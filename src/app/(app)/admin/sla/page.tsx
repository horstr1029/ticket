import { getSlaPolicies } from "@/lib/queries/sla"
import { PageHeader } from "@/components/page-header"
import { SlaList } from "./sla-list"
import { SlaCreateForm } from "./sla-create-form"

export default async function SlaPage() {
  const policies = await getSlaPolicies()

  return (
    <>
      <PageHeader
        title="SLA Policies"
        description="Define response and resolution time targets"
      />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl space-y-8">
          <SlaList policies={policies} />
          <SlaCreateForm />
        </div>
      </main>
    </>
  )
}
