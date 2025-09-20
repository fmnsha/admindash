import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { RightSection } from "@/components/right-section"


export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex">
        <AppSidebar />
        <main className="flex-1 min-h-screen">
          <SidebarTrigger />
          <div className="p-6 pr-[400px]">
            {children}
          </div>
        </main>
        <RightSection />
      </div>
    </SidebarProvider>
  )
}