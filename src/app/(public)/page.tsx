import React from "react";
import Link from "next/link";
import HomepagePrayerBoard from "@/components/public/homepage-prayer-board";
import {
  getActiveMosques,
  getDefaultMosque,
} from "@/lib/sample-data";
import {
  Clock,
  Building2,
  Bell,
  ArrowRight,
  ShieldCheck,
  Compass,
} from "lucide-react";

export const metadata = {
  title: "Jamia Bilal Masjid — Live Prayer Timetable & Salah Times",
  description:
    "Official live 5 daily prayer timings, Adhan & Iqamah schedule for Jamia Bilal Masjid, Sherwani Colony, Khawajabagh, Baramulla.",
};

export default function HomePage() {
  const mosques = getActiveMosques();
  const defaultMosque = getDefaultMosque();

  return (
    <div className="flex flex-col">
      {/* ─── DIRECT 5 PRAYERS BOARD (JAMIA BILAL MASJID) ─────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-background pt-6 pb-12 sm:pt-8 sm:pb-16 border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ── DEDICATED PRAYER BOARD (DEFAULT MOSQUE) ────────── */}
          <HomepagePrayerBoard
            mosques={mosques}
            defaultMosque={defaultMosque}
          />

          {/* Clean banner to browse other mosques in directory */}
          <div className="max-w-5xl mx-auto mt-10 p-5 rounded-2xl bg-muted/40 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground">
                  Looking for prayer timings in another area?
                </h3>
                <p className="text-xs text-muted-foreground">
                  Filter mosques by District (Baramulla, Srinagar, Anantnag) and Town in our directory.
                </p>
              </div>
            </div>

            <Link
              href="/mosques"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/95 transition-all shadow-sm shrink-0"
            >
              <span>Browse All Mosques</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── ABOUT SECTION ─────────────────────────────────────────────────── */}
      <section id="about" className="py-20 bg-muted/30 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Accurate &amp; Connected Communities
            </h2>
            <p className="mt-3 text-lg text-muted-foreground">
              Directly managed by local mosque committees without reliance on automated astronomical calculations that drift from real congregational Iqamah times.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                All 5 Prayers at a Glance
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Check both Adhan and Iqamah times for Fajr, Dhuhr, Asr, Maghrib, and Isha directly from the homepage.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                District &amp; Town Discovery
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Filter mosques hierarchically: choose your district first, then narrow down town-by-town to locate your local masjid.
              </p>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Digital Signage Mode
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Dedicated fullscreen display mode for mosque TV screens showing live clocks, prayer highlights, and announcements.
              </p>
            </div>
          </div>

          {/* Admin CTA Banner */}
          <div className="mt-16 bg-primary text-primary-foreground rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-3">
                <ShieldCheck className="w-4 h-4" />
                <span>Multi-Mosque Management Platform</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold mb-2">
                Are you a Mosque Administrator?
              </h3>
              <p className="text-primary-foreground/80 max-w-xl text-sm sm:text-base">
                Log in to your administrative dashboard to update daily Iqamah times, publish 30-day monthly timetables, schedule Friday Jummah sessions, and post community notices.
              </p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white text-primary font-bold hover:bg-white/90 transition-all shadow-md whitespace-nowrap text-sm cursor-pointer"
            >
              <span>Admin Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
