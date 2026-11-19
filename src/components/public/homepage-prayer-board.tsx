"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Clock,
  Tv,
  ArrowRight,
  Star,
  Share2,
  ChevronDown,
  Timer,
  Volume2,
  Users,
} from "lucide-react";
import type { Mosque } from "@/types/mosque";
import { formatTime, getCurrentDate, getHijriDate, getNextPrayer, getTimeUntil } from "@/lib/utils";
import LiveClock from "@/components/public/live-clock";
import { getPrayerTimes, getJummahSessions } from "@/lib/sample-data";

interface HomepagePrayerBoardProps {
  mosques: Mosque[];
  defaultMosque: Mosque;
}

const LOCAL_STORAGE_KEY = "salah_times_preferred_mosque_id";

export default function HomepagePrayerBoard({
  mosques,
  defaultMosque,
}: HomepagePrayerBoardProps) {
  const [selectedMosqueId, setSelectedMosqueId] = useState<string>(defaultMosque.id);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(defaultMosque.district || "Baramulla");
  const [selectedTown, setSelectedTown] = useState<string>("all");

  // Load user's saved preference from localStorage
  useEffect(() => {
    try {
      const savedId = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedId) {
        const found = mosques.find((m) => m.id === savedId);
        if (found) {
          setSelectedMosqueId(found.id);
          setSelectedDistrict(found.district);
          setSelectedTown(found.town || "all");
        }
      }
    } catch {
      // Ignore
    }
  }, [mosques]);

  // Distinct districts from available mosques
  const districts = useMemo(() => {
    const list = mosques.map((m) => m.district).filter(Boolean);
    return Array.from(new Set(list)).sort();
  }, [mosques]);

  // Distinct towns for selected district
  const towns = useMemo(() => {
    const list = mosques
      .filter(
        (m) =>
          !selectedDistrict ||
          selectedDistrict === "all" ||
          m.district.toLowerCase() === selectedDistrict.toLowerCase()
      )
      .map((m) => m.town)
      .filter(Boolean) as string[];
    return Array.from(new Set(list)).sort();
  }, [mosques, selectedDistrict]);

  // Filtered mosques based on district & town
  const filteredMosques = useMemo(() => {
    const list = mosques.filter((m) => {
      if (
        selectedDistrict &&
        selectedDistrict !== "all" &&
        m.district.toLowerCase() !== selectedDistrict.toLowerCase()
      ) {
        return false;
      }
      if (
        selectedTown &&
        selectedTown !== "all" &&
        m.town?.toLowerCase() !== selectedTown.toLowerCase()
      ) {
        return false;
      }
      return true;
    });

    return list.sort((a, b) => {
      if (a.isDefault) return -1;
      if (b.isDefault) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [mosques, selectedDistrict, selectedTown]);

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district);
    setSelectedTown("all");

    const inDistrict = mosques.filter(
      (m) => district === "all" || m.district.toLowerCase() === district.toLowerCase()
    );

    if (inDistrict.length > 0) {
      const defaultInDist = inDistrict.find((m) => m.isDefault);
      const nextMosque = defaultInDist || inDistrict[0];
      setSelectedMosqueId(nextMosque.id);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, nextMosque.id);
      } catch {}
    }
  };

  const handleTownChange = (town: string) => {
    setSelectedTown(town);

    const inTown = mosques.filter((m) => {
      const matchDist =
        selectedDistrict === "all" ||
        m.district.toLowerCase() === selectedDistrict.toLowerCase();
      const matchTown = town === "all" || m.town?.toLowerCase() === town.toLowerCase();
      return matchDist && matchTown;
    });

    if (inTown.length > 0) {
      const defaultInTown = inTown.find((m) => m.isDefault);
      const nextMosque = defaultInTown || inTown[0];
      setSelectedMosqueId(nextMosque.id);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, nextMosque.id);
      } catch {}
    }
  };

  const handleMosqueChange = (mosqueId: string) => {
    setSelectedMosqueId(mosqueId);
    const m = mosques.find((item) => item.id === mosqueId);
    if (m) {
      setSelectedDistrict(m.district);
      if (m.town) {
        setSelectedTown(m.town);
      }
    }
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, mosqueId);
    } catch {}
  };

  const activeMosque = useMemo(() => {
    return mosques.find((m) => m.id === selectedMosqueId) || defaultMosque;
  }, [mosques, selectedMosqueId, defaultMosque]);

  const prayers = useMemo(() => {
    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem(`prayer_times_${activeMosque.id}`) : null;
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {}
    return getPrayerTimes(activeMosque.id);
  }, [activeMosque.id]);

  const jummahSessions = useMemo(() => {
    return getJummahSessions(activeMosque.id);
  }, [activeMosque.id]);

  const currentDate = getCurrentDate(activeMosque.timezone);
  const hijriDate = getHijriDate(activeMosque.timezone);

  // Live countdown state
  const [nextPrayer, setNextPrayer] = useState<{
    name: string;
    time: string;
    isNext: boolean;
  } | null>(null);

  const [countdown, setCountdown] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
  }>({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const update = () => {
      const next = getNextPrayer(prayers, activeMosque.timezone);
      setNextPrayer(next);
      if (next?.time) {
        const diff = getTimeUntil(next.time, activeMosque.timezone);
        setCountdown({
          hours: diff.hours,
          minutes: diff.minutes,
          seconds: diff.seconds,
        });
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [prayers, activeMosque.timezone]);

  // WhatsApp Share
  const handleShareWhatsApp = () => {
    const lines = [
      `🕌 *${activeMosque.name}*`,
      `📍 ${activeMosque.address}, ${activeMosque.city}`,
      `📅 ${currentDate.formatted} ${hijriDate ? `(${hijriDate})` : ""}`,
      "",
      "🕒 *Today's Congregational Prayer Times:*",
      ...prayers.map(
        (p) =>
          `• *${p.name}:* Jamaat at ${formatTime(p.jamaatTime, "12h")} (Adhan: ${formatTime(p.adhanTime, "12h")})`
      ),
    ];

    if (jummahSessions.length > 0) {
      lines.push("");
      lines.push(
        `🕋 *Friday Jummah:* Khutbah ${formatTime(jummahSessions[0].khutbahTime, "12h")} • Jamaat ${formatTime(jummahSessions[0].jamaatTime, "12h")}`
      );
    }

    lines.push("");
    lines.push(`🌐 Live timetable: ${window.location.origin}/mosques/${activeMosque.slug}`);

    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  return (
    <div className="bg-card border-2 border-primary/30 rounded-3xl p-6 sm:p-8 md:p-10 shadow-xl max-w-5xl mx-auto relative overflow-hidden">
      {/* ── TOP HEADER: Mosque Title, Location, Live Clock & District/Town Filters ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-6 border-b border-border">
        <div>
          {/* Badge & District / Town / Mosque Cascading Switcher */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Congregational Timings</span>
            </span>

            {/* District Filter Dropdown */}
            <div className="relative inline-flex items-center">
              <select
                id="district-filter"
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="appearance-none pl-2.5 pr-7 py-1 rounded-lg border border-border bg-secondary hover:bg-secondary/80 text-xs font-semibold text-secondary-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                title="Filter by District"
              >
                <option value="all">All Districts</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    District: {d}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2 top-2 pointer-events-none text-muted-foreground" />
            </div>

            {/* Town Filter Dropdown */}
            {towns.length > 0 && (
              <div className="relative inline-flex items-center">
                <select
                  id="town-filter"
                  value={selectedTown}
                  onChange={(e) => handleTownChange(e.target.value)}
                  className="appearance-none pl-2.5 pr-7 py-1 rounded-lg border border-border bg-muted/60 hover:bg-muted text-xs font-medium text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                  title="Filter by Town"
                >
                  <option value="all">
                    {selectedDistrict && selectedDistrict !== "all"
                      ? `All Towns (${selectedDistrict})`
                      : "All Towns"}
                  </option>
                  {towns.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 absolute right-2 top-2 pointer-events-none text-muted-foreground" />
              </div>
            )}

            {/* Mosque Selector Dropdown */}
            <div className="relative inline-flex items-center">
              <select
                id="mosque-filter"
                value={selectedMosqueId}
                onChange={(e) => handleMosqueChange(e.target.value)}
                className="appearance-none pl-2.5 pr-7 py-1 rounded-lg border border-primary/40 bg-card hover:bg-muted/50 text-xs font-bold text-foreground cursor-pointer focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                title="Select Mosque"
              >
                {filteredMosques.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.isDefault ? "⭐ " : ""}{m.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 absolute right-2 top-2 pointer-events-none text-primary" />
            </div>

            {/* Quick Reset to Default Mosque */}
            {selectedMosqueId !== defaultMosque.id && (
              <button
                type="button"
                onClick={() => {
                  setSelectedDistrict(defaultMosque.district);
                  setSelectedTown("all");
                  setSelectedMosqueId(defaultMosque.id);
                  try {
                    localStorage.setItem(LOCAL_STORAGE_KEY, defaultMosque.id);
                  } catch {}
                }}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold transition-colors cursor-pointer border border-amber-500/30 shrink-0"
                title="Reset to Jamia Bilal Masjid"
              >
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>Default: Jamia Bilal</span>
              </button>
            )}
          </div>

          {/* Direct Mosque Title */}
          <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">
            <Link
              href={`/mosques/${activeMosque.slug}`}
              className="hover:text-primary transition-colors"
            >
              {activeMosque.name}
            </Link>
          </h2>

          {/* Location & Date */}
          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-2 text-xs sm:text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5 font-medium text-foreground/85">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              {activeMosque.address}, {activeMosque.city}
            </span>
            <span className="hidden sm:inline text-border">•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
              {currentDate.formatted}
              {hijriDate && (
                <span className="text-primary font-semibold">
                  ({hijriDate})
                </span>
              )}
            </span>
          </div>
        </div>

        {/* Top Right: Live Clock & Action Pills */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-center">
          <LiveClock
            variant="badge"
            timezone={activeMosque.timezone}
            format="12h"
            showSeconds={true}
          />

          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
            title="Share via WhatsApp"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>

          <Link
            href={`/mosques/${activeMosque.slug}/display`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-xs"
            title="Open Fullscreen TV Display"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>TV Mode</span>
          </Link>
        </div>
      </div>

      {/* ── DIRECT 5 PRAYER TIMINGS (FRONT & CENTER) ── */}
      <div className="mt-8 space-y-6">
        {/* Five Prayers Cards Grid */}
        <div>
          <div className="flex items-center justify-between mb-3 text-xs uppercase tracking-wider font-bold text-muted-foreground">
            <span className="flex items-center gap-1.5 text-foreground font-extrabold text-sm normal-case">
              <Clock className="w-4 h-4 text-primary" />
              <span>Today&apos;s 5 Daily Prayer Timings</span>
            </span>
            <span className="text-primary font-bold">Adhan &amp; Iqamah</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {prayers.map((prayer) => {
              const isTarget =
                nextPrayer?.name.toLowerCase() === prayer.name.toLowerCase();

              return (
                <div
                  key={prayer.name}
                  className={`rounded-2xl p-4 sm:p-5 text-center transition-all border flex flex-col justify-between ${
                    isTarget
                      ? "bg-primary text-primary-foreground border-primary shadow-lg ring-4 ring-primary/20 scale-102 z-10"
                      : "bg-muted/40 border-border hover:border-primary/40 hover:bg-muted/60"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      <span
                        className={`text-xs font-extrabold uppercase tracking-wider ${
                          isTarget ? "text-primary-foreground/90" : "text-muted-foreground"
                        }`}
                      >
                        {prayer.name}
                      </span>
                      {isTarget && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                      )}
                    </div>

                    {/* Jamaat / Iqamah Time (Largest) */}
                    <div className="my-1">
                      <div
                        className={`text-xs font-bold uppercase tracking-wider mb-0.5 ${
                          isTarget ? "text-primary-foreground/80" : "text-primary"
                        }`}
                      >
                        Jamaat
                      </div>
                      <div
                        className={`text-3xl sm:text-4xl font-mono font-black tracking-tight ${
                          isTarget ? "text-white" : "text-foreground"
                        }`}
                      >
                        {formatTime(prayer.jamaatTime, "12h")}
                      </div>
                    </div>
                  </div>

                  {/* Adhan Time */}
                  <div
                    className={`mt-3 pt-2.5 border-t text-xs font-mono ${
                      isTarget
                        ? "border-primary-foreground/20 text-primary-foreground/80"
                        : "border-border text-muted-foreground"
                    }`}
                  >
                    Adhan:{" "}
                    <strong className={isTarget ? "text-white font-bold" : "text-foreground font-semibold"}>
                      {formatTime(prayer.adhanTime, "12h")}
                    </strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Next Prayer Live Countdown Bar */}
        {nextPrayer && (
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/25 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-xs shrink-0">
                <Timer className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
                  Upcoming Congregational Prayer
                </span>
                <div className="text-xl sm:text-2xl font-extrabold text-foreground">
                  {nextPrayer.name}{" "}
                  <span className="text-sm sm:text-base font-semibold text-primary font-mono">
                    at {formatTime(nextPrayer.time, "12h")}
                  </span>
                </div>
              </div>
            </div>

            {/* Countdown Clock */}
            <div className="flex items-center gap-2 bg-card border border-primary/30 px-5 py-2.5 rounded-xl shadow-xs">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
                Starts In:
              </span>
              <div className="font-mono font-black text-2xl text-primary tabular-nums">
                {String(countdown.hours).padStart(2, "0")}:
                {String(countdown.minutes).padStart(2, "0")}:
                {String(countdown.seconds).padStart(2, "0")}
              </div>
            </div>
          </div>
        )}

        {/* Jummah Timing Bar */}
        {jummahSessions.length > 0 && (
          <div className="p-4 rounded-2xl bg-muted/40 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-primary uppercase text-xs tracking-wider">
                Friday Jummah:
              </span>
              <span className="font-medium text-foreground">
                Khutbah:{" "}
                <strong className="font-mono text-primary font-bold">
                  {formatTime(jummahSessions[0].khutbahTime, "12h")}
                </strong>
                {" • "}
                Jamaat:{" "}
                <strong className="font-mono text-primary font-bold">
                  {formatTime(jummahSessions[0].jamaatTime, "12h")}
                </strong>
              </span>
            </div>
            <span className="text-xs text-muted-foreground">
              {activeMosque.name} ({activeMosque.town || activeMosque.city})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
