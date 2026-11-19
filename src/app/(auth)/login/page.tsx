"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  Key,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Building2,
  Crown,
} from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin.bilal@salahtimes.org");
  const [password, setPassword] = useState("password123");
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const performLogin = (targetPath: string, roleTitle: string) => {
    setIsLoading(true);
    setSuccessMsg(`Signing in as ${roleTitle}...`);

    setTimeout(() => {
      try {
        localStorage.setItem("salah_auth_logged_in", "true");
        localStorage.setItem("salah_auth_role", roleTitle);
      } catch {}
      router.push(targetPath);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performLogin("/admin", "Administrator");
  };

  return (
    <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-xl">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4 border border-primary/20 shadow-xs">
          <Lock className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black tracking-tight text-foreground">
          Sign In to Admin Portal
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
          Manage prayer timetables, Jummah schedules, announcements, and mosque settings.
        </p>
      </div>

      {successMsg && (
        <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span className="font-medium">{successMsg}</span>
        </div>
      )}

      {/* ── 1-CLICK DEMO LOGIN BUTTONS ──────────────────────────────────── */}
      <div className="mb-6 p-4 rounded-2xl bg-muted/40 border border-border space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick 1-Click Access</span>
        </div>

        <button
          type="button"
          onClick={() =>
            performLogin(
              "/admin/prayer-times/m_bilal",
              "Jamia Bilal Mosque Admin"
            )
          }
          className="w-full py-2.5 px-3.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs hover:bg-primary/90 transition-all flex items-center justify-between shadow-xs cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Building2 className="w-4 h-4" />
            <span>Jamia Bilal Mosque Admin</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => performLogin("/admin", "Super Administrator")}
          className="w-full py-2.5 px-3.5 rounded-xl bg-secondary text-secondary-foreground font-semibold text-xs hover:bg-secondary/80 transition-all flex items-center justify-between border border-border shadow-xs cursor-pointer"
        >
          <span className="flex items-center gap-2">
            <Crown className="w-4 h-4 text-amber-500" />
            <span>Super Administrator</span>
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-3 text-muted-foreground font-semibold">
            Or sign in with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-bold text-foreground mb-1.5 uppercase tracking-wider"
          >
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@mosque.org"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-input bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label
              htmlFor="password"
              className="block text-xs font-bold text-foreground uppercase tracking-wider"
            >
              Password
            </label>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-muted-foreground">
              <Key className="w-4 h-4" />
            </div>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-input bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm hover:bg-primary/95 transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer mt-2"
        >
          {isLoading ? (
            <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
          ) : (
            <>
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-border/80 text-center">
        <Link
          href="/"
          className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
        >
          ← Return to Public Timetable
        </Link>
      </div>
    </div>
  );
}
