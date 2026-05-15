"use client"

import { useActionState } from "react"
import { createMacro } from "@/lib/actions/macros"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function MacroCreateForm() {
  const [state, action, pending] = useActionState(createMacro, undefined)

  return (
    <Card className="shadow-none">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Create New Macro</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={action} className="space-y-4">
          <div className="space-y-1.5">
            <Label className="text-xs">Name</Label>
            <Input name="name" placeholder="e.g. Request more info" className="h-8 text-sm" required />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Reply Body <span className="text-red-400">*</span></Label>
            <Textarea
              name="body"
              placeholder="Hi {{requester_name}},&#10;&#10;Thank you for reaching out..."
              className="min-h-24 resize-none text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Set Status (optional)</Label>
              <Select name="status">
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="No change" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No change</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="solved">Solved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Set Priority (optional)</Label>
              <Select name="priority">
                <SelectTrigger className="h-8 text-sm">
                  <SelectValue placeholder="No change" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">No change</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">Tags to add (comma-separated)</Label>
            <Input name="tags" placeholder="e.g. needs-info, follow-up" className="h-8 text-sm" />
          </div>

          {state?.error && <p className="text-sm text-red-500">{state.error}</p>}

          <Button type="submit" size="sm" disabled={pending}>
            {pending ? "Creating…" : "Create Macro"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
