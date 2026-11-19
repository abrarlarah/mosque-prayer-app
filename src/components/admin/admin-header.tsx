"use client";

import React from "react";
import Link from "next/link";
import { ExternalLink, Bell, User } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

export default function AdminHeader({
  title,
  subtitle,
  actions,
}: AdminHeaderProps) {
  return (
    <header className="bg-card border-b border-border py-4 px-6 sm:px-8 mb-8 sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-card/90">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {actions}
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            <span>Live Public Site</span>
            <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </header>
  );
}
