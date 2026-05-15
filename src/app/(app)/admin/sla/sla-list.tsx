"use client"

import { useTransition } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Trash2 } from "lucide-react"
import { deleteSlaPolicy } from "@/lib/actions/sla"

interface SlaPolicy {
  id: string
  name: string
  firstResponseTime: number
  resolutionTime: number
  businessHoursOnly: boolean
  isDefault: boolean
}

function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function SlaList({ policies }: { policies: SlaPolicy[] }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = (id: string) => {
    if (!confirm("Delete this SLA policy?")) return
    startTransition(() => deleteSlaPolicy(id))
  }

  if (policies.length === 0) {
    return (
      <div className="text-center py-10" style={{ color: "var(--rk-text3)" }}>
        <Clock className="size-8 mx-auto mb-2 opacity-30" />
        <p className="text-sm">No SLA policies yet. Create one below.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {policies.map((p) => (
        <Card key={p.id} className="shadow-none">
          <CardContent className="p-4 flex items-center gap-4">
            <div
              className="p-1.5 rounded-md"
              style={{ background: "rgba(0,194,255,0.12)", color: "var(--rk-accent)" }}
            >
              <Clock className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-sm font-medium" style={{ color: "var(--rk-text)" }}>{p.name}</p>
                {p.isDefault && (
                  <Badge className="text-[10px] h-4 px-1.5">Default</Badge>
                )}
                <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                  {p.businessHoursOnly ? "Business hours" : "24/7"}
                </Badge>
              </div>
              <div className="flex gap-6 text-xs" style={{ color: "var(--rk-text2)" }}>
                <span>First response: <strong style={{ color: "var(--rk-text)" }}>{formatMinutes(p.firstResponseTime)}</strong></span>
                <span>Resolution: <strong style={{ color: "var(--rk-text)" }}>{formatMinutes(p.resolutionTime)}</strong></span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              disabled={isPending}
              onClick={() => handleDelete(p.id)}
            >
              <Trash2 className="size-3.5 text-destructive" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
