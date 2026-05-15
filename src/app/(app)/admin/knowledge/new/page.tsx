"use client"

import { useActionState } from "react"
import { createArticle } from "@/lib/actions/knowledge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewArticlePage() {
  const [state, action, pending] = useActionState(createArticle, undefined)

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
          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">New Article</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={action} className="space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs">Title</Label>
                  <Input
                    name="title"
                    placeholder="e.g. How to reset your password"
                    className="text-sm"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">Category</Label>
                  <Input
                    name="category"
                    placeholder="e.g. Account, Billing, Technical"
                    className="h-8 text-sm"
                    defaultValue="General"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs">
                    Body <span className="text-red-400">*</span>
                  </Label>
                  <Textarea
                    name="body"
                    placeholder="Write the article content here..."
                    className="min-h-64 resize-y text-sm font-mono"
                    required
                  />
                  <p className="text-xs" style={{ color: "var(--rk-text3)" }}>
                    Markdown supported
                  </p>
                </div>

                {state?.error && (
                  <p className="text-sm text-red-500">{state.error}</p>
                )}

                <div className="flex gap-3">
                  <Button type="submit" disabled={pending}>
                    {pending ? "Saving…" : "Save as Draft"}
                  </Button>
                  <Link href="/admin/knowledge">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}
