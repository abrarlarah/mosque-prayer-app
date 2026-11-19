import React from "react";
import AdminSidebar from "@/components/admin/admin-sidebar";

export const metadata = {
  title: "Admin Dashboard | Salah Times",
  description: "Administrative control center for mosque prayer timings and schedules.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar
        userRole="super_admin"
        userName="Super Administrator"
        userEmail="superadmin@salahtimes.org"
      />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 pb-16">{children}</main>
      </div>
    </div>
  );
}
