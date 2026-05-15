"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <header
      className="flex h-14 shrink-0 items-center gap-2 px-4 border-b"
      style={{ borderColor: "var(--rk-border)", background: "var(--rk-surface)" }}
    >
      <SidebarTrigger className="-ml-1" style={{ color: "var(--rk-text2)" }} />
      <Separator orientation="vertical" className="h-4" style={{ background: "var(--rk-border)" }} />
      <div className="flex flex-1 items-center gap-4">
        <div className="flex-1">
          <h1 className="text-sm font-semibold leading-none" style={{ color: "var(--rk-text)" }}>{title}</h1>
          {description && (
            <p className="text-xs mt-0.5" style={{ color: "var(--rk-text3)" }}>{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 size-3.5" style={{ color: "var(--rk-text3)" }} />
            <Input
              placeholder="Search tickets..."
              className="h-8 w-56 pl-8 text-xs border-0"
              style={{ background: "var(--rk-surface2)", color: "var(--rk-text2)" }}
            />
          </div>
          <Button variant="ghost" size="icon" className="size-8 relative">
            <Bell className="size-4" style={{ color: "var(--rk-text2)" }} />
            <span
              className="absolute top-1.5 right-1.5 size-1.5 rounded-full"
              style={{ background: "var(--rk-accent)" }}
            />
          </Button>
          {actions}
        </div>
      </div>
    </header>
  );
}
