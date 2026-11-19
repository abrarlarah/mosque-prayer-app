"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/admin-header";
import { sampleMosques } from "@/lib/sample-data";
import { ANNOUNCEMENT_TYPES, ANNOUNCEMENT_PRIORITIES } from "@/lib/constants";
import { ArrowLeft, Save, Megaphone } from "lucide-react";

export default function NewAnnouncementPage() {
  const router = useRouter();
  const [mosqueId, setMosqueId] = useState(sampleMosques[0]?.id || "m1");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<string>("general");
  const [priority, setPriority] = useState<string>("normal");
  const [startDate, setStartDate] = useState("2026-11-18");
  const [endDate, setEndDate] = useState("2026-12-18");
  const [status, setStatus] = useState<"published" | "draft">("published");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Announcement "${title}" created and published!`);
    router.push("/admin/announcements");
  };

  return (
    <div>
      <AdminHeader
        title="Create Announcement"
        subtitle="Publish notices, Ramadan/Eid advisories, or timing change notices."
        actions={
          <Link
            href="/admin/announcements"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs sm:text-sm font-semibold hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel</span>
          </Link>
        }
      />

      <div className="px-6 sm:px-8 max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Target Mosque *
              </label>
              <select
                value={mosqueId}
                onChange={(e) => setMosqueId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {sampleMosques.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} ({m.city})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Announcement Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Winter Prayer Schedule Update"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Message Body *
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Detailed announcement content for the congregation..."
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Announcement Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {ANNOUNCEMENT_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t.replace("_", " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Priority Level *
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {ANNOUNCEMENT_PRIORITIES.map((p) => (
                  <option key={p} value={p}>
                    {p.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Display Start Date *
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Display End Date *
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Link
              href="/admin/announcements"
              className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/95 transition-all shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Publish Notice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
