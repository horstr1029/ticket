"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

async function requireAgent() {
  const session = await auth()
  const role = (session?.user as { role?: string })?.role
  if (!session?.user || (role !== "agent" && role !== "admin")) throw new Error("Unauthorized")
  return session.user
}

export type ArticleFormState = { error?: string } | undefined

export async function createArticle(
  _state: ArticleFormState,
  formData: FormData
): Promise<ArticleFormState> {
  const user = await requireAgent()

  const title = (formData.get("title") as string)?.trim()
  const body = (formData.get("body") as string)?.trim()
  const category = (formData.get("category") as string)?.trim() || "General"

  if (!title) return { error: "Title is required" }
  if (!body) return { error: "Body is required" }

  const base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
  const existing = await db.article.findUnique({ where: { slug: base } })
  const slug = existing ? `${base}-${Date.now()}` : base

  await db.article.create({
    data: { title, slug, body, category, authorId: user.id },
  })

  revalidatePath("/admin/knowledge")
  revalidatePath("/portal/help")
  redirect("/admin/knowledge")
}

export async function updateArticle(
  id: string,
  data: { title?: string; body?: string; category?: string }
) {
  await requireAgent()
  await db.article.update({ where: { id }, data })
  revalidatePath("/admin/knowledge")
  revalidatePath("/portal/help")
}

export async function toggleArticlePublished(id: string, isPublished: boolean) {
  await requireAgent()
  await db.article.update({ where: { id }, data: { isPublished } })
  revalidatePath("/admin/knowledge")
  revalidatePath("/portal/help")
}

export async function deleteArticle(id: string) {
  await requireAgent()
  await db.article.delete({ where: { id } })
  revalidatePath("/admin/knowledge")
  revalidatePath("/portal/help")
}

export async function incrementArticleViews(id: string) {
  await db.article.update({
    where: { id },
    data: { views: { increment: 1 } },
  })
}
