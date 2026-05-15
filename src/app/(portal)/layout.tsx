import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { logout } from "@/lib/actions/auth"
import { Button } from "@/components/ui/button"
import { Ticket, LogOut, BookOpen } from "lucide-react"

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  const user = session.user as { name?: string | null; email?: string | null; role?: string }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--rk-bg)" }}>
      <header
        className="border-b px-6 py-3 flex items-center justify-between"
        style={{ borderColor: "var(--rk-border)", background: "var(--rk-surface)" }}
      >
        <Link href="/portal" className="flex items-center gap-2">
          <div
            className="flex items-center justify-center size-8 rounded-lg"
            style={{ background: "rgba(0,194,255,0.15)", border: "1px solid rgba(0,194,255,0.3)" }}
          >
            <Ticket className="size-4" style={{ color: "var(--rk-accent)" }} />
          </div>
          <span className="font-bold tracking-wide text-sm" style={{ color: "var(--rk-accent)" }}>
            HELPDESK
          </span>
          <span className="text-xs ml-1" style={{ color: "var(--rk-text3)" }}>
            Support Portal
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link
            href="/portal/help"
            className="text-xs flex items-center gap-1 hover:opacity-80"
            style={{ color: "var(--rk-text3)" }}
          >
            <BookOpen className="size-3.5" />
            Help Center
          </Link>
          <span className="text-xs" style={{ color: "var(--rk-text3)" }}>
            {user.name ?? user.email}
          </span>
          <form action={logout}>
            <Button variant="ghost" size="sm" type="submit" className="h-7 text-xs gap-1">
              <LogOut className="size-3.5" />
              Sign out
            </Button>
          </form>
        </div>
      </header>
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-8">
        {children}
      </main>
    </div>
  )
}
