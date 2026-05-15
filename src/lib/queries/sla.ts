import { db } from "@/lib/db"

export async function getSlaPolicies() {
  return db.slaPolicy.findMany({ orderBy: { name: "asc" } })
}

export async function getDefaultSlaPolicy() {
  return db.slaPolicy.findFirst({ where: { isDefault: true } })
}
