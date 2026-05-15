"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

async function requireAgent() {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (!session?.user || (role !== "agent" && role !== "admin")) {
    throw new Error("Unauthorized")
  }
}

export type AutomationFormState = { error?: string } | undefined

export async function createAutomation(
  _state: AutomationFormState,
  formData: FormData
): Promise<AutomationFormState> {
  await requireAgent()

  const name = (formData.get("name") as string)?.trim()
  const triggerEvent = formData.get("triggerEvent") as string
  const conditionsRaw = formData.get("conditions") as string
  const actionsRaw = formData.get("actions") as string

  if (!name) return { error: "Name is required" }
  if (!triggerEvent) return { error: "Trigger event is required" }

  let conditions, actions
  try {
    conditions = JSON.parse(conditionsRaw || '{"operator":"AND","rules":[]}')
    actions = JSON.parse(actionsRaw || "[]")
  } catch {
    return { error: "Invalid conditions or actions format" }
  }

  await db.automation.create({ data: { name, triggerEvent, conditions, actions } })
  revalidatePath("/admin/automations")
}

export async function updateAutomation(
  id: string,
  data: {
    name?: string
    triggerEvent?: string
    conditions?: object
    actions?: object
    isActive?: boolean
    priority?: number
  }
) {
  await requireAgent()
  await db.automation.update({ where: { id }, data })
  revalidatePath("/admin/automations")
}

export async function deleteAutomation(id: string) {
  await requireAgent()
  await db.automation.delete({ where: { id } })
  revalidatePath("/admin/automations")
}

export async function toggleAutomation(id: string, isActive: boolean) {
  await requireAgent()
  await db.automation.update({ where: { id }, data: { isActive } })
  revalidatePath("/admin/automations")
}
