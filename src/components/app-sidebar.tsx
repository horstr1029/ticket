"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  Users,
  BarChart3,
  Settings,
  Zap,
  BookOpen,
  Shield,
  ChevronDown,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const navMain = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Tickets", href: "/tickets", icon: Ticket, badge: 12 },
  { title: "Customers", href: "/customers", icon: Users },
  { title: "Reports", href: "/reports", icon: BarChart3 },
];

const navAdmin = [
  { title: "Automations", href: "/admin/automations", icon: Zap },
  { title: "Knowledge Base", href: "/admin/knowledge", icon: BookOpen },
  { title: "Roles & Permissions", href: "/admin/roles", icon: Shield },
  { title: "Settings", href: "/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <Link href="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <Ticket className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold text-sidebar-foreground">HelpDesk</span>
                    <span className="text-xs text-sidebar-foreground/60">Support Platform</span>
                  </div>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-[10px] tracking-widest">
            Main
          </SidebarGroupLabel>
          <SidebarMenu>
            {navMain.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.title}
                    render={
                      <Link href={item.href} className="flex items-center justify-between w-full">
                        <span className="flex items-center gap-2">
                          <item.icon className="size-4" />
                          <span>{item.title}</span>
                        </span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className={cn(
                              "ml-auto h-5 min-w-5 text-[10px] px-1",
                              isActive
                                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                                : "bg-sidebar-accent text-sidebar-accent-foreground"
                            )}
                          >
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-[10px] tracking-widest">
            Administration
          </SidebarGroupLabel>
          <SidebarMenu>
            {navAdmin.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href || pathname.startsWith(item.href + "/")}
                  tooltip={item.title}
                  render={
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  }
                />
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarFallback className="rounded-lg bg-sidebar-primary text-sidebar-primary-foreground text-xs">
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-medium text-sidebar-foreground text-sm">John Doe</span>
                      <span className="text-xs text-sidebar-foreground/60">Admin</span>
                    </div>
                    <ChevronDown className="ml-auto size-4 text-sidebar-foreground/60" />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
                align="start"
              >
                <DropdownMenuItem render={<Link href="/settings/profile" />}>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/settings" />}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
