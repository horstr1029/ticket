import { db } from "@/lib/db"

export async function getMacros() {
  return db.macro.findMany({ orderBy: { name: "asc" } })
}

export async function getActiveMacros() {
  return db.macro.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  })
}
