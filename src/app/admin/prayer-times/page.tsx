import React from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/admin-header";
import { sampleMosques, samplePrayerTimes } from "@/lib/sample-data";
import { Clock, Calendar, AlertTriangle, ArrowRight, Settings2 } from "lucide-react";

export default function PrayerTimesAdminIndexPage() {
  return (
    <div>
      <AdminHeader
        title="Prayer Timings Management"
        subtitle="Configure daily default schedules, monthly timetables, and date-specific overrides."
      />

      <div className="px-6 sm:px-8 max-w-7xl mx-auto space-y-8">
        {/* Timing System Hierarchy Guidance */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 rounded-2xl p-6">
          <h2 className="text-base font-bold text-foreground mb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <span>3-Layer Timing Priority System</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-xs sm:text-sm">
            <div className="p-3 bg-card border border-border rounded-xl">
              <span className="font-bold text-primary block mb-0.5">
                Priority 1: Date-Specific Overrides
              </span>
              <p className="text-muted-foreground text-xs">
                Highest priority. Used for Ramadan, Eid, or emergency temporary timing changes.
              </p>
            </div>
            <div className="p-3 bg-card border border-border rounded-xl">
              <span className="font-bold text-primary block mb-0.5">
                Priority 2: Monthly Schedule
              </span>
              <p className="text-muted-foreground text-xs">
                Full 30-day timetable published for a specific calendar month.
              </p>
            </div>
            <div className="p-3 bg-card border border-border rounded-xl">
              <span className="font-bold text-primary block mb-0.5">
                Priority 3: Default Mosque Schedule
              </span>
              <p className="text-muted-foreground text-xs">
                Permanent baseline timings used when no monthly entry or override exists.
              </p>
            </div>
          </div>
        </div>

        {/* Mosques Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleMosques.map((mosque) => {
            const prayers = samplePrayerTimes[mosque.id] || [];

            return (
              <div
                key={mosque.id}
                className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-muted-foreground">
                      {mosque.city}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-700">
                      {mosque.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">
                    {mosque.name}
                  </h3>

                  {/* Summary of current timings */}
                  <div className="space-y-1.5 py-3 border-y border-border text-xs mb-4">
                    {prayers.map((p) => (
                      <div key={p.name} className="flex justify-between items-center">
                        <span className="text-muted-foreground font-medium">{p.name}</span>
                        <span className="font-mono font-bold text-foreground">
                          {p.jamaatTime || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Management Action Links */}
                <div className="space-y-2 pt-2">
                  <Link
                    href={`/admin/prayer-times/${mosque.id}`}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/95 transition-all shadow-sm"
                  >
                    <span>Edit Default Schedule</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <Link
                      href={`/admin/prayer-times/${mosque.id}/monthly`}
                      className="px-3 py-2 rounded-xl border border-border text-center font-medium hover:bg-muted transition-colors"
                    >
                      Monthly Timetable
                    </Link>
                    <Link
                      href={`/admin/prayer-times/${mosque.id}/overrides`}
                      className="px-3 py-2 rounded-xl border border-border text-center font-medium hover:bg-muted transition-colors"
                    >
                      Date Overrides
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
