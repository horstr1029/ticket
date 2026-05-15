"use client"

import { useActionState, useState } from "react"
import { useRouter } from "next/navigation"
import { createAutomation } from "@/lib/actions/automations"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"

const TRIGGER_OPTIONS = [
  { value: "ticket.created", label: "Ticket created" },
  { value: "ticket.status_changed", label: "Status changed" },
  { value: "ticket.assigned", label: "Ticket assigned" },
  { value: "ticket.comment_added", label: "Comment added" },
]

const CONDITION_FIELDS = [
  { value: "priority", label: "Priority" },
  { value: "status", label: "Status" },
  { value: "channel", label: "Channel" },
  { value: "subject", label: "Subject" },
  { value: "tags", label: "Tags" },
]

const CONDITION_OPS = [
  { value: "equals", label: "equals" },
  { value: "not_equals", label: "not equals" },
  { value: "contains", label: "contains" },
  { value: "not_contains", label: "does not contain" },
  { value: "is_empty", label: "is empty" },
  { value: "is_not_empty", label: "is not empty" },
]

const ACTION_TYPES = [
  { value: "set_status", label: "Set status" },
  { value: "set_priority", label: "Set priority" },
  { value: "add_tag", label: "Add tag" },
  { value: "assign_agent", label: "Assign to agent (ID)" },
]

interface Rule { field: string; op: string; value: string }
interface Action { type: string; value: string }

export function AutomationForm() {
  const router = useRouter()
  const [rules, setRules] = useState<Rule[]>([{ field: "priority", op: "equals", value: "urgent" }])
  const [actions, setActions] = useState<Action[]>([{ type: "set_status", value: "open" }])
  const [operator, setOperator] = useState<"AND" | "OR">("AND")
  const [state, _action, pending] = useActionState(createAutomation, undefined)

  const addRule = () => setRules((r) => [...r, { field: "priority", op: "equals", value: "" }])
  const removeRule = (i: number) => setRules((r) => r.filter((_, idx) => idx !== i))
  const updateRule = (i: number, key: keyof Rule, val: string) =>
    setRules((r) => r.map((rule, idx) => (idx === i ? { ...rule, [key]: val } : rule)))

  const addAction = () => setActions((a) => [...a, { type: "set_status", value: "" }])
  const removeAction = (i: number) => setActions((a) => a.filter((_, idx) => idx !== i))
  const updateAction = (i: number, key: keyof Action, val: string) =>
    setActions((a) => a.map((act, idx) => (idx === i ? { ...act, [key]: val } : act)))

  async function handleSubmit(formData: FormData) {
    formData.set("conditions", JSON.stringify({ operator, rules }))
    formData.set("actions", JSON.stringify(actions))
    const result = await createAutomation(undefined, formData)
    if (!result?.error) router.push("/admin/automations")
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <Card className="shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Basic Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Name</Label>
            <Input name="name" placeholder="e.g. Auto-assign urgent tickets" className="h-8 text-sm" required />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Trigger Event</Label>
            <Select name="triggerEvent" defaultValue="ticket.created">
              <SelectTrigger className="h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TRIGGER_OPTIONS.map((t) => (
                  <SelectItem key={t.value} value={t.value} className="text-sm">
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Conditions</CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "var(--rk-text2)" }}>Match</span>
              <Select value={operator} onValueChange={(v) => v && setOperator(v as "AND" | "OR")}>
                <SelectTrigger className="h-6 w-16 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="AND" className="text-xs">ALL</SelectItem>
                  <SelectItem value="OR" className="text-xs">ANY</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-xs" style={{ color: "var(--rk-text2)" }}>of the following</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {rules.map((rule, i) => (
            <div key={i} className="flex items-center gap-2">
              <Select value={rule.field} onValueChange={(v) => v && updateRule(i, "field", v)}>
                <SelectTrigger className="h-8 text-xs flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_FIELDS.map((f) => (
                    <SelectItem key={f.value} value={f.value} className="text-xs">{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={rule.op} onValueChange={(v) => v && updateRule(i, "op", v)}>
                <SelectTrigger className="h-8 text-xs w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONDITION_OPS.map((o) => (
                    <SelectItem key={o.value} value={o.value} className="text-xs">{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={rule.value}
                onChange={(e) => updateRule(i, "value", e.target.value)}
                placeholder="value"
                className="h-8 text-xs flex-1"
              />
              <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => removeRule(i)}>
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={addRule}>
            <Plus className="size-3 mr-1" /> Add condition
          </Button>
        </CardContent>
      </Card>

      <Card className="shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {actions.map((action, i) => (
            <div key={i} className="flex items-center gap-2">
              <Select value={action.type} onValueChange={(v) => v && updateAction(i, "type", v)}>
                <SelectTrigger className="h-8 text-xs flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ACTION_TYPES.map((a) => (
                    <SelectItem key={a.value} value={a.value} className="text-xs">{a.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={action.value}
                onChange={(e) => updateAction(i, "value", e.target.value)}
                placeholder="value (e.g. urgent, open, tag-name)"
                className="h-8 text-xs flex-1"
              />
              <Button type="button" variant="ghost" size="icon" className="size-8" onClick={() => removeAction(i)}>
                <Trash2 className="size-3.5 text-destructive" />
              </Button>
            </div>
          ))}
          <Button type="button" variant="outline" size="sm" className="h-7 text-xs" onClick={addAction}>
            <Plus className="size-3 mr-1" /> Add action
          </Button>
        </CardContent>
      </Card>

      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

      <input type="hidden" name="conditions" value={JSON.stringify({ operator, rules })} />
      <input type="hidden" name="actions" value={JSON.stringify(actions)} />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/automations")}>
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : "Create Automation"}
        </Button>
      </div>
    </form>
  )
}
