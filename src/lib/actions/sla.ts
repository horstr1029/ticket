"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"

async function requireAdmin() {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (!session?.user || role !== "admin") throw new Error("Unauthorized")
}

export type SlaFormState = { error?: string } | undefined

export async function createSlaPolicy(
  _state: SlaFormState,
  formData: FormData
): Promise<SlaFormState> {
  await requireAdmin()

  const name = (formData.get("name") as string)?.trim()
  const firstResponseTime = parseInt(formData.get("firstResponseTime") as string)
  const resolutionTime = parseInt(formData.get("resolutionTime") as string)
  const businessHoursOnly = formData.get("businessHoursOnly") === "true"
  const isDefault = formData.get("isDefault") === "true"

  if (!name) return { error: "Name is required" }
  if (isNaN(firstResponseTime) || firstResponseTime < 1)
    return { error: "First response time must be a positive number" }
  if (isNaN(resolutionTime) || resolutionTime < 1)
    return { error: "Resolution time must be a positive number" }

  if (isDefault) {
    await db.slaPolicy.updateMany({ data: { isDefault: false } })
  }

  await db.slaPolicy.create({
    data: { name, firstResponseTime, resolutionTime, businessHoursOnly, isDefault },
  })

  revalidatePath("/admin/sla")
}

export async function updateSlaPolicy(
  id: string,
  data: {
    name?: string
    firstResponseTime?: number
    resolutionTime?: number
    businessHoursOnly?: boolean
    isDefault?: boolean
  }
) {
  await requireAdmin()

  if (data.isDefault) {
    await db.slaPolicy.updateMany({ data: { isDefault: false } })
  }

  await db.slaPolicy.update({ where: { id }, data })
  revalidatePath("/admin/sla")
}

export async function deleteSlaPolicy(id: string) {
  await requireAdmin()
  await db.slaPolicy.delete({ where: { id } })
  revalidatePath("/admin/sla")
}
