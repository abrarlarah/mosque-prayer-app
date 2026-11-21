"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { ShieldAlert, Loader2 } from "lucide-react";

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [role, setRole] = useState<string>("Administrator");

  useEffect(() => {
    try {
      const loggedIn = localStorage.getItem("salah_auth_logged_in") === "true";
      const hasCookie = document.cookie
        .split(";")
        .some((c) => c.trim().startsWith("salah_auth_logged_in=true"));

      if (!loggedIn && !hasCookie) {
        setIsAuthenticated(false);
        const loginUrl = `/login?redirect=${encodeURIComponent(pathname || "/admin")}`;
        router.replace(loginUrl);
      } else {
        const savedRole = localStorage.getItem("salah_auth_role") || "Administrator";
        setRole(savedRole);
        // Ensure cookie is in sync with localStorage
        if (loggedIn && !hasCookie) {
          document.cookie = "salah_auth_logged_in=true; path=/; max-age=604800; SameSite=Lax";
        }
        setIsAuthenticated(true);
      }
    } catch {
      setIsAuthenticated(false);
      router.replace("/login");
    }
  }, [router, pathname]);

  // Loading spinner while verifying authentication
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 bg-card border border-border p-8 rounded-3xl shadow-xl max-w-sm text-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm font-bold text-foreground">Verifying admin access...</p>
          <p className="text-xs text-muted-foreground">Checking authentication credentials</p>
        </div>
      </div>
    );
  }

  // Access denied screen while redirecting
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-muted/20 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 bg-card border border-destructive/30 p-8 rounded-3xl shadow-xl max-w-sm text-center">
          <ShieldAlert className="w-10 h-10 text-destructive" />
          <p className="text-base font-black text-foreground">Access Restricted</p>
          <p className="text-xs text-muted-foreground">
            Only authorized mosque administrators can access this portal. Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  const userRole = role.toLowerCase().includes("super") ? "super_admin" : "mosque_admin";

  return (
    <div className="flex min-h-screen bg-muted/20">
      <AdminSidebar
        userRole={userRole}
        userName={role}
        userEmail="admin@salahtimes.org"
      />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 pb-16">{children}</main>
      </div>
    </div>
  );
}
