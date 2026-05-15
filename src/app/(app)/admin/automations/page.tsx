import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Zap } from "lucide-react";

const automations = [
  {
    id: "1",
    name: "Auto-assign urgent tickets to senior agents",
    trigger: "Ticket created",
    conditions: "Priority is Urgent",
    actions: "Assign to Senior Agents group",
    isActive: true,
    lastRun: "2 min ago",
  },
  {
    id: "2",
    name: "SLA breach notification",
    trigger: "SLA deadline approaching",
    conditions: "15 minutes before breach",
    actions: "Notify assignee + manager via email",
    isActive: true,
    lastRun: "1 hour ago",
  },
  {
    id: "3",
    name: "Close resolved tickets after 7 days",
    trigger: "Ticket status is Solved",
    conditions: "No reply for 7 days",
    actions: "Set status to Closed",
    isActive: false,
    lastRun: "3 days ago",
  },
  {
    id: "4",
    name: "Tag billing tickets automatically",
    trigger: "Ticket created",
    conditions: "Subject contains 'invoice' or 'billing' or 'charge'",
    actions: "Add tag: billing",
    isActive: true,
    lastRun: "5 min ago",
  },
];

export default function AutomationsPage() {
  return (
    <>
      <PageHeader
        title="Automations"
        description="Trigger-based rules to streamline your workflow"
        actions={
          <Button size="sm">
            <Plus className="size-3.5 mr-1" />
            New Automation
          </Button>
        }
      />
      <main className="flex-1 overflow-auto p-6 space-y-4">
        <div className="space-y-3">
          {automations.map((auto) => (
            <Card key={auto.id} className="shadow-none">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 p-1.5 rounded-md ${auto.isActive ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    <Zap className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <p className="text-sm font-medium">{auto.name}</p>
                      <Badge variant={auto.isActive ? "default" : "secondary"} className="text-[10px] h-4 px-1.5">
                        {auto.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <div><span className="font-medium text-foreground">When: </span>{auto.trigger}</div>
                      <div><span className="font-medium text-foreground">If: </span>{auto.conditions}</div>
                      <div><span className="font-medium text-foreground">Then: </span>{auto.actions}</div>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-2">Last ran {auto.lastRun}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Switch checked={auto.isActive} />
                    <Button variant="ghost" size="sm" className="h-7 text-xs">Edit</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
