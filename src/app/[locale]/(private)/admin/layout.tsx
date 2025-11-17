"use client";
import { SidebarProvider, SidebarInset } from "@/components/ui/Sidebar";
import { AppSidebar } from "@/components/layout/admin/AppSidebar";
import { Header } from "@/components/layout/admin/Header";

export default function AdminLayout({ children }: any) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Header />
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
