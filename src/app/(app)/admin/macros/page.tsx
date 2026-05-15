import { getMacros } from "@/lib/queries/macros"
import { PageHeader } from "@/components/page-header"
import { MacrosList } from "./macros-list"
import { MacroCreateForm } from "./macro-create-form"

export default async function MacrosPage() {
  const macros = await getMacros()

  return (
    <>
      <PageHeader
        title="Macros"
        description="Quick reply templates for common responses"
      />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl space-y-8">
          <MacrosList macros={macros} />
          <MacroCreateForm />
        </div>
      </main>
    </>
  )
}
