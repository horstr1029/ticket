"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MoreHorizontal, Mail, Globe, Phone, Code, ChevronDown, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { bulkUpdateTickets } from "@/lib/actions/tickets"
import type { Ticket } from "@/types"

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  new:     { label: "New",     color: "#00c2ff", bg: "rgba(0,194,255,0.12)" },
  open:    { label: "Open",    color: "#10d98a", bg: "rgba(16,217,138,0.12)" },
  pending: { label: "Pending", color: "#f0b429", bg: "rgba(240,180,41,0.12)" },
  solved:  { label: "Solved",  color: "#8899b4", bg: "rgba(136,153,180,0.12)" },
  closed:  { label: "Closed",  color: "#4a5f7a", bg: "rgba(74,95,122,0.12)" },
}

const priorityConfig: Record<string, { label: string; color: string }> = {
  low:    { label: "Low",    color: "#4a5f7a" },
  normal: { label: "Normal", color: "#8899b4" },
  high:   { label: "High",   color: "#f0b429" },
  urgent: { label: "Urgent", color: "#ff4757" },
}

const channelIcons: Record<string, React.ElementType> = {
  email: Mail,
  web: Globe,
  phone: Phone,
  api: Code,
}

interface TicketTableProps {
  tickets: Ticket[]
}

