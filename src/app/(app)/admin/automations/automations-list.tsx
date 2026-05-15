"use client"

import { useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Zap, Trash2 } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { toggleAutomation, deleteAutomation } from "@/lib/actions/automations"

const TRIGGER_LABELS: Record<string, string> = {
  "ticket.created": "Ticket created",
  "ticket.status_changed": "Status changed",
  "ticket.assigned": "Ticket assigned",
  "ticket.comment_added": "Comment added",
}

interface Automation {
  id: string
  name: string
  triggerEvent: string
  conditions: unknown
  actions: unknown
  isActive: boolean
  priority: number
  lastRun: Date | null
}

export function AutomationsList({ automations }: { automations: Automation[] }) {
  const [isPending, startTransition] = useTransition()

  const handleToggle = (id: string, current: boolean) => {
    startTransition(() => toggleAutomation(id, !current))
  }

  const handleDelete = (id: string) => {
    if (!confirm("Delete this automation?")) return
    startTransition(() => deleteAutomation(id))
  }

  if (automations.length === 0) {
    return (
      <div className="text-center py-16" style={{ color: "var(--rk-text3)" }}>
        <Zap className="size-10 mx-auto mb-3 opacity-30" />
        <p className="text-sm font-medium">No automations yet</p>
        <p className="text-xs mt-1">Create your first rule to automate repetitive tasks.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {automations.map((auto) => {
        const conditions = auto.conditions as { operator: string; rules: Array<{ field: string; op: string; value: string }> }
        const actions = auto.actions as Array<{ type: string; value: string }>
        const conditionSummary =
          conditions.rules?.length > 0
            ? conditions.rules.map((r) => `${r.field} ${r.op} "${r.value}"`).join(` ${conditions.operator} `)
            : "Always"
        const actionSummary =
          actions?.length > 0
            ? actions.map((a) => `${a.type.replace(/_/g, " ")} → ${a.value}`).join(", ")
            : "No actions"

        return (
          <Card key={auto.id} className="shadow-none">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div
                  className="mt-0.5 p-1.5 rounded-md"
                  style={
                    auto.isActive
                      ? { background: "rgba(0,194,255,0.12)", color: "var(--rk-accent)" }
                      : { background: "var(--rk-surface2)", color: "var(--rk-text3)" }
                  }
                >
                  <Zap className="size-4" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-sm font-medium" style={{ color: "var(--rk-text)" }}>
                      {auto.name}
                    </p>
                    <Badge
                      variant={auto.isActive ? "default" : "secondary"}
                      className="text-[10px] h-4 px-1.5"
                    >
                      {auto.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs" style={{ color: "var(--rk-text2)" }}>
                    <div>
                      <span className="font-medium" style={{ color: "var(--rk-text)" }}>When: </span>
                      {TRIGGER_LABELS[auto.triggerEvent] ?? auto.triggerEvent}
                    </div>
                    <div className="truncate">
                      <span className="font-medium" style={{ color: "var(--rk-text)" }}>If: </span>
                      {conditionSummary}
                    </div>
                    <div className="truncate">
                      <span className="font-medium" style={{ color: "var(--rk-text)" }}>Then: </span>
                      {actionSummary}
                    </div>
                  </div>

                  {auto.lastRun && (
                    <p className="text-[10px] mt-2" style={{ color: "var(--rk-text3)" }}>
                      Last ran {formatDistanceToNow(auto.lastRun, { addSuffix: true })}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    checked={auto.isActive}
                    disabled={isPending}
                    onCheckedChange={() => handleToggle(auto.id, auto.isActive)}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs"
                    render={<Link href={`/admin/automations/${auto.id}/edit`} />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    disabled={isPending}
                    onClick={() => handleDelete(auto.id)}
                  >
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
