"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Ticket,
  Users,
  BarChart3,
  Settings,
  Zap,
  BookOpen,
  FileText,
  Shield,
  Clock,
  ChevronDown,
  LogOut,
} from "lucide-react"
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
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { logout } from "@/lib/actions/auth"
import { ThemeToggle } from "@/components/theme-toggle"

const navMain = [
  { title: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { title: "Tickets", href: "/tickets", icon: Ticket },
  { title: "Customers", href: "/customers", icon: Users },
  { title: "Reports", href: "/reports", icon: BarChart3 },
]

const navAdmin = [
  { title: "Automations", href: "/admin/automations", icon: Zap },
  { title: "SLA Policies", href: "/admin/sla", icon: Clock },
  { title: "Macros", href: "/admin/macros", icon: BookOpen },
  { title: "Knowledge Base", href: "/admin/knowledge", icon: FileText },
  { title: "Settings", href: "/settings", icon: Settings },
]

interface AppSidebarProps {
  user?: {
    id: string
    name: string
    email: string
    role: string
  }
}

export function AppSidebar({ user }: AppSidebarProps) {
  const pathname = usePathname()
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?"

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <Link href="/dashboard">
                  <div
                    className="flex aspect-square size-8 items-center justify-center rounded-lg"
                    style={{
                      background: "rgba(0,194,255,0.15)",
                      border: "1px solid rgba(0,194,255,0.3)",
                    }}
                  >
                    <Ticket className="size-4" style={{ color: "var(--rk-accent)" }} />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span
                      className="font-bold tracking-wide text-sm"
                      style={{ color: "var(--rk-accent)" }}
                    >
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
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/")
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
                            style={{
                              color: isActive ? "var(--rk-accent)" : "var(--rk-text2)",
                            }}
                          />
                          <span
                            style={{
                              color: isActive ? "var(--rk-text)" : "var(--rk-text2)",
                            }}
                          >
                            {item.title}
                          </span>
                        </span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              )
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
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/")
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    isActive={isActive}
                    tooltip={item.title}
                    render={
                      <Link href={item.href}>
                        <item.icon
                          className="size-4"
                          style={{
                            color: isActive ? "var(--rk-accent)" : "var(--rk-text2)",
                          }}
                        />
                        <span
                          style={{
                            color: isActive ? "var(--rk-text)" : "var(--rk-text2)",
                          }}
                        >
                          {item.title}
                        </span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              )
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
                        style={{
                          background: "rgba(0,194,255,0.15)",
                          color: "var(--rk-accent)",
                        }}
                      >
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5 leading-none">
                      <span
                        className="font-medium text-sm"
                        style={{ color: "var(--rk-text)" }}
                      >
                        {user?.name ?? "Guest"}
                      </span>
                      <span className="text-xs capitalize" style={{ color: "var(--rk-text3)" }}>
                        {user?.role ?? ""}
                      </span>
                    </div>
                    <ChevronDown
                      className="ml-auto size-4"
                      style={{ color: "var(--rk-text3)" }}
                    />
                  </SidebarMenuButton>
                }
              />
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
                align="start"
              >
                <DropdownMenuItem render={<Link href="/settings" />}>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  render={
                    <div className="flex items-center justify-between w-full">
                      <span>Theme</span>
                      <ThemeToggle />
                    </div>
                  }
                />
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  variant="destructive"
                  render={
                    <form action={logout}>
                      <button type="submit" className="flex items-center gap-2 w-full">
                        <LogOut className="size-4" />
                        Sign out
                      </button>
                    </form>
                  }
                />
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
