"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/admin-header";
import { sampleMosques } from "@/lib/sample-data";
import { PRAYER_NAMES } from "@/lib/constants";
import { formatTime } from "@/lib/utils";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  Save,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface Override {
  id: string;
  date: string;
  prayerName: string;
  adhanTime: string | null;
  jamaatTime: string;
  reason: string;
  isEnabled: boolean;
}

interface PageProps {
  params: Promise<{ mosqueId: string }>;
}

export default function OverridesPage({ params }: PageProps) {
  const { mosqueId } = use(params);
  const mosque = sampleMosques.find((m) => m.id === mosqueId);

  if (!mosque) {
    notFound();
  }

  const [overrides, setOverrides] = useState<Override[]>([
    {
      id: "ov1",
      date: "2026-11-20",
      prayerName: "Asr",
      adhanTime: "15:30",
      jamaatTime: "16:00",
      reason: "Early winter adjustment",
      isEnabled: true,
    },
    {
      id: "ov2",
      date: "2026-11-20",
      prayerName: "Isha",
      adhanTime: "19:00",
      jamaatTime: "19:30",
      reason: "Early winter adjustment",
      isEnabled: true,
    },
  ]);

  // Form states for new override
  const [newDate, setNewDate] = useState("2026-11-21");
  const [newPrayer, setNewPrayer] = useState("Fajr");
  const [newAdhan, setNewAdhan] = useState("05:30");
  const [newJamaat, setNewJamaat] = useState("06:00");
  const [newReason, setNewReason] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  const handleAddOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJamaat) return;

    const newItem: Override = {
      id: String(Date.now()),
      date: newDate,
      prayerName: newPrayer,
      adhanTime: newAdhan || null,
      jamaatTime: newJamaat,
      reason: newReason || "Temporary Override",
      isEnabled: true,
    };

    setOverrides((prev) => [...prev, newItem]);
    setNewReason("");
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Remove this date-specific override?")) {
      setOverrides((prev) => prev.filter((o) => o.id !== id));
    }
  };

  return (
    <div>
      <AdminHeader
        title={`${mosque.name} — Date Overrides`}
        subtitle="Configure temporary high-precedence overrides for Ramadan, Eid, or special events."
        actions={
          <Link
            href={`/admin/prayer-times/${mosque.id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs sm:text-sm font-semibold hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Default Schedule</span>
          </Link>
        }
      />

      <div className="px-6 sm:px-8 max-w-5xl mx-auto space-y-8">
        {/* Info Banner */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs sm:text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            <strong>Highest Precedence:</strong> When an override exists for a specific date and prayer, it will strictly supersede both the monthly timetable and the default schedule on the public page and TV display.
          </span>
        </div>

        {isSaved && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">Override added and saved successfully!</span>
          </div>
        )}

        {/* Add New Override Form */}
        <form
          onSubmit={handleAddOverride}
          className="bg-card border border-border rounded-2xl p-6 shadow-sm"
        >
          <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary" />
            <span>Add Date-Specific Override</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Target Date *
              </label>
              <input
                type="date"
                required
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Prayer *
              </label>
              <select
                value={newPrayer}
                onChange={(e) => setNewPrayer(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                {PRAYER_NAMES.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Adhan Time
              </label>
              <input
                type="time"
                value={newAdhan}
                onChange={(e) => setNewAdhan(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Jamaat (Iqamah) *
              </label>
              <input
                type="time"
                required
                value={newJamaat}
                onChange={(e) => setNewJamaat(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background font-mono text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Reason / Note
              </label>
              <input
                type="text"
                placeholder="e.g. Ramadan / Winter"
                value={newReason}
                onChange={(e) => setNewReason(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-border flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/95 transition-all shadow-sm cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Apply Override</span>
            </button>
          </div>
        </form>

        {/* Existing Overrides Table */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-foreground mb-4">
            Active Overrides ({overrides.length})
          </h2>

          {overrides.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold">Prayer</th>
                    <th className="py-3 px-4 font-semibold">Adhan</th>
                    <th className="py-3 px-4 font-semibold">Jamaat</th>
                    <th className="py-3 px-4 font-semibold">Reason</th>
                    <th className="py-3 px-4 font-semibold text-right">Delete</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {overrides.map((ov) => (
                    <tr key={ov.id} className="hover:bg-muted/10">
                      <td className="py-3.5 px-4 font-mono font-semibold text-foreground">
                        {ov.date}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-primary">
                        {ov.prayerName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-xs">
                        {ov.adhanTime ? formatTime(ov.adhanTime, "12h") : "—"}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-foreground">
                        {formatTime(ov.jamaatTime, "12h")}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-muted-foreground">
                        {ov.reason}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(ov.id)}
                          className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                          title="Delete override"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-sm text-muted-foreground">
              No date-specific overrides configured. Timings will resolve using monthly or default schedules.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
