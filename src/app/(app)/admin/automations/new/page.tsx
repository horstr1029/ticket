import { AutomationForm } from "../automation-form"
import { PageHeader } from "@/components/page-header"
import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function NewAutomationPage() {
  return (
    <>
      <PageHeader
        title="New Automation"
        description="Define a trigger, conditions, and actions"
        actions={
          <Link
            href="/admin/automations"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ArrowLeft className="size-3.5 mr-1" />
            Back
          </Link>
        }
      />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto">
          <AutomationForm />
        </div>
      </main>
    </>
  )
}
