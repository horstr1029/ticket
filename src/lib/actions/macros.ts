"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { TicketStatus, TicketPriority } from "@/types"

async function requireAgent() {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (!session?.user || (role !== "agent" && role !== "admin")) {
    throw new Error("Unauthorized")
  }
}

export type MacroFormState = { error?: string } | undefined

export async function createMacro(
  _state: MacroFormState,
  formData: FormData
): Promise<MacroFormState> {
  await requireAgent()

  const name = (formData.get("name") as string)?.trim()
  const body = (formData.get("body") as string)?.trim()
  const subject = (formData.get("subject") as string)?.trim() || null
  const status = (formData.get("status") as TicketStatus) || null
  const priority = (formData.get("priority") as TicketPriority) || null
  const tagsRaw = (formData.get("tags") as string)?.trim()
  const tags = tagsRaw ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean) : []

  if (!name) return { error: "Name is required" }
  if (!body) return { error: "Body is required" }

  await db.macro.create({
    data: {
      name,
      body,
      subject: subject ?? undefined,
      status: status ?? undefined,
      priority: priority ?? undefined,
      tags,
    },
  })

  revalidatePath("/admin/macros")
}

export async function updateMacro(
  id: string,
  data: {
    name?: string
    body?: string
    subject?: string | null
    status?: TicketStatus | null
    priority?: TicketPriority | null
    tags?: string[]
    isActive?: boolean
  }
) {
  await requireAgent()
  await db.macro.update({ where: { id }, data })
  revalidatePath("/admin/macros")
}

export async function deleteMacro(id: string) {
  await requireAgent()
  await db.macro.delete({ where: { id } })
  revalidatePath("/admin/macros")
}
