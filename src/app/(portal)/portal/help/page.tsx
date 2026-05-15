import { getPublishedArticles, getArticleCategories } from "@/lib/queries/knowledge"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Search } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ArticleSummary {
  id: string
  title: string
  slug: string
  category: string
  views: number
  createdAt: Date
}

export default async function HelpPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const [articles, categories] = await Promise.all([
    getPublishedArticles(category),
    getArticleCategories(),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color: "var(--rk-text)" }}>
          Help Center
        </h1>
        <p className="text-sm mt-0.5" style={{ color: "var(--rk-text3)" }}>
          Browse articles and guides to get help
        </p>
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <Link href="/portal/help">
            <Badge
              variant={!category ? "default" : "outline"}
              className="cursor-pointer text-xs px-3 py-1"
            >
              All
            </Badge>
          </Link>
          {categories.map((cat: string) => (
            <Link key={cat} href={`/portal/help?category=${encodeURIComponent(cat)}`}>
              <Badge
                variant={category === cat ? "default" : "outline"}
                className="cursor-pointer text-xs px-3 py-1"
              >
                {cat}
              </Badge>
            </Link>
          ))}
        </div>
      )}

      {articles.length === 0 ? (
        <div className="text-center py-16" style={{ color: "var(--rk-text3)" }}>
          <Search className="size-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">
            {category ? `No articles in "${category}"` : "No articles yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {(articles as ArticleSummary[]).map((a) => (
            <Link key={a.id} href={`/portal/help/${a.slug}`}>
              <Card className="shadow-none hover:border-[var(--rk-accent)]/40 transition-colors cursor-pointer">
                <CardContent className="p-4 flex items-center gap-4">
                  <div
                    className="p-1.5 rounded-md shrink-0"
                    style={{ background: "rgba(0,194,255,0.12)", color: "var(--rk-accent)" }}
                  >
                    <BookOpen className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "var(--rk-text)" }}>
                      {a.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--rk-text3)" }}>
                      {a.category} · {a.views} view{a.views !== 1 ? "s" : ""} ·{" "}
                      {formatDistanceToNow(a.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
