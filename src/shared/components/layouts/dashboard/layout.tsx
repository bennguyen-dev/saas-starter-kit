import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/shared/components/ui/sidebar";
import { DashboardSidebar } from "./sidebar";
import { cn } from "@/shared/lib/utils";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <div
        id="content"
        className={cn(
          "ml-auto w-full max-w-full",
          "peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]",
          "peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]",
          "sm:transition-[width] sm:duration-200 sm:ease-linear",
          "flex h-svh flex-col",
          "group-data-[scroll-locked=1]/body:h-full",
          "has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh"
        )}
      >
        {children}
      </div>
    </SidebarProvider>
  );
}
