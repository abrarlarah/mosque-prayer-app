"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Clock,
  CalendarDays,
  Megaphone,
  Users,
  ScrollText,
  Settings,
  Mosque,
  LogOut,
  ChevronRight,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";

interface AdminSidebarProps {
  userRole?: "super_admin" | "mosque_admin";
  userName?: string;
  userEmail?: string;
}

export default function AdminSidebar({
  userRole = "super_admin",
  userName = "Chief Administrator",
  userEmail = "admin@salahtimes.org",
}: AdminSidebarProps) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Mosques", href: "/admin/mosques", icon: Building2, superAdminOnly: true },
    { label: "Prayer Timings", href: "/admin/prayer-times", icon: Clock },
    { label: "Jummah", href: "/admin/jummah", icon: CalendarDays },
    { label: "Announcements", href: "/admin/announcements", icon: Megaphone },
    { label: "Administrators", href: "/admin/administrators", icon: Users, superAdminOnly: true },
    { label: "Activity Logs", href: "/admin/activity-logs", icon: ScrollText },
    { label: "Settings", href: "/admin/settings", icon: Settings, superAdminOnly: true },
  ];

  const filteredNavItems = navItems.filter((item) => {
    if (item.superAdminOnly && userRole !== "super_admin") {
      return false;
    }
    return true;
  });

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between bg-primary text-primary-foreground">
      {/* Brand & Workspace */}
      <div>
        <div className="p-6 border-b border-primary-foreground/15">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-amber-300">
              <Mosque className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-lg leading-tight tracking-tight">
                {APP_NAME}
              </div>
              <div className="text-xs text-primary-foreground/75 font-medium flex items-center gap-1.5 mt-0.5">
                <Shield className="w-3 h-3 text-amber-300" />
                <span>
                  {userRole === "super_admin" ? "Super Admin" : "Mosque Admin"}
                </span>
              </div>
            </div>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1">
          {filteredNavItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-white text-primary shadow-sm font-semibold"
                    : "text-primary-foreground/80 hover:bg-white/10 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${active ? "text-primary" : "text-primary-foreground/70"}`} />
                  <span>{item.label}</span>
                </div>
                {active && <ChevronRight className="w-4 h-4 text-primary" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-primary-foreground/15">
        <div className="px-3 py-2 mb-2">
          <div className="text-sm font-semibold truncate">{userName}</div>
          <div className="text-xs text-primary-foreground/70 truncate">{userEmail}</div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-primary-foreground/80 hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Exit to Public Site</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          className="p-2.5 rounded-xl bg-primary text-primary-foreground shadow-md"
          aria-label="Toggle Navigation"
        >
          {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 shadow-lg z-30">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileOpen(false)}
          />
          <div className="relative w-72 max-w-xs h-full shadow-2xl z-50">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}
