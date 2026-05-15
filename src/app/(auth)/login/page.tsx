"use client"

import { useActionState } from "react"
import { login } from "@/lib/actions/auth"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Ticket } from "lucide-react"

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <div
      className="w-full max-w-sm space-y-6 p-8 rounded-2xl border"
      style={{ background: "var(--rk-surface)", borderColor: "var(--rk-border)" }}
    >
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div
            className="size-12 rounded-xl flex items-center justify-center"
            style={{
              background: "rgba(0,194,255,0.15)",
              border: "1px solid rgba(0,194,255,0.3)",
            }}
          >
            <Ticket className="size-6" style={{ color: "var(--rk-accent)" }} />
          </div>
        </div>
        <h1 className="text-xl font-bold" style={{ color: "var(--rk-text)" }}>
          HelpDesk
        </h1>
        <p className="text-sm" style={{ color: "var(--rk-text3)" }}>
          Sign in to your workspace
        </p>
      </div>

      <form action={action} className="space-y-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="email"
            className="text-xs font-medium"
            style={{ color: "var(--rk-text2)" }}
          >
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="agent@company.com"
            required
            autoComplete="email"
            className="h-9 text-sm"
          />
        </div>
        <div className="space-y-1.5">
          <Label
            htmlFor="password"
            className="text-xs font-medium"
            style={{ color: "var(--rk-text2)" }}
          >
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
            className="h-9 text-sm"
          />
        </div>

        {state?.error && (
          <p className="text-xs" style={{ color: "#ff4757" }}>
            {state.error}
          </p>
        )}

        <Button type="submit" className="w-full h-9 text-sm" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-xs" style={{ color: "var(--rk-text3)" }}>
        Demo: admin@helpdesk.io / admin123
      </p>
    </div>
  )
}
