"use client"

import { useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { deleteArticle, toggleArticlePublished } from "@/lib/actions/knowledge"

interface Article {
  id: string
  title: string
  slug: string
  category: string
  isPublished: boolean
  views: number
  createdAt: Date
  author: { id: string; name: string }
}

export function ArticlesList({ articles }: { articles: Article[] }) {
  const [isPending, startTransition] = useTransition()

  if (articles.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: "var(--rk-text3)" }}>
        <BookOpen className="size-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No articles yet. Create one to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {articles.map((a) => (
        <Card key={a.id} className="shadow-none">
          <CardContent className="p-4 flex items-start gap-4">
            <div
              className="mt-0.5 p-1.5 rounded-md shrink-0"
              style={{ background: "rgba(0,194,255,0.12)", color: "var(--rk-accent)" }}
            >
              <BookOpen className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Link
                  href={`/admin/knowledge/${a.id}/edit`}
                  className="text-sm font-medium hover:underline"
                  style={{ color: "var(--rk-text)" }}
                >
                  {a.title}
                </Link>
                <Badge
                  variant={a.isPublished ? "default" : "secondary"}
                  className="text-[10px] h-4 px-1.5"
                >
                  {a.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>
              <p className="text-xs" style={{ color: "var(--rk-text3)" }}>
                {a.category} · {a.views} views · by {a.author.name} ·{" "}
                {formatDistanceToNow(a.createdAt, { addSuffix: true })}
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                disabled={isPending}
                title={a.isPublished ? "Unpublish" : "Publish"}
                onClick={() =>
                  startTransition(() => toggleArticlePublished(a.id, !a.isPublished))
                }
              >
                {a.isPublished ? (
                  <EyeOff className="size-3.5" style={{ color: "var(--rk-text3)" }} />
                ) : (
                  <Eye className="size-3.5" style={{ color: "var(--rk-accent)" }} />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                disabled={isPending}
                onClick={() => {
                  if (!confirm("Delete this article?")) return
                  startTransition(() => deleteArticle(a.id))
                }}
              >
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