export function TicketTable({ tickets }: TicketTableProps) {
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()

  const allIds = tickets.map((t) => t.id)
  const allSelected = allIds.length > 0 && allIds.every((id) => selected.has(id))
  const someSelected = selected.size > 0

  const toggleAll = () => {
    if (allSelected) setSelected(new Set())
    else setSelected(new Set(allIds))
  }

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const bulkAction = (data: Parameters<typeof bulkUpdateTickets>[1]) => {
    startTransition(async () => {
      await bulkUpdateTickets([...selected], data)
      setSelected(new Set())
    })
  }

  return (
    <div className="space-y-2">
      {/* Bulk action bar */}
      {someSelected && (
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-lg border text-sm"
          style={{
            borderColor: "var(--rk-accent)",
            background: "rgba(0,194,255,0.06)",
          }}
        >
          <span style={{ color: "var(--rk-text2)" }}>
            {selected.size} selected
          </span>
          <div className="flex items-center gap-2 ml-2">
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                  Set status <ChevronDown className="size-3" />
                </Button>
              } />
              <DropdownMenuContent>
                {["open", "pending", "solved", "closed"].map((s) => (
                  <DropdownMenuItem
                    key={s}
                    className="text-xs capitalize"
                    disabled={isPending}
                    onClick={() => bulkAction({ status: s as Ticket["status"] })}
                  >
                    {s}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1">
                  Set priority <ChevronDown className="size-3" />
                </Button>
              } />
              <DropdownMenuContent>
                {["low", "normal", "high", "urgent"].map((p) => (
                  <DropdownMenuItem
                    key={p}
                    className="text-xs capitalize"
                    disabled={isPending}
                    onClick={() => bulkAction({ priority: p as Ticket["priority"] })}
                  >
                    {p}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 ml-auto"
            onClick={() => setSelected(new Set())}
          >
            <X className="size-3.5" style={{ color: "var(--rk-text3)" }} />
          </Button>
        </div>
      )}

      <div
        className="rounded-xl border overflow-hidden"
        style={{ borderColor: "var(--rk-border)", background: "var(--rk-surface)" }}
      >
        <Table>
          <TableHeader>
            <TableRow
              className="hover:bg-transparent border-b"
              style={{ borderColor: "var(--rk-border)" }}
            >
              <TableHead className="w-10 px-3">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </TableHead>
              {["#", "Subject", "Requester", "Assignee", "Status", "Priority", "Channel", "Created", ""].map((h) => (
                <TableHead
                  key={h}
                  className={`text-xs font-semibold uppercase tracking-wide
                    ${h === "#" ? "w-12 text-center" : ""}
                    ${h === "Requester" ? "hidden md:table-cell" : ""}
                    ${h === "Assignee" ? "hidden lg:table-cell" : ""}
                    ${h === "Priority" ? "hidden sm:table-cell" : ""}
                    ${h === "Channel" ? "hidden xl:table-cell" : ""}
                    ${h === "Created" ? "hidden lg:table-cell" : ""}
                    ${h === "" ? "w-10" : ""}
                  `}
                  style={{ color: "var(--rk-text3)" }}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="h-32 text-center"
                  style={{ color: "var(--rk-text3)" }}
                >
                  No tickets found
                </TableCell>
              </TableRow>
            ) : (
              tickets.map((ticket) => {
                const status = statusConfig[ticket.status]
                const priority = priorityConfig[ticket.priority]
                const ChannelIcon = channelIcons[ticket.channel] ?? Globe
                const isSelected = selected.has(ticket.id)

                return (
                  <TableRow
                    key={ticket.id}
                    className="group border-b"
                    style={{
                      borderColor: "var(--rk-border)",
                      background: isSelected ? "rgba(0,194,255,0.04)" : undefined,
                    }}
                  >
                    <TableCell className="px-3">
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggle(ticket.id)}
                        aria-label="Select ticket"
                      />
                    </TableCell>
                    <TableCell
                      className="text-center font-mono text-xs"
                      style={{ color: "var(--rk-text3)" }}
                    >
                      {ticket.ticketNumber}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/tickets/${ticket.id}`}
                        className="text-sm font-medium transition-colors line-clamp-1 hover:underline"
                        style={{ color: "var(--rk-text)" }}
                      >
                        {ticket.subject}
                      </Link>
                      {ticket.tags.length > 0 && (
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {ticket.tags.slice(0, 2).map((tag) => (
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
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarFallback
                            className="text-[10px]"
                            style={{ background: "var(--rk-surface2)", color: "var(--rk-text2)" }}
                          >
                            {ticket.requester?.name.slice(0, 2).toUpperCase() ?? "??"}
                          </AvatarFallback>
                        </Avatar>
                        <span
                          className="text-sm truncate max-w-32"
                          style={{ color: "var(--rk-text2)" }}
                        >
                          {ticket.requester?.name ?? "Unknown"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {ticket.assignee ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="size-6">
                            <AvatarFallback
                              className="text-[10px]"
                              style={{ background: "rgba(0,194,255,0.12)", color: "var(--rk-accent)" }}
                            >
                              {ticket.assignee.name.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span
                            className="text-sm truncate max-w-28"
                            style={{ color: "var(--rk-text2)" }}
                          >
                            {ticket.assignee.name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs" style={{ color: "var(--rk-text3)" }}>
                          Unassigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        style={{ background: status.bg, color: status.color }}
                      >
                        {status.label}
                      </span>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="size-1.5 rounded-full"
                          style={{ background: priority.color }}
                        />
                        <span className="text-xs" style={{ color: priority.color }}>
                          {priority.label}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div
                        className="flex items-center gap-1.5"
                        style={{ color: "var(--rk-text3)" }}
                      >
                        <ChannelIcon className="size-3.5" />
                        <span className="text-xs capitalize">{ticket.channel}</span>
                      </div>
                    </TableCell>
                    <TableCell
                      className="hidden lg:table-cell text-xs"
                      style={{ color: "var(--rk-text3)" }}
                    >
                      {formatDistanceToNow(ticket.createdAt, { addSuffix: true })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 opacity-0 group-hover:opacity-100"
                            >
                              <MoreHorizontal
                                className="size-4"
                                style={{ color: "var(--rk-text2)" }}
                              />
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem render={<Link href={`/tickets/${ticket.id}`} />}>
                            View ticket
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              startTransition(async () => {
                                await bulkUpdateTickets([ticket.id], { status: "solved" })
                              })
                            }
                          >
                            Mark as solved
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() =>
                              startTransition(async () => {
                                await bulkUpdateTickets([ticket.id], { status: "closed" })
                              })
                            }
                          >
                            Close ticket
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
