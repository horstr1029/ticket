import { db } from "@/lib/db"

export async function getArticles() {
  return db.article.findMany({
    include: { author: { select: { id: true, name: true } } },
    orderBy: { createdAt: "desc" },
  })
}

export async function getPublishedArticles(category?: string) {
  return db.article.findMany({
    where: {
      isPublished: true,
      ...(category ? { category } : {}),
    },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      views: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  })
}

export async function getArticleCategories() {
  const rows = await db.article.findMany({
    where: { isPublished: true },
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  })
  return rows.map((r) => r.category)
}

export async function getArticleBySlug(slug: string) {
  return db.article.findUnique({
    where: { slug },
    include: { author: { select: { name: true } } },
  })
}

export async function getArticleById(id: string) {
  return db.article.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  })
}
