import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { auth } from "@/lib/auth"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  const user = session?.user
    ? {
        id: session.user.id,
        name: session.user.name ?? "Agent",
        email: session.user.email ?? "",
        role: (session.user as { role?: string }).role ?? "agent",
      }
    : undefined

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset
        className="flex flex-col min-h-screen overflow-hidden"
        style={{ background: "var(--rk-bg)" }}
      >
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}
