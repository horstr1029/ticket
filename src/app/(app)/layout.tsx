import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset
        className="flex flex-col min-h-screen overflow-hidden"
        style={{ background: "var(--rk-bg)" }}
      >
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
