"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MoreHorizontal, Mail, Globe, Phone, Code } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Ticket } from "@/types";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "bg-blue-50 text-blue-700 border-blue-200" },
  open: { label: "Open", className: "bg-green-50 text-green-700 border-green-200" },
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200" },
  solved: { label: "Solved", className: "bg-gray-50 text-gray-600 border-gray-200" },
  closed: { label: "Closed", className: "bg-gray-100 text-gray-500 border-gray-200" },
};

const priorityConfig: Record<string, { label: string; dot: string }> = {
  low: { label: "Low", dot: "bg-gray-400" },
  normal: { label: "Normal", dot: "bg-blue-500" },
  high: { label: "High", dot: "bg-amber-500" },
  urgent: { label: "Urgent", dot: "bg-red-500" },
};

const channelIcons: Record<string, React.ElementType> = {
  email: Mail,
  web: Globe,
  phone: Phone,
  api: Code,
};

interface TicketTableProps {
  tickets: Ticket[];
}

export function TicketTable({ tickets }: TicketTableProps) {
  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12 text-center">#</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="hidden md:table-cell">Requester</TableHead>
            <TableHead className="hidden lg:table-cell">Assignee</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden sm:table-cell">Priority</TableHead>
            <TableHead className="hidden xl:table-cell">Channel</TableHead>
            <TableHead className="hidden lg:table-cell">Created</TableHead>
            <TableHead className="w-10" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-32 text-center text-muted-foreground">
                No tickets found
              </TableCell>
            </TableRow>
          ) : (
            tickets.map((ticket) => {
              const status = statusConfig[ticket.status];
              const priority = priorityConfig[ticket.priority];
              const ChannelIcon = channelIcons[ticket.channel] ?? Globe;

              return (
                <TableRow key={ticket.id} className="group">
                  <TableCell className="text-center text-xs text-muted-foreground font-mono">
                    {ticket.ticketNumber}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/tickets/${ticket.id}`}
                      className="font-medium text-sm hover:text-primary transition-colors line-clamp-1"
                    >
                      {ticket.subject}
                    </Link>
                    {ticket.tags.length > 0 && (
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {ticket.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-[10px] h-4 px-1 font-normal"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex items-center gap-2">
                      <Avatar className="size-6">
                        <AvatarFallback className="text-[10px]">
                          {ticket.requester?.name.slice(0, 2).toUpperCase() ?? "??"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground truncate max-w-32">
                        {ticket.requester?.name ?? "Unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {ticket.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarFallback className="text-[10px]">
                            {ticket.assignee.name.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground truncate max-w-28">
                          {ticket.assignee.name}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn("text-xs font-medium", status.className)}
                    >
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <div className="flex items-center gap-1.5">
                      <span className={cn("size-1.5 rounded-full", priority.dot)} />
                      <span className="text-xs text-muted-foreground">{priority.label}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <ChannelIcon className="size-3.5" />
                      <span className="text-xs capitalize">{ticket.channel}</span>
                    </div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
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
                            <MoreHorizontal className="size-4" />
                          </Button>
                        }
                      />
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem render={<Link href={`/tickets/${ticket.id}`} />}>
                          View ticket
                        </DropdownMenuItem>
                        <DropdownMenuItem>Assign to me</DropdownMenuItem>
                        <DropdownMenuItem>Mark as solved</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          Close ticket
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}
