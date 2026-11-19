"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/admin/admin-header";
import { User, Mail, Shield, Phone, Save, CheckCircle2 } from "lucide-react";

export default function AdminProfilePage() {
  const [name, setName] = useState("Chief Administrator");
  const [email, setEmail] = useState("superadmin@salahtimes.org");
  const [phone, setPhone] = useState("+91 94190 00000");
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div>
      <AdminHeader
        title="Admin Profile"
        subtitle="Manage your personal administrator contact information and credentials."
      />

      <div className="px-6 sm:px-8 max-w-3xl mx-auto space-y-6">
        {isSaved && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">Profile updated successfully!</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="flex items-center gap-4 pb-6 border-b border-border">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl">
              CA
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">{name}</h2>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span className="font-semibold text-primary">Super Administrator</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                required
                disabled
                value={email}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-muted/40 text-sm font-mono text-muted-foreground cursor-not-allowed"
              />
              <span className="text-[11px] text-muted-foreground mt-1 block">
                Email is tied to authentication and managed in Supabase Auth.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/95 transition-all shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
