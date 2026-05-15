"use client"

import { useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, Trash2 } from "lucide-react"
import { deleteMacro } from "@/lib/actions/macros"

interface Macro {
  id: string
  name: string
  body: string
  tags: string[]
  status: string | null
  priority: string | null
  isActive: boolean
}

export function MacrosList({ macros }: { macros: Macro[] }) {
  const [isPending, startTransition] = useTransition()

  if (macros.length === 0) {
    return (
      <div className="text-center py-10" style={{ color: "var(--rk-text3)" }}>
        <FileText className="size-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No macros yet. Create one below.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {macros.map((m) => (
        <Card key={m.id} className="shadow-none">
          <CardContent className="p-4 flex items-start gap-4">
            <div
              className="mt-0.5 p-1.5 rounded-md shrink-0"
              style={{ background: "rgba(0,194,255,0.12)", color: "var(--rk-accent)" }}
            >
              <FileText className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <p className="text-sm font-medium" style={{ color: "var(--rk-text)" }}>{m.name}</p>
                {!m.isActive && <Badge variant="secondary" className="text-[10px] h-4 px-1.5">Inactive</Badge>}
                {m.status && <Badge variant="outline" className="text-[10px] h-4 px-1.5 capitalize">{m.status}</Badge>}
                {m.priority && <Badge variant="outline" className="text-[10px] h-4 px-1.5 capitalize">{m.priority}</Badge>}
              </div>
              <p className="text-xs line-clamp-2" style={{ color: "var(--rk-text2)" }}>{m.body}</p>
              {m.tags.length > 0 && (
                <div className="flex gap-1 mt-2 flex-wrap">
                  {m.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-1.5 py-0.5 rounded"
                      style={{ background: "var(--rk-surface2)", color: "var(--rk-text3)" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0"
              disabled={isPending}
              onClick={() => {
                if (!confirm("Delete this macro?")) return
                startTransition(() => deleteMacro(m.id))
              }}
            >
              <Trash2 className="size-3.5 text-destructive" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
