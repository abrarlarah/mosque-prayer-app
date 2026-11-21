import React from "react";
import AdminAuthGuard from "@/components/admin/admin-auth-guard";

export const metadata = {
  title: "Admin Dashboard | Salah Times",
  description: "Administrative control center for mosque prayer timings and schedules.",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminAuthGuard>{children}</AdminAuthGuard>;
}
