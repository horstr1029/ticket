"use client"

import { useActionState } from "react"
import { createTicket } from "@/lib/actions/tickets"
import { PageHeader } from "@/components/page-header"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewTicketPage() {
  const [state, action, pending] = useActionState(createTicket, undefined)

  return (
    <>
      <PageHeader
        title="New Ticket"
        description="Create a new support ticket"
        actions={
          <Link
            href="/tickets"
            className={buttonVariants({ variant: "outline", size: "sm" })}
          >
            <ArrowLeft className="size-3.5 mr-1" />
            Cancel
          </Link>
        }
      />
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto">
          <form action={action} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="subject" className="text-sm font-medium">
                Subject <span className="text-red-400">*</span>
              </Label>
              <Input
                id="subject"
                name="subject"
                placeholder="Brief description of the issue"
                required
                className="h-9"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="body" className="text-sm font-medium">
                Description
              </Label>
              <Textarea
                id="body"
                name="body"
                placeholder="Provide more details about the issue..."
                className="min-h-32 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="priority" className="text-sm font-medium">
                  Priority
                </Label>
                <Select name="priority" defaultValue="normal">
                  <SelectTrigger id="priority" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="channel" className="text-sm font-medium">
                  Channel
                </Label>
                <Select name="channel" defaultValue="web">
                  <SelectTrigger id="channel" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="api">API</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {state?.error && (
              <p className="text-sm text-red-500">{state.error}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <Link
                href="/tickets"
                className={buttonVariants({ variant: "outline" })}
              >
                Cancel
              </Link>
              <Button type="submit" disabled={pending}>
                {pending ? "Creating…" : "Create Ticket"}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}
