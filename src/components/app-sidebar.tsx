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
      <SidebarHeader className="border-b border-sidebar-border py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <Link href="/dashboard">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg"
                    style={{ background: "rgba(0,194,255,0.15)", border: "1px solid rgba(0,194,255,0.3)" }}>
                    <Ticket className="size-4" style={{ color: "var(--rk-accent)" }} />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-bold tracking-wide text-sm" style={{ color: "var(--rk-accent)" }}>
                      HELPDESK
                    </span>
                    <span className="text-[10px]" style={{ color: "var(--rk-text3)" }}>
                      Support Platform
                    </span>
                  </div>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel
            className="text-[10px] uppercase tracking-widest font-semibold"
            style={{ color: "var(--rk-text3)" }}
          >
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
                          <item.icon
                            className="size-4"
                            style={{ color: isActive ? "var(--rk-accent)" : "var(--rk-text2)" }}
                          />
                          <span style={{ color: isActive ? "var(--rk-text)" : "var(--rk-text2)" }}>
                            {item.title}
                          </span>
                        </span>
                        {item.badge && (
                          <Badge
                            variant="secondary"
                            className="ml-auto h-4 min-w-4 text-[10px] px-1 border-0"
                            style={isActive
                              ? { background: "rgba(0,194,255,0.2)", color: "var(--rk-accent)" }
                              : { background: "var(--rk-surface2)", color: "var(--rk-text2)" }
                            }
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
          <SidebarGroupLabel
            className="text-[10px] uppercase tracking-widest font-semibold"
            style={{ color: "var(--rk-text3)" }}
          >
            Administration
          </SidebarGroupLabel>
          <SidebarMenu>
            {navAdmin.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.title}
                    render={
                      <Link href={item.href}>
                        <item.icon
                          className="size-4"
                          style={{ color: isActive ? "var(--rk-accent)" : "var(--rk-text2)" }}
                        />
                        <span style={{ color: isActive ? "var(--rk-text)" : "var(--rk-text2)" }}>
                          {item.title}
                        </span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton size="lg">
                    <Avatar className="size-8 rounded-lg">
                      <AvatarFallback
                        className="rounded-lg text-xs font-semibold"
                        style={{ background: "rgba(0,194,255,0.15)", color: "var(--rk-accent)" }}
                      >
                        JD
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span className="font-medium text-sm" style={{ color: "var(--rk-text)" }}>John Doe</span>
                      <span className="text-xs" style={{ color: "var(--rk-text3)" }}>Admin</span>
                    </div>
                    <ChevronDown className="ml-auto size-4" style={{ color: "var(--rk-text3)" }} />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent side="top" className="w-[--radix-popper-anchor-width]" align="start">
                <DropdownMenuItem render={<Link href="/settings/profile" />}>Profile</DropdownMenuItem>
                <DropdownMenuItem render={<Link href="/settings" />}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
