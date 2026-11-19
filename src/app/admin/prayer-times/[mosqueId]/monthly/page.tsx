"use client";

import React, { use, useState, useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/admin-header";
import { sampleMosques, samplePrayerTimes } from "@/lib/sample-data";
import { shiftTime } from "@/lib/prayer-utils";
import { PRAYER_NAMES } from "@/lib/constants";
import {
  ArrowLeft,
  Calendar,
  Save,
  Sliders,
  Copy,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from "lucide-react";

interface PageProps {
  params: Promise<{ mosqueId: string }>;
}

export default function MonthlyScheduleEditorPage({ params }: PageProps) {
  const { mosqueId } = use(params);
  const mosque = sampleMosques.find((m) => m.id === mosqueId);

  if (!mosque) {
    notFound();
  }

  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(11); // November
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [isSaved, setIsSaved] = useState(false);

  // Bulk shift states
  const [bulkPrayer, setBulkPrayer] = useState<string>("Asr");
  const [shiftMinutes, setShiftMinutes] = useState<number>(5);

  // Default baseline timings for generation
  const defaults = samplePrayerTimes[mosque.id] || [];

  // Generate days in month
  const daysInMonth = useMemo(() => {
    return new Date(selectedYear, selectedMonth, 0).getDate();
  }, [selectedYear, selectedMonth]);

  // Daily entries state: Map date string (YYYY-MM-DD) to prayer timings
  const [entries, setEntries] = useState<
    Record<
      number,
      Record<string, { adhan: string; jamaat: string }>
    >
  >(() => {
    const initial: Record<number, Record<string, { adhan: string; jamaat: string }>> = {};
    for (let day = 1; day <= 30; day++) {
      initial[day] = {};
      for (const p of defaults) {
        initial[day][p.name] = {
          adhan: p.adhanTime || "",
          jamaat: p.jamaatTime || "",
        };
      }
    }
    return initial;
  });

  const handleCellChange = (
    day: number,
    prayerName: string,
    field: "adhan" | "jamaat",
    val: string
  ) => {
    setEntries((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [prayerName]: {
          ...prev[day]?.[prayerName],
          [field]: val,
        },
      },
    }));
  };

  // Bulk Operation: Shift minutes for selected prayer across all days
  const handleApplyBulkShift = () => {
    if (shiftMinutes === 0) return;
    const confirmed = window.confirm(
      `Apply a ${shiftMinutes > 0 ? "+" : ""}${shiftMinutes} minute adjustment to ${bulkPrayer} Jamaat across all days in this month?`
    );

    if (confirmed) {
      setEntries((prev) => {
        const next = { ...prev };
        for (let day = 1; day <= daysInMonth; day++) {
          if (next[day]?.[bulkPrayer]) {
            const currentJamaat = next[day][bulkPrayer].jamaat;
            const shifted = shiftTime(currentJamaat, shiftMinutes);
            if (shifted) {
              next[day] = {
                ...next[day],
                [bulkPrayer]: {
                  ...next[day][bulkPrayer],
                  jamaat: shifted,
                },
              };
            }
          }
        }
        return next;
      });
      alert(`Applied ${shiftMinutes > 0 ? "+" : ""}${shiftMinutes} minutes to ${bulkPrayer}!`);
    }
  };

  // Bulk Operation: Copy Day 1 timings to all other days
  const handleCopyDayOneToAll = () => {
    const confirmed = window.confirm(
      "Copy Day 1 timings to all remaining days in this monthly schedule?"
    );
    if (confirmed) {
      setEntries((prev) => {
        const day1 = prev[1];
        const next: Record<number, Record<string, { adhan: string; jamaat: string }>> = {};
        for (let day = 1; day <= daysInMonth; day++) {
          next[day] = JSON.parse(JSON.stringify(day1));
        }
        return next;
      });
      alert("Copied Day 1 timings to all days!");
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const confirmed = window.confirm(
      `Publish monthly timetable for ${selectedMonth}/${selectedYear} (${daysInMonth} days) for ${mosque.name}?`
    );
    if (confirmed) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 4000);
    }
  };

  return (
    <div>
      <AdminHeader
        title={`${mosque.name} — Monthly Timetable`}
        subtitle="Create, edit, and bulk-adjust full monthly prayer schedules."
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

      <div className="px-6 sm:px-8 max-w-7xl mx-auto space-y-6">
        {/* Month Selector & Bulk Controls */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Period selector */}
          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-2 rounded-xl border border-input bg-background text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value={1}>January</option>
                <option value={2}>February</option>
                <option value={3}>March</option>
                <option value={4}>April</option>
                <option value={5}>May</option>
                <option value={6}>June</option>
                <option value={7}>July</option>
                <option value={8}>August</option>
                <option value={9}>September</option>
                <option value={10}>October</option>
                <option value={11}>November</option>
                <option value={12}>December</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 rounded-xl border border-input bg-background text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value={2026}>2026</option>
                <option value={2027}>2027</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
                className="px-3 py-2 rounded-xl border border-input bg-background text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="published">Published (Live)</option>
                <option value="draft">Draft (Internal)</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-xl bg-muted/40 border border-border">
            <span className="text-xs font-bold text-foreground flex items-center gap-1.5 mr-1">
              <Sliders className="w-3.5 h-3.5 text-primary" />
              <span>Bulk Shift:</span>
            </span>

            <select
              value={bulkPrayer}
              onChange={(e) => setBulkPrayer(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-input bg-background text-xs font-semibold"
            >
              {PRAYER_NAMES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              value={shiftMinutes}
              onChange={(e) => setShiftMinutes(Number(e.target.value))}
              className="px-2.5 py-1.5 rounded-lg border border-input bg-background text-xs font-semibold font-mono"
            >
              <option value={-15}>-15 mins</option>
              <option value={-10}>-10 mins</option>
              <option value={-5}>-5 mins</option>
              <option value={5}>+5 mins</option>
              <option value={10}>+10 mins</option>
              <option value={15}>+15 mins</option>
            </select>

            <button
              type="button"
              onClick={handleApplyBulkShift}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/95 cursor-pointer transition-all"
            >
              Apply Shift
            </button>

            <button
              type="button"
              onClick={handleCopyDayOneToAll}
              className="px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-semibold hover:bg-muted cursor-pointer transition-colors flex items-center gap-1"
              title="Copy Day 1 to All Days"
            >
              <Copy className="w-3 h-3 text-muted-foreground" />
              <span>Copy Day 1</span>
            </button>
          </div>
        </div>

        {isSaved && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">
              Monthly timetable saved and published successfully!
            </span>
          </div>
        )}

        {/* 30-Day Timetable Grid */}
        <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
            <h2 className="text-lg font-bold text-foreground">
              Timetable Entries ({daysInMonth} Days)
            </h2>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:bg-primary/95 transition-all shadow-sm cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Publish Month</span>
            </button>
          </div>

          <div className="overflow-x-auto max-h-[600px] overflow-y-auto border border-border rounded-xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-muted z-10">
                <tr className="border-b border-border font-semibold text-muted-foreground">
                  <th className="py-2.5 px-3">Date</th>
                  {PRAYER_NAMES.map((name) => (
                    <th key={name} className="py-2.5 px-3 text-center border-l border-border/60">
                      {name} (Jamaat)
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
                  const dayStr = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                  const isFriday = new Date(dayStr).getDay() === 5;

                  return (
                    <tr
                      key={day}
                      className={`hover:bg-muted/30 transition-colors ${
                        isFriday ? "bg-primary/5 font-semibold" : ""
                      }`}
                    >
                      <td className="py-2 px-3 whitespace-nowrap">
                        <span className="font-bold text-foreground mr-1.5">Day {day}</span>
                        {isFriday && (
                          <span className="text-[10px] uppercase font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10">
                            Jummah
                          </span>
                        )}
                      </td>

                      {PRAYER_NAMES.map((name) => {
                        const val = entries[day]?.[name]?.jamaat || "";
                        return (
                          <td key={name} className="py-1 px-2 text-center border-l border-border/40">
                            <input
                              type="time"
                              value={val}
                              onChange={(e) =>
                                handleCellChange(day, name, "jamaat", e.target.value)
                              }
                              className="px-2 py-1 rounded border border-input/60 bg-background font-mono text-xs text-center focus:outline-none focus:ring-1 focus:ring-primary w-24"
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/95 transition-all shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Publish Month</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
