"use client"

import { useActionState } from "react"
import { createSlaPolicy } from "@/lib/actions/sla"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export function SlaCreateForm() {
  const [state, action, pending] = useActionState(createSlaPolicy, undefined)
  const [bizHours, setBizHours] = useState(true)
  const [isDefault, setIsDefault] = useState(false)

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Create New Policy</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Policy Name</Label>
            <Input name="name" placeholder="e.g. Standard SLA" className="h-8 text-sm" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">First Response (minutes)</Label>
              <Input name="firstResponseTime" type="number" min="1" defaultValue="240" className="h-8 text-sm" required />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Resolution Time (minutes)</Label>
              <Input name="resolutionTime" type="number" min="1" defaultValue="1440" className="h-8 text-sm" required />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium" style={{ color: "var(--rk-text)" }}>Business hours only</p>
              <p className="text-xs" style={{ color: "var(--rk-text3)" }}>Mon–Fri 09:00–17:00 UTC</p>
            </div>
            <Switch
              checked={bizHours}
              onCheckedChange={setBizHours}
              name="businessHoursOnly"
              value={bizHours ? "true" : "false"}
            />
          </div>
          <input type="hidden" name="businessHoursOnly" value={bizHours ? "true" : "false"} />

          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium" style={{ color: "var(--rk-text)" }}>Set as default</p>
              <p className="text-xs" style={{ color: "var(--rk-text3)" }}>Applied to all new tickets</p>
            </div>
            <Switch
              checked={isDefault}
              onCheckedChange={setIsDefault}
            />
          </div>
          <input type="hidden" name="isDefault" value={isDefault ? "true" : "false"} />

          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Creating…" : "Create Policy"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
