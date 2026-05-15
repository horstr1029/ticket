"use client"

import { useActionState } from "react"
import { submitPortalTicket } from "@/lib/actions/portal"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewPortalTicketPage() {
  const [state, action, pending] = useActionState(submitPortalTicket, undefined)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/portal"
          className="text-xs flex items-center gap-1 hover:opacity-80 transition-opacity"
          style={{ color: "var(--rk-text3)" }}
        >
          <ArrowLeft className="size-3.5" />
          Back to tickets
        </Link>
      </div>

      <Card className="shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Submit a Support Request</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action} className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Subject</Label>
              <Input
                name="subject"
                placeholder="Briefly describe your issue"
                className="text-sm"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs">
                Description <span className="text-red-400">*</span>
              </Label>
              <Textarea
                name="body"
                placeholder="Please provide as much detail as possible..."
                className="min-h-32 resize-none text-sm"
                required
              />
            </div>

            {state?.error && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}

            <div className="flex gap-3">
              <Button type="submit" disabled={pending}>
                {pending ? "Submitting…" : "Submit Request"}
              </Button>
              <Link href="/portal">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
