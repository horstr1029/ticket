import { notFound } from "next/navigation"
import { getArticleBySlug } from "@/lib/queries/knowledge"
import { incrementArticleViews } from "@/lib/actions/knowledge"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)
  if (!article || !article.isPublished) notFound()

  await incrementArticleViews(article.id)

  return (
    <div className="space-y-6">
      <Link
        href="/portal/help"
        className="text-xs flex items-center gap-1 hover:opacity-80 transition-opacity"
        style={{ color: "var(--rk-text3)" }}
      >
        <ArrowLeft className="size-3.5" />
        Back to Help Center
      </Link>

      <article>
        <div className="mb-4">
          <p className="text-xs mb-2" style={{ color: "var(--rk-accent)" }}>
            {article.category}
          </p>
          <h1 className="text-2xl font-bold" style={{ color: "var(--rk-text)" }}>
            {article.title}
          </h1>
          <p className="text-xs mt-2" style={{ color: "var(--rk-text3)" }}>
            By {article.author.name} · {format(article.createdAt, "MMM d, yyyy")} ·{" "}
            {article.views} view{article.views !== 1 ? "s" : ""}
          </p>
        </div>

        <div
          className="border-t pt-6 prose prose-sm max-w-none"
          style={{ borderColor: "var(--rk-border)", color: "var(--rk-text2)" }}
        >
          {article.body.split("\n").map((line: string, i: number) => (
            <p key={i} className="mb-3 leading-relaxed">
              {line || "\u00A0"}
            </p>
          ))}
        </div>
      </article>

      <div
        className="border-t pt-6"
        style={{ borderColor: "var(--rk-border)" }}
      >
        <p className="text-sm font-medium mb-2" style={{ color: "var(--rk-text2)" }}>
          Still need help?
        </p>
        <Link
          href="/portal/new"
          className="text-sm"
          style={{ color: "var(--rk-accent)" }}
        >
          Submit a support ticket →
        </Link>
      </div>
    </div>
  )
}
