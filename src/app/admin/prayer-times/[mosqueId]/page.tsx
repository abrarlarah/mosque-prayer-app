"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdminHeader from "@/components/admin/admin-header";
import { sampleMosques, samplePrayerTimes, sampleJummahSchedules } from "@/lib/sample-data";
import { formatTime, shiftTime } from "@/lib/utils";
import {
  ArrowLeft,
  Save,
  Clock,
  Eye,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Layers,
  Zap,
  Building2,
} from "lucide-react";

interface PageProps {
  params: Promise<{ mosqueId: string }>;
}

export default function MosquePrayerEditorPage({ params }: PageProps) {
  const { mosqueId } = use(params);
  const mosque = sampleMosques.find((m) => m.id === mosqueId);

  if (!mosque) {
    notFound();
  }

  const initialPrayers = samplePrayerTimes[mosque.id] || [
    { name: "Fajr", adhanTime: "05:15", jamaatTime: "05:45", isEnabled: true },
    { name: "Dhuhr", adhanTime: "12:30", jamaatTime: "13:00", isEnabled: true },
    { name: "Asr", adhanTime: "15:45", jamaatTime: "16:15", isEnabled: true },
    { name: "Maghrib", adhanTime: "17:30", jamaatTime: "17:35", isEnabled: true },
    { name: "Isha", adhanTime: "19:15", jamaatTime: "19:45", isEnabled: true },
  ];

  const [prayers, setPrayers] = useState(initialPrayers);
  const [jummah, setJummah] = useState(() => {
    const defaultJ = sampleJummahSchedules[mosque.id]?.[0];
    return {
      khutbahTime: defaultJ?.khutbahTime || "12:45",
      jamaatTime: defaultJ?.jamaatTime || "13:15",
    };
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Load saved custom timings from local storage and sync live from database
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`prayer_times_${mosque.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPrayers(parsed);
          samplePrayerTimes[mosque.id] = parsed;
        }
      }

      const savedJ = localStorage.getItem(`jummah_${mosque.id}`);
      if (savedJ) {
        const parsedJ = JSON.parse(savedJ);
        if (Array.isArray(parsedJ) && parsedJ.length > 0) {
          setJummah({
            khutbahTime: parsedJ[0].khutbahTime || "12:45",
            jamaatTime: parsedJ[0].jamaatTime || "13:15",
          });
        }
      }
    } catch {}

    // Also fetch live authoritative timings from Supabase
    fetch(`/api/prayer-times?mosqueId=${mosque.id}&_t=${Date.now()}`, {
      cache: "no-store",
      headers: { "Cache-Control": "no-cache", Pragma: "no-cache" },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data?.success) {
          if (Array.isArray(data.prayers) && data.prayers.length > 0) {
            setPrayers(data.prayers);
            try {
              localStorage.setItem(`prayer_times_${mosque.id}`, JSON.stringify(data.prayers));
            } catch {}
          }
          if (Array.isArray(data.jummah) && data.jummah.length > 0) {
            setJummah({
              khutbahTime: data.jummah[0].khutbahTime || "12:45",
              jamaatTime: data.jummah[0].jamaatTime || "13:15",
            });
            try {
              localStorage.setItem(`jummah_${mosque.id}`, JSON.stringify(data.jummah));
            } catch {}
          }
        }
      })
      .catch(() => {});
  }, [mosque.id]);

  const handleTimeChange = (
    index: number,
    field: "adhanTime" | "jamaatTime",
    value: string
  ) => {
    setPrayers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
    setHasChanges(true);
    setIsSaved(false);
  };

  const handleToggle = (index: number) => {
    setPrayers((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], isEnabled: !next[index].isEnabled };
      return next;
    });
    setHasChanges(true);
    setIsSaved(false);
  };

  const validate = () => {
    for (const p of prayers) {
      if (p.isEnabled) {
        if (!p.jamaatTime) {
          return `${p.name} Jamaat time is required.`;
        }
        if (p.adhanTime && p.jamaatTime && p.adhanTime > p.jamaatTime) {
          // If Adhan is after Jamaat, warn
          return `Warning: ${p.name} Adhan (${p.adhanTime}) is scheduled after Jamaat (${p.jamaatTime}).`;
        }
      }
    }
    return null;
  };

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error && !error.startsWith("Warning")) {
      setValidationError(error);
      return;
    }

    setIsSaving(true);
    samplePrayerTimes[mosque.id] = prayers;
    try {
      localStorage.setItem(`prayer_times_${mosque.id}`, JSON.stringify(prayers));
    } catch {}

    const session = [
      {
        id: `j_${mosque.id}`,
        mosqueId: mosque.id,
        sessionNumber: 1,
        khutbahTime: jummah.khutbahTime,
        jamaatTime: jummah.jamaatTime,
        isEnabled: true,
      },
    ];
    try {
      localStorage.setItem(`jummah_${mosque.id}`, JSON.stringify(session));
      sampleJummahSchedules[mosque.id] = session;
    } catch {}

    // Save to Supabase cloud database
    try {
      await fetch("/api/prayer-times", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mosqueId: mosque.id, prayers, jummah }),
      });
    } catch (err) {
      console.error(err);
    }

    setIsSaving(false);
    setValidationError(null);
    setHasChanges(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 4000);
  };

  return (
    <div>
      <AdminHeader
        title={`${mosque.name} — Default Schedule`}
        subtitle="Manage permanent baseline Adhan and congregational Jamaat timings."
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/admin/prayer-times"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs sm:text-sm font-semibold hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
          </div>
        }
      />

      <div className="px-6 sm:px-8 max-w-5xl mx-auto space-y-6">
        {/* Sub-navigation tabs: Default, Monthly, Overrides */}
        <div className="flex flex-wrap gap-2 border-b border-border pb-3">
          <Link
            href={`/admin/prayer-times/${mosque.id}`}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-primary text-primary-foreground shadow-sm"
          >
            Default Schedule
          </Link>
          <Link
            href={`/admin/prayer-times/${mosque.id}/monthly`}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            Monthly Timetable (30 Days)
          </Link>
          <Link
            href={`/admin/prayer-times/${mosque.id}/overrides`}
            className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            Date-Specific Overrides
          </Link>
        </div>

        {/* Change Alerts */}
        {hasChanges && (
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 text-xs sm:text-sm flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span>You have unsaved changes to this schedule.</span>
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-400">
              Unpublished
            </span>
          </div>
        )}

        {isSaved && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">
              Changes published successfully to the live public site!
            </span>
          </div>
        )}

        {validationError && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Main Editor Card */}
        <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
            <div>
              <h2 className="text-xl font-bold text-foreground">
                Prayer Timetable Editor
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Set the canonical times for all 5 daily prayers
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPreviewMode(!previewMode)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all cursor-pointer ${
                  previewMode
                    ? "bg-secondary text-secondary-foreground border-primary/30"
                    : "border-border text-foreground hover:bg-muted"
                }`}
              >
                <Eye className="w-4 h-4" />
                <span>{previewMode ? "Hide Preview" : "Live Preview"}</span>
              </button>
            </div>
          </div>

          {/* Table of Prayers */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
                  <th className="py-3 px-4 font-semibold">Prayer</th>
                  <th className="py-3 px-4 font-semibold">Adhan (Call)</th>
                  <th className="py-3 px-4 font-semibold">Jamaat (Iqamah) *</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                  <th className="py-3 px-4 font-semibold text-right">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {prayers.map((prayer, idx) => (
                  <tr
                    key={prayer.name}
                    className={`hover:bg-muted/10 transition-colors ${
                      !prayer.isEnabled ? "opacity-50" : ""
                    }`}
                  >
                    <td className="py-4 px-4 font-bold text-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{prayer.name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <input
                        type="time"
                        value={prayer.adhanTime || ""}
                        disabled={!prayer.isEnabled}
                        onChange={(e) =>
                          handleTimeChange(idx, "adhanTime", e.target.value)
                        }
                        className="px-3 py-2 rounded-xl border border-input bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </td>

                    <td className="py-4 px-4">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const newTime = shiftTime(prayer.jamaatTime, -5);
                            handleTimeChange(idx, "jamaatTime", newTime);
                          }}
                          disabled={!prayer.isEnabled}
                          className="w-7 h-7 rounded-lg bg-muted border border-border hover:bg-muted/80 text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95 disabled:opacity-30 transition-all text-muted-foreground hover:text-foreground"
                          title="Subtract 5 minutes"
                        >
                          -5
                        </button>
                        <input
                          type="time"
                          required={prayer.isEnabled}
                          value={prayer.jamaatTime || ""}
                          disabled={!prayer.isEnabled}
                          onChange={(e) =>
                            handleTimeChange(idx, "jamaatTime", e.target.value)
                          }
                          className="px-2.5 py-2 rounded-xl border border-input bg-background font-mono text-sm font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 w-28 text-center"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newTime = shiftTime(prayer.jamaatTime, 5);
                            handleTimeChange(idx, "jamaatTime", newTime);
                          }}
                          disabled={!prayer.isEnabled}
                          className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95 disabled:opacity-30 transition-all text-primary"
                          title="Add 5 minutes"
                        >
                          +5
                        </button>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggle(idx)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                          prayer.isEnabled
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {prayer.isEnabled ? "Enabled" : "Disabled"}
                      </button>
                    </td>

                    <td className="py-4 px-4 text-right font-mono text-xs text-muted-foreground">
                      {formatTime(prayer.jamaatTime, "12h")}
                    </td>
                  </tr>
                ))}

                {/* Friday Jummah Row */}
                <tr className="hover:bg-amber-500/10 transition-colors bg-amber-500/5">
                  <td className="py-4 px-4 font-bold text-foreground">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>Jummah</span>
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-500/20 px-1.5 py-0.5 rounded">
                        Friday
                      </span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const newTime = shiftTime(jummah.khutbahTime, -5);
                          setJummah({ ...jummah, khutbahTime: newTime });
                          setHasChanges(true);
                        }}
                        className="w-7 h-7 rounded-lg bg-muted border border-border hover:bg-muted/80 text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-all text-muted-foreground hover:text-foreground"
                        title="Subtract 5 minutes"
                      >
                        -5
                      </button>
                      <input
                        type="time"
                        value={jummah.khutbahTime || "12:45"}
                        onChange={(e) => {
                          setJummah({ ...jummah, khutbahTime: e.target.value });
                          setHasChanges(true);
                        }}
                        className="px-2.5 py-2 rounded-xl border border-input bg-background font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 w-28 text-center"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newTime = shiftTime(jummah.khutbahTime, 5);
                          setJummah({ ...jummah, khutbahTime: newTime });
                          setHasChanges(true);
                        }}
                        className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-all text-primary"
                        title="Add 5 minutes"
                      >
                        +5
                      </button>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="inline-flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          const newTime = shiftTime(jummah.jamaatTime, -5);
                          setJummah({ ...jummah, jamaatTime: newTime });
                          setHasChanges(true);
                        }}
                        className="w-7 h-7 rounded-lg bg-muted border border-border hover:bg-muted/80 text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-all text-muted-foreground hover:text-foreground"
                        title="Subtract 5 minutes"
                      >
                        -5
                      </button>
                      <input
                        type="time"
                        required
                        value={jummah.jamaatTime || "13:15"}
                        onChange={(e) => {
                          setJummah({ ...jummah, jamaatTime: e.target.value });
                          setHasChanges(true);
                        }}
                        className="px-2.5 py-2 rounded-xl border border-primary/40 bg-background font-mono text-sm font-semibold text-primary focus:outline-none focus:ring-2 focus:ring-primary/30 w-28 text-center"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newTime = shiftTime(jummah.jamaatTime, 5);
                          setJummah({ ...jummah, jamaatTime: newTime });
                          setHasChanges(true);
                        }}
                        className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 text-xs font-bold flex items-center justify-center cursor-pointer active:scale-95 transition-all text-primary"
                        title="Add 5 minutes"
                      >
                        +5
                      </button>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-400">
                      Friday Weekly
                    </span>
                  </td>

                  <td className="py-4 px-4 text-right font-mono text-xs text-muted-foreground">
                    {formatTime(jummah.jamaatTime, "12h")}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Form Actions */}
          <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Changes apply instantly to the public timetable and digital signage displays.
            </span>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setPrayers(initialPrayers);
                  setHasChanges(false);
                }}
                disabled={!hasChanges}
                className="px-4 py-2.5 rounded-xl border border-border text-xs sm:text-sm font-semibold text-muted-foreground hover:bg-muted disabled:opacity-40 transition-colors cursor-pointer"
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={!hasChanges || isSaving}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:bg-primary/95 transition-all shadow-md disabled:opacity-40 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{isSaving ? "Publishing..." : "Publish Schedule"}</span>
              </button>
            </div>
          </div>
        </form>

        {/* Live Preview Card */}
        {previewMode && (
          <div className="bg-card border-2 border-primary/30 rounded-2xl p-6 shadow-md">
            <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span>Public Live Preview</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {prayers.map((p) => (
                <div
                  key={p.name}
                  className="p-4 rounded-xl bg-muted/40 border border-border text-center"
                >
                  <div className="text-xs uppercase font-bold text-muted-foreground">
                    {p.name}
                  </div>
                  <div className="text-lg font-mono font-bold text-foreground mt-1">
                    {formatTime(p.jamaatTime, "12h")}
                  </div>
                  {p.adhanTime && (
                    <div className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                      Adhan: {formatTime(p.adhanTime, "12h")}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
