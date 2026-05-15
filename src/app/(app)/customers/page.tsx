import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import { Search, Mail, ExternalLink } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

const customers = [
  { id: "u1", name: "Sarah Johnson", email: "sarah@example.com", tickets: 8, open: 2, lastSeen: new Date(Date.now() - 7200000), plan: "Pro" },
  { id: "u2", name: "Tom Williams", email: "tom@example.com", tickets: 3, open: 1, lastSeen: new Date(Date.now() - 86400000), plan: "Free" },
  { id: "u3", name: "Priya Patel", email: "priya@example.com", tickets: 12, open: 0, lastSeen: new Date(Date.now() - 259200000), plan: "Enterprise" },
  { id: "u4", name: "DataCorp Inc.", email: "dev@datacorp.io", tickets: 24, open: 3, lastSeen: new Date(Date.now() - 1800000), plan: "Enterprise" },
  { id: "u5", name: "Chris Anderson", email: "chris@example.com", tickets: 5, open: 1, lastSeen: new Date(Date.now() - 43200000), plan: "Pro" },
  { id: "u6", name: "Emma Davis", email: "emma@example.com", tickets: 2, open: 0, lastSeen: new Date(Date.now() - 604800000), plan: "Free" },
];

const planColors: Record<string, string> = {
  Free: "bg-gray-100 text-gray-600",
  Pro: "bg-blue-50 text-blue-700",
  Enterprise: "bg-purple-50 text-purple-700",
};

export default function CustomersPage() {
  return (
    <>
      <PageHeader title="Customers" description={`${customers.length} customers`} />
      <main className="flex-1 overflow-auto p-6 space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2 size-3.5 text-muted-foreground" />
            <Input placeholder="Search customers..." className="h-8 pl-8 text-xs" />
          </div>
        </div>

        <div className="rounded-lg border bg-card divide-y">
          {customers.map((customer) => (
            <div key={customer.id} className="flex items-center gap-4 px-4 py-3 hover:bg-muted/30 transition-colors">
              <Avatar className="size-9 shrink-0">
                <AvatarFallback className="text-xs">
                  {customer.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium truncate">{customer.name}</p>
                  <Badge variant="secondary" className={`text-[10px] h-4 px-1.5 ${planColors[customer.plan]}`}>
                    {customer.plan}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <Mail className="size-3" />
                  {customer.email}
                </p>
              </div>
              <div className="hidden md:flex items-center gap-6 text-xs text-muted-foreground">
                <div className="text-center">
                  <p className="font-medium text-foreground">{customer.tickets}</p>
                  <p>tickets</p>
                </div>
                <div className="text-center">
                  <p className={`font-medium ${customer.open > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                    {customer.open}
                  </p>
                  <p>open</p>
                </div>
                <div>
                  <p>Last seen {formatDistanceToNow(customer.lastSeen, { addSuffix: true })}</p>
                </div>
              </div>
              <Link
                href={`/customers/${customer.id}`}
                className={buttonVariants({ variant: "ghost", size: "icon-sm" })}
              >
                <ExternalLink className="size-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
