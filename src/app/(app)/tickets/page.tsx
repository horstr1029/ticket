"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { TicketTable } from "@/components/ticket-table";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Filter, Search } from "lucide-react";
import Link from "next/link";
import type { Ticket } from "@/types";

const allTickets: Ticket[] = [
  {
    id: "1", ticketNumber: 1042, subject: "Cannot log in to my account after password reset",
    status: "open", priority: "high", channel: "email", tags: ["auth"],
    assigneeId: "a1", requesterId: "u1", groupId: null, slaDeadline: new Date(Date.now() + 3600000),
    solvedAt: null, createdAt: new Date(Date.now() - 7200000), updatedAt: new Date(),
    requester: { id: "u1", name: "Sarah Johnson", email: "sarah@example.com", role: "customer", avatarUrl: null, timezone: "UTC", isOnline: false, createdAt: new Date() },
    assignee: { id: "a1", name: "Mike Chen", email: "mike@co.com", role: "agent", avatarUrl: null, timezone: "UTC", isOnline: true, createdAt: new Date() },
  },
  {
    id: "2", ticketNumber: 1041, subject: "Billing invoice shows incorrect amount for March",
    status: "pending", priority: "normal", channel: "web", tags: ["billing"],
    assigneeId: null, requesterId: "u2", groupId: null, slaDeadline: null,
    solvedAt: null, createdAt: new Date(Date.now() - 18000000), updatedAt: new Date(),
    requester: { id: "u2", name: "Tom Williams", email: "tom@example.com", role: "customer", avatarUrl: null, timezone: "UTC", isOnline: false, createdAt: new Date() },
  },
  {
    id: "3", ticketNumber: 1040, subject: "Feature request: Export data as CSV",
    status: "new", priority: "low", channel: "web", tags: ["feature-request"],
    assigneeId: null, requesterId: "u3", groupId: null, slaDeadline: null,
    solvedAt: null, createdAt: new Date(Date.now() - 28800000), updatedAt: new Date(),
    requester: { id: "u3", name: "Priya Patel", email: "priya@example.com", role: "customer", avatarUrl: null, timezone: "UTC", isOnline: false, createdAt: new Date() },
  },
  {
    id: "4", ticketNumber: 1039, subject: "API integration returning 401 on all endpoints",
    status: "open", priority: "urgent", channel: "api", tags: ["api", "integration"],
    assigneeId: "a2", requesterId: "u4", groupId: null, slaDeadline: new Date(Date.now() + 1800000),
    solvedAt: null, createdAt: new Date(Date.now() - 3600000), updatedAt: new Date(),
    requester: { id: "u4", name: "DataCorp Inc.", email: "dev@datacorp.io", role: "customer", avatarUrl: null, timezone: "UTC", isOnline: true, createdAt: new Date() },
    assignee: { id: "a2", name: "Lisa Park", email: "lisa@co.com", role: "agent", avatarUrl: null, timezone: "UTC", isOnline: true, createdAt: new Date() },
  },
  {
    id: "5", ticketNumber: 1038, subject: "Mobile app crashes on iOS 17 when uploading files",
    status: "open", priority: "high", channel: "email", tags: ["mobile", "bug"],
    assigneeId: "a1", requesterId: "u5", groupId: null, slaDeadline: new Date(Date.now() + 5400000),
    solvedAt: null, createdAt: new Date(Date.now() - 10800000), updatedAt: new Date(),
    requester: { id: "u5", name: "Chris Anderson", email: "chris@example.com", role: "customer", avatarUrl: null, timezone: "UTC", isOnline: false, createdAt: new Date() },
    assignee: { id: "a1", name: "Mike Chen", email: "mike@co.com", role: "agent", avatarUrl: null, timezone: "UTC", isOnline: true, createdAt: new Date() },
  },
  {
    id: "6", ticketNumber: 1037, subject: "How do I set up two-factor authentication?",
    status: "solved", priority: "normal", channel: "web", tags: ["2fa", "how-to"],
    assigneeId: "a2", requesterId: "u6", groupId: null, slaDeadline: null,
    solvedAt: new Date(Date.now() - 3600000), createdAt: new Date(Date.now() - 86400000), updatedAt: new Date(),
    requester: { id: "u6", name: "Emma Davis", email: "emma@example.com", role: "customer", avatarUrl: null, timezone: "UTC", isOnline: false, createdAt: new Date() },
    assignee: { id: "a2", name: "Lisa Park", email: "lisa@co.com", role: "agent", avatarUrl: null, timezone: "UTC", isOnline: true, createdAt: new Date() },
  },
];

export default function TicketsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filtered = allTickets.filter((t) => {
    const matchesSearch =
      !search ||
      t.subject.toLowerCase().includes(search.toLowerCase()) ||
      String(t.ticketNumber).includes(search);
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || t.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const byStatus = (s: string) => allTickets.filter((t) => t.status === s);

  return (
    <>
      <PageHeader
        title="Tickets"
        description={`${allTickets.length} tickets total`}
        actions={
          <Link href="/tickets/new" className={buttonVariants({ size: "sm" })}>
            <Plus className="size-3.5 mr-1" />
            New Ticket
          </Link>
        }
      />
      <main className="flex-1 overflow-auto p-6 space-y-4">
        <Tabs defaultValue="all">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs">All ({allTickets.length})</TabsTrigger>
              <TabsTrigger value="open" className="text-xs">Open ({byStatus("open").length + byStatus("new").length})</TabsTrigger>
              <TabsTrigger value="pending" className="text-xs">Pending ({byStatus("pending").length})</TabsTrigger>
              <TabsTrigger value="solved" className="text-xs">Solved ({byStatus("solved").length})</TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search tickets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 pl-8 text-xs w-52"
                />
              </div>
              <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v ?? "all")}>
                <SelectTrigger className="h-8 text-xs w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="solved">Solved</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v ?? "all")}>
                <SelectTrigger className="h-8 text-xs w-32">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priorities</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="all" className="mt-4">
            <TicketTable tickets={filtered} />
          </TabsContent>
          <TabsContent value="open" className="mt-4">
            <TicketTable tickets={filtered.filter((t) => t.status === "open" || t.status === "new")} />
          </TabsContent>
          <TabsContent value="pending" className="mt-4">
            <TicketTable tickets={filtered.filter((t) => t.status === "pending")} />
          </TabsContent>
          <TabsContent value="solved" className="mt-4">
            <TicketTable tickets={filtered.filter((t) => t.status === "solved")} />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
