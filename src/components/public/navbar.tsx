"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mosque, Menu, X, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME, PUBLIC_NAV_LINKS } from "@/lib/constants";
import LiveClock from "@/components/public/live-clock";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu whenever pathname changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const isLinkActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    if (href.startsWith("/#")) {
      return false;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
          aria-label={APP_NAME}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Mosque className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-foreground block leading-tight">
              {APP_NAME}
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold tracking-wide uppercase hidden sm:block">
              Multi-Mosque Timings
            </span>
          </div>
        </Link>

        {/* Center: Live Real-Time Clock Pill */}
        <div className="hidden sm:flex items-center">
          <LiveClock
            variant="badge"
            timezone="Asia/Kolkata"
            format="12h"
            showSeconds={true}
          />
        </div>

        {/* Desktop Navigation Links + Admin Button */}
        <div className="hidden items-center gap-3 md:flex">
          <nav className="flex items-center gap-1" aria-label="Main navigation">
            {PUBLIC_NAV_LINKS.map((link) => {
              const active = isLinkActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 font-bold text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-primary/30 text-xs font-semibold text-primary hover:bg-primary/10 transition-colors"
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Portal</span>
          </Link>
        </div>

        {/* Mobile: Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <LiveClock
            variant="minimal"
            timezone="Asia/Kolkata"
            format="12h"
            showSeconds={false}
            className="text-xs"
          />

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close main menu" : "Open main menu"}
          >
            {isOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Slide-down Panel */}
      <div
        id="mobile-menu"
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out md:hidden bg-white",
          isOpen
            ? "max-h-80 opacity-100 border-t border-border"
            : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        <div className="p-4 border-b border-border bg-muted/20">
          <LiveClock
            variant="badge"
            timezone="Asia/Kolkata"
            format="12h"
            showSeconds={true}
            className="w-full justify-center"
          />
        </div>

        <nav className="space-y-1 px-4 pt-2 pb-4 sm:px-6" aria-label="Mobile navigation">
          {PUBLIC_NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block rounded-xl px-3.5 py-2.5 text-base font-medium transition-colors",
                  active
                    ? "bg-primary/10 font-bold text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            );
          })}

          <Link
            href="/admin"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-primary bg-primary/10 mt-2"
          >
            <Shield className="w-4 h-4" />
            <span>Go to Admin Portal</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
