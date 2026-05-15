import { notFound } from "next/navigation"
import { getArticleById } from "@/lib/queries/knowledge"
import { ArticleEditForm } from "./article-edit-form"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const article = await getArticleById(id)
  if (!article) notFound()

  return (
    <>
      <div
        className="border-b px-6 py-3 flex items-center gap-3"
        style={{ borderColor: "var(--rk-border)" }}
      >
        <Link
          href="/admin/knowledge"
          className="text-xs flex items-center gap-1 hover:opacity-80"
          style={{ color: "var(--rk-text3)" }}
        >
          <ArrowLeft className="size-3.5" />
          Back to Knowledge Base
        </Link>
      </div>
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl">
          <ArticleEditForm article={article} />
        </div>
      </main>
    </>
  )
}
