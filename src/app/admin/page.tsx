import React from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/admin-header";
import {
  sampleMosques,
  sampleAnnouncements,
  samplePrayerTimes,
} from "@/lib/sample-data";
import { formatTime, getCurrentDate } from "@/lib/utils";
import {
  Building2,
  Users,
  Clock,
  Megaphone,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Plus,
  Calendar,
} from "lucide-react";

export default function AdminDashboardPage() {
  const totalMosques = sampleMosques.length;
  const activeMosques = sampleMosques.filter((m) => m.status === "active").length;
  const totalAdmins = 8; // demo count
  const publishedAnnouncements = sampleAnnouncements.filter(
    (a) => a.status === "published"
  ).length;

  const currentDate = getCurrentDate("Asia/Kolkata");

  return (
    <div>
      <AdminHeader
        title="Administrative Overview"
        subtitle={`Live multi-mosque control center • ${currentDate.dayName}, ${currentDate.formatted}`}
        actions={
          <Link
            href="/admin/prayer-times"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:bg-primary/95 transition-all shadow-sm"
          >
            <Clock className="w-4 h-4" />
            <span>Update Timings</span>
          </Link>
        }
      />

      <div className="px-6 sm:px-8 max-w-7xl mx-auto space-y-8">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-muted-foreground">
                Total Mosques
              </span>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-foreground">
              {totalMosques}
            </div>
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                {activeMosques} active
              </span>
              <span>across 3 cities</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-muted-foreground">
                Registered Admins
              </span>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-foreground">
              {totalAdmins}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Super admins &amp; Mosque administrators
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-muted-foreground">
                Today&apos;s Schedules
              </span>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-foreground">100%</div>
            <div className="mt-2 text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>All active mosques synced</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold text-muted-foreground">
                Active Notices
              </span>
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                <Megaphone className="w-5 h-5" />
              </div>
            </div>
            <div className="text-3xl font-extrabold text-foreground">
              {publishedAnnouncements}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Published announcements live
            </div>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/admin/prayer-times"
              className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/40 transition-all flex items-center gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground">
                  Update Prayer Times
                </div>
                <div className="text-xs text-muted-foreground">
                  Adhan &amp; Iqamah times
                </div>
              </div>
            </Link>

            <Link
              href="/admin/mosques/new"
              className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/40 transition-all flex items-center gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground">
                  Register New Mosque
                </div>
                <div className="text-xs text-muted-foreground">
                  Add to directory
                </div>
              </div>
            </Link>

            <Link
              href="/admin/jummah"
              className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/40 transition-all flex items-center gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground">
                  Jummah Timetable
                </div>
                <div className="text-xs text-muted-foreground">
                  Friday prayer sessions
                </div>
              </div>
            </Link>

            <Link
              href="/admin/announcements/new"
              className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-muted/40 transition-all flex items-center gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground">
                  Post Announcement
                </div>
                <div className="text-xs text-muted-foreground">
                  Broadcast notices
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Mosques Overview Table & Recent Announcements */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Mosque Prayer Schedules Status */}
          <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  Mosques Schedule Status
                </h2>
                <p className="text-xs text-muted-foreground">
                  Configured daily congregational timings
                </p>
              </div>
              <Link
                href="/admin/mosques"
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
                    <th className="py-3 px-4 font-semibold">Mosque</th>
                    <th className="py-3 px-3 font-semibold">City</th>
                    <th className="py-3 px-3 font-semibold">Fajr</th>
                    <th className="py-3 px-3 font-semibold">Dhuhr</th>
                    <th className="py-3 px-3 font-semibold">Asr</th>
                    <th className="py-3 px-3 font-semibold">Maghrib</th>
                    <th className="py-3 px-3 font-semibold">Isha</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sampleMosques.map((mosque) => {
                    const times = samplePrayerTimes[mosque.id] || [];
                    const getTime = (name: string) =>
                      times.find((p) => p.name.toLowerCase() === name.toLowerCase())
                        ?.jamaatTime || "—";

                    return (
                      <tr key={mosque.id} className="hover:bg-muted/20 transition-colors">
                        <td className="py-3.5 px-4 font-medium text-foreground">
                          <Link
                            href={`/mosques/${mosque.slug}`}
                            className="hover:text-primary transition-colors font-semibold"
                          >
                            {mosque.name}
                          </Link>
                        </td>
                        <td className="py-3.5 px-3 text-muted-foreground text-xs">
                          {mosque.city}
                        </td>
                        <td className="py-3.5 px-3 font-mono text-xs">{getTime("Fajr")}</td>
                        <td className="py-3.5 px-3 font-mono text-xs">{getTime("Dhuhr")}</td>
                        <td className="py-3.5 px-3 font-mono text-xs">{getTime("Asr")}</td>
                        <td className="py-3.5 px-3 font-mono text-xs">{getTime("Maghrib")}</td>
                        <td className="py-3.5 px-3 font-mono text-xs">{getTime("Isha")}</td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            href={`/admin/prayer-times/${mosque.id}`}
                            className="text-xs text-primary font-semibold hover:underline"
                          >
                            Edit Timings
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right: Recent Announcements */}
          <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-border">
              <h3 className="text-base font-bold text-foreground">
                Active Announcements
              </h3>
              <Link
                href="/admin/announcements"
                className="text-xs text-primary font-semibold hover:underline"
              >
                Manage
              </Link>
            </div>

            <div className="space-y-4">
              {sampleAnnouncements.map((ann) => (
                <div
                  key={ann.id}
                  className="p-3.5 rounded-xl border border-border bg-muted/20"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-semibold text-xs text-foreground truncate">
                      {ann.title}
                    </span>
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {ann.type}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {ann.message}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
