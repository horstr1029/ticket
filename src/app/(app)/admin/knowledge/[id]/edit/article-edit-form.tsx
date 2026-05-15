"use client"

import { useTransition, useState } from "react"
import { updateArticle, toggleArticlePublished } from "@/lib/actions/knowledge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Article {
  id: string
  title: string
  body: string
  category: string
  isPublished: boolean
}

export function ArticleEditForm({ article }: { article: Article }) {
  const [isPending, startTransition] = useTransition()
  const [title, setTitle] = useState(article.title)
  const [body, setBody] = useState(article.body)
  const [category, setCategory] = useState(article.category)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    startTransition(async () => {
      await updateArticle(article.id, { title, body, category })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    })
  }

  const handleTogglePublish = () => {
    startTransition(() => toggleArticlePublished(article.id, !article.isPublished))
  }

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Edit Article</CardTitle>
          <Badge variant={article.isPublished ? "default" : "secondary"} className="text-[10px]">
            {article.isPublished ? "Published" : "Draft"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs">Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Category</Label>
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-8 text-sm"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs">Body</Label>
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-64 resize-y text-sm font-mono"
          />
          <p className="text-xs" style={{ color: "var(--rk-text3)" }}>
            Markdown supported
          </p>
        </div>

        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={isPending} size="sm">
            {saved ? "Saved!" : isPending ? "Saving…" : "Save Changes"}
          </Button>
          <Button
            onClick={handleTogglePublish}
            disabled={isPending}
            variant="outline"
            size="sm"
          >
            {article.isPublished ? "Unpublish" : "Publish"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
