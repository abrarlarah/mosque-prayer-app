import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getMosqueBySlug,
  getPrayerTimes,
  getJummahSessions,
  getMosqueAnnouncements,
  getSettings,
} from "@/lib/sample-data";
import { getCurrentDate, getHijriDate } from "@/lib/utils";
import PrayerTimesTable from "@/components/public/prayer-times-table";
import PrayerCountdown from "@/components/public/prayer-countdown";
import LiveClock from "@/components/public/live-clock";
import JummahDisplay from "@/components/public/jummah-display";
import AnnouncementCard from "@/components/public/announcement-card";
import {
  MapPin,
  Calendar,
  Phone,
  Mail,
  Globe,
  Tv,
  Info,
  Share2,
} from "lucide-react";

interface MosquePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: MosquePageProps) {
  const { slug } = await params;
  const mosque = getMosqueBySlug(slug);

  if (!mosque) {
    return {
      title: "Mosque Not Found",
    };
  }

  return {
    title: `${mosque.name} — Prayer Times & Jamat Schedule`,
    description: `Current Adhan, Iqamah, and Jummah prayer schedule for ${mosque.name} in ${mosque.city}, ${mosque.state}.`,
  };
}

export default async function MosqueDetailPage({ params }: MosquePageProps) {
  const { slug } = await params;
  const mosque = getMosqueBySlug(slug);

  if (!mosque) {
    notFound();
  }

  const prayers = getPrayerTimes(mosque.id);
  const jummahSessions = getJummahSessions(mosque.id);
  const announcements = getMosqueAnnouncements(mosque.id);
  const settings = getSettings(mosque.id);

  const currentDate = getCurrentDate(mosque.timezone);
  const hijriDate = settings.showHijriDate
    ? getHijriDate(mosque.timezone)
    : "";

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Mosque Header Banner */}
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-primary" />
              Verified Schedule
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              {mosque.name}
            </h1>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-3 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5 font-medium text-foreground/80">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                {mosque.address}, {mosque.city}, {mosque.state}
              </span>
              <span className="hidden sm:inline text-border">•</span>
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-accent shrink-0" />
                  {currentDate.formatted}
                </span>
                {hijriDate && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-primary/10 text-primary font-bold text-xs">
                    {hijriDate}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons & Live Clock */}
          <div className="flex flex-wrap items-center gap-3 self-start md:self-center">
            <LiveClock
              variant="badge"
              timezone={mosque.timezone}
              format={settings.timeFormat}
              showSeconds={true}
            />

            {settings.displayModeEnabled && (
              <Link
                href={`/mosques/${mosque.slug}/display`}
                target="_blank"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors shadow-sm"
                title="Open Digital TV Signage Display Mode"
              >
                <Tv className="w-4 h-4" />
                <span>TV Display</span>
              </Link>
            )}
          </div>
        </div>

        {mosque.description && (
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            {mosque.description}
          </p>
        )}
      </div>

      {/* Main Grid: Left = Schedule & Countdown; Right = Jummah, Announcements, Contact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Countdown + Table */}
        <div className="lg:col-span-8 space-y-8">
          {/* Live Countdown */}
          <PrayerCountdown
            prayers={prayers}
            timezone={mosque.timezone}
            timeFormat={settings.timeFormat}
          />

          {/* Daily Prayer Timetable */}
          <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6 pb-3 border-b border-border">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Today&apos;s Prayer Times
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Admin-managed congregational Iqamah and Adhan times
                </p>
              </div>
              <span className="px-2.5 py-1 text-xs rounded-md bg-secondary text-secondary-foreground font-medium">
                {settings.timeFormat === "24h" ? "24-Hour" : "12-Hour"}
              </span>
            </div>

            <PrayerTimesTable
              prayers={prayers}
              timezone={mosque.timezone}
              showAdhan={settings.showAdhanTimes}
              timeFormat={settings.timeFormat}
            />
          </div>
        </div>

        {/* Right Column: Jummah + Announcements + Mosque Info */}
        <div className="lg:col-span-4 space-y-8">
          {/* Jummah Schedule */}
          {jummahSessions.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="mb-4 pb-2 border-b border-border">
                <h3 className="text-lg font-bold text-foreground">
                  Jummah Timings
                </h3>
                <p className="text-xs text-muted-foreground">
                  Friday congregational prayer sessions
                </p>
              </div>
              <JummahDisplay
                sessions={jummahSessions}
                timeFormat={settings.timeFormat}
              />
            </div>
          )}

          {/* Active Announcements */}
          {announcements.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
              <div className="mb-4 pb-2 border-b border-border">
                <h3 className="text-lg font-bold text-foreground">
                  Announcements
                </h3>
                <p className="text-xs text-muted-foreground">
                  Notices &amp; updates from mosque administration
                </p>
              </div>
              <div className="space-y-4">
                {announcements.map((announcement) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Mosque Contact & Info Card */}
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-foreground mb-4 pb-2 border-b border-border">
              Mosque Details
            </h3>
            <div className="space-y-3.5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-foreground">Address</div>
                  <div className="text-muted-foreground">
                    {mosque.address}, {mosque.city}, {mosque.state}, {mosque.country}
                  </div>
                </div>
              </div>

              {mosque.contactNumber && (
                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Phone</div>
                    <a
                      href={`tel:${mosque.contactNumber}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {mosque.contactNumber}
                    </a>
                  </div>
                </div>
              )}

              {mosque.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Email</div>
                    <a
                      href={`mailto:${mosque.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {mosque.email}
                    </a>
                  </div>
                </div>
              )}

              {mosque.website && (
                <div className="flex items-start gap-3">
                  <Globe className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-foreground">Website</div>
                    <a
                      href={mosque.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline break-all"
                    >
                      {mosque.website}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
