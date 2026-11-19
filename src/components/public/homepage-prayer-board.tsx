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
  Sun,
  CloudSun,
  Sunset,
  Moon,
  Sunrise,
  Check,
  Building2,
  Megaphone,
  Compass,
  Sparkles,
} from "lucide-react";
import type { Mosque } from "@/types/mosque";
import {
  formatTime,
  getCurrentDate,
  getHijriDate,
  getNextPrayer,
  getTimeUntil,
} from "@/lib/utils";
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
  const [userDefaultMosqueId, setUserDefaultMosqueId] = useState<string>(defaultMosque.id);
  const [selectedDistrict, setSelectedDistrict] = useState<string>(defaultMosque.district || "Baramulla");
  const [selectedTown, setSelectedTown] = useState<string>("all");
  const [filterMode, setFilterMode] = useState<"both" | "adhan">("both");
  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load user's saved preference from localStorage
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedId = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedId) {
        setUserDefaultMosqueId(savedId);
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
  };

  // Set selected mosque as user's personal default
  const handleSetAsDefault = () => {
    setUserDefaultMosqueId(selectedMosqueId);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, selectedMosqueId);
    } catch {}
    setSavedFeedback(`"${activeMosque.name}" saved as your default mosque!`);
    setTimeout(() => setSavedFeedback(null), 3500);
  };

  const activeMosque = useMemo(() => {
    return mosques.find((m) => m.id === selectedMosqueId) || defaultMosque;
  }, [mosques, selectedMosqueId, defaultMosque]);

  const isUserDefault = isMounted && selectedMosqueId === userDefaultMosqueId;

  const prayers = useMemo(() => {
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
    lines.push(`🌐 Live timetable: ${typeof window !== "undefined" ? window.location.origin : ""}/mosques/${activeMosque.slug}`);

    const text = encodeURIComponent(lines.join("\n"));
    window.open(`https://wa.me/?text=${text}`, "_blank");
  };

  // Helper prayer icon selector
  const getPrayerIcon = (name: string, isTarget: boolean) => {
    const iconClass = isTarget ? "w-6 h-6 text-amber-300" : "w-6 h-6 text-primary";
    switch (name.toLowerCase()) {
      case "fajr":
        return <Sunrise className={iconClass} />;
      case "dhuhr":
        return <Sun className={iconClass} />;
      case "asr":
        return <CloudSun className={iconClass} />;
      case "maghrib":
        return <Sunset className={iconClass} />;
      case "isha":
        return <Moon className={iconClass} />;
      default:
        return <Clock className={iconClass} />;
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* ── TOAST NOTIFICATION WHEN DEFAULT MOSQUE IS SAVED ── */}
      {savedFeedback && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-emerald-700 text-white shadow-2xl flex items-center gap-3 border border-emerald-500 animate-in fade-in slide-in-from-top-4 duration-200">
          <Star className="w-5 h-5 fill-amber-300 text-amber-300 shrink-0" />
          <span className="text-xs sm:text-sm font-semibold">{savedFeedback}</span>
        </div>
      )}

      {/* ── TOP ISLAMIC HEADER & CASCADING FILTER BAR (2 CLEAN LINES) ──── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c3327] via-[#09271e] to-[#041510] text-white p-4 sm:p-5 shadow-xl border border-emerald-800/40">
        {/* Luminous Full Moon decorative motif */}
        <div className="absolute right-5 top-2.5 pointer-events-none opacity-25">
          <svg className="w-28 h-28" viewBox="0 0 100 100" fill="none">
            <defs>
              <radialGradient id="fullMoonGlow" cx="50%" cy="50%" r="50%" fx="42%" fy="42%">
                <stop offset="0%" stopColor="#fff8db" stopOpacity="0.5" />
                <stop offset="60%" stopColor="#fef08a" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#fef08a" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="moonBody" cx="45%" cy="45%" r="48%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#fde047" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#ca8a04" stopOpacity="0.2" />
              </radialGradient>
            </defs>
            {/* Outer Glow Aura */}
            <circle cx="50" cy="50" r="48" fill="url(#fullMoonGlow)" />
            {/* Full Moon Disc */}
            <circle cx="50" cy="50" r="34" fill="url(#moonBody)" stroke="#fef08a" strokeWidth="1" strokeOpacity="0.4" />
            {/* Subtle lunar maria / crater details */}
            <circle cx="42" cy="38" r="5" fill="#a16207" fillOpacity="0.12" />
            <circle cx="58" cy="46" r="6.5" fill="#a16207" fillOpacity="0.1" />
            <circle cx="47" cy="58" r="4.5" fill="#a16207" fillOpacity="0.1" />
            <circle cx="37" cy="52" r="3.5" fill="#a16207" fillOpacity="0.08" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col gap-2.5">
          {/* Line 1: District & Town Dropdowns */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* District Filter Dropdown */}
            <div className="relative inline-flex items-center">
              <label htmlFor="district-select" className="sr-only">Filter by District</label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 absolute left-3 top-2.5 pointer-events-none text-emerald-400" />
                <select
                  id="district-select"
                  value={selectedDistrict}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="appearance-none pl-8 pr-7 py-1.5 rounded-full border border-emerald-700/60 bg-emerald-950/80 hover:bg-emerald-900/90 text-xs font-semibold text-emerald-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-colors shadow-inner"
                  title="Filter by District"
                >
                  <option value="all">All Districts</option>
                  {districts.map((d) => (
                    <option key={d} value={d} className="bg-emerald-950 text-white">
                      {d}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 pointer-events-none text-emerald-400" />
              </div>
            </div>

            {/* Town Filter Dropdown */}
            {towns.length > 0 && (
              <div className="relative inline-flex items-center">
                <label htmlFor="town-select" className="sr-only">Filter by Town</label>
                <div className="relative">
                  <select
                    id="town-select"
                    value={selectedTown}
                    onChange={(e) => handleTownChange(e.target.value)}
                    className="appearance-none pl-3.5 pr-7 py-1.5 rounded-full border border-emerald-700/60 bg-emerald-950/80 hover:bg-emerald-900/90 text-xs font-semibold text-emerald-100 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-colors shadow-inner"
                    title="Filter by Town"
                  >
                    <option value="all" className="bg-emerald-950 text-white">
                      All Towns
                    </option>
                    {towns.map((t) => (
                      <option key={t} value={t} className="bg-emerald-950 text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2.5 pointer-events-none text-emerald-400" />
                </div>
              </div>
            )}
          </div>

          {/* Line 2: Mosque Selector & Set as Default Button Side-by-Side */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Mosque Selector Dropdown */}
            <div className="relative inline-flex items-center flex-1 max-w-md min-w-[220px]">
              <label htmlFor="mosque-select" className="sr-only">Select Mosque</label>
              <div className="relative w-full">
                <select
                  id="mosque-select"
                  value={selectedMosqueId}
                  onChange={(e) => handleMosqueChange(e.target.value)}
                  className="w-full appearance-none pl-3.5 pr-8 py-1.5 rounded-full border border-amber-400/50 bg-emerald-900/90 hover:bg-emerald-800 text-xs font-bold text-amber-200 cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-300 transition-colors shadow-inner truncate"
                  title="Switch Mosque"
                >
                  {filteredMosques.map((m) => (
                    <option key={m.id} value={m.id} className="bg-emerald-950 text-white">
                      {m.id === userDefaultMosqueId ? "⭐ " : ""}{m.name} {m.town ? `(${m.town})` : ""}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-3 top-2.5 pointer-events-none text-amber-300" />
              </div>
            </div>

            {/* Set as My Default Button / Active Badge */}
            {isUserDefault ? (
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/40 shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                <span>My Default Mosque</span>
              </span>
            ) : (
              <button
                type="button"
                onClick={handleSetAsDefault}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/25 cursor-pointer shadow-xs shrink-0"
                title="Save this mosque as your default"
              >
                <Star className="w-3.5 h-3.5 text-amber-300" />
                <span>Set as My Default</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN PRAYER TIMINGS CARD (NEW UI) ─────────────────────────────── */}
      <div className="bg-card border-2 border-primary/20 rounded-3xl p-5 sm:p-7 md:p-8 shadow-xl relative overflow-hidden">
        {/* Top Header: Exactly 2 Clean, Uncrowded Lines */}
        <div className="flex flex-col gap-2 pb-5 border-b border-border">
          {/* Line 1: Mosque Icon, Name & Badge */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-800 to-emerald-950 text-emerald-200 flex items-center justify-center shrink-0 border border-emerald-600/40 shadow-xs">
              <svg className="w-6 h-6 text-amber-300" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C10.5 4 8 6 8 8C8 10.2 9.8 12 12 12C14.2 12 16 10.2 16 8C16 6 13.5 4 12 2Z" />
                <path d="M4 14C4 12.9 4.9 12 6 12H18C19.1 12 20 12.9 20 14V21C20 21.6 19.6 22 19 22H5C4.4 22 4 21.6 4 21V14Z" opacity="0.8" />
              </svg>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-foreground tracking-tight">
                <Link
                  href={`/mosques/${activeMosque.slug}`}
                  className="hover:text-primary transition-colors"
                >
                  {activeMosque.name}
                </Link>
              </h2>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold shrink-0">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{activeMosque.town || activeMosque.city}</span>
              </span>
            </div>
          </div>

          {/* Line 2: Location & Dates in ONE single clean horizontal line */}
          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs sm:text-sm text-muted-foreground pt-0.5">
            <span className="flex items-center gap-1.5 font-medium text-foreground/85 shrink-0">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{activeMosque.address}, {activeMosque.city}</span>
            </span>
            <span className="text-border">•</span>
            <span className="flex items-center gap-1 font-medium shrink-0">
              <Calendar className="w-3.5 h-3.5 text-accent shrink-0" />
              <span>{currentDate.formatted}</span>
              {hijriDate && (
                <span className="text-primary font-semibold ml-1">
                  ({hijriDate})
                </span>
              )}
            </span>
          </div>
        </div>

        {/* ── 5 DAILY PRAYER TIMINGS ────────────────────────────────────── */}
        <div className="mt-7 space-y-5">
          {/* Section Subheader & Toggle Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-foreground font-extrabold text-base sm:text-lg">
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 3L2 12H5V20H19V12H22L12 3Z" />
              </svg>
              <span>Today&apos;s 5 Daily Prayer Timings</span>
            </div>

            {/* Filter Toggle: [ Adhan & Iqamah | Adhan Only ] */}
            <div className="inline-flex p-1 rounded-xl bg-muted/60 border border-border text-xs font-semibold self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setFilterMode("both")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterMode === "both"
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Adhan &amp; Iqamah
              </button>
              <button
                type="button"
                onClick={() => setFilterMode("adhan")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  filterMode === "adhan"
                    ? "bg-primary text-primary-foreground shadow-xs font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Adhan Only
              </button>
            </div>
          </div>

          {/* 5 Prayer Cards Grid (Matching the new UI aesthetic) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
            {prayers.map((prayer) => {
              const isTarget =
                nextPrayer?.name.toLowerCase() === prayer.name.toLowerCase();

              return (
                <div
                  key={prayer.name}
                  className={`rounded-2xl p-4 sm:p-5 text-center transition-all flex flex-col justify-between border ${
                    isTarget
                      ? "bg-[#0b382c] text-white border-amber-400 shadow-xl ring-2 ring-amber-400/40 scale-102 z-10"
                      : "bg-muted/30 border-border/80 hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  <div>
                    {/* Prayer Icon */}
                    <div className="flex items-center justify-center mb-2.5">
                      {getPrayerIcon(prayer.name, isTarget)}
                    </div>

                    {/* Prayer Name & Active Indicator Dot */}
                    <div className="flex items-center justify-center gap-1.5 mb-1.5">
                      <span
                        className={`text-xs font-extrabold uppercase tracking-wider ${
                          isTarget ? "text-amber-300" : "text-foreground"
                        }`}
                      >
                        {prayer.name}
                      </span>
                      {isTarget && (
                        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping inline-block" />
                      )}
                    </div>

                    {/* Jamaat / Primary Time */}
                    <div className="my-1">
                      {filterMode === "both" && (
                        <div
                          className={`text-[11px] font-bold uppercase tracking-wider mb-0.5 ${
                            isTarget ? "text-emerald-200" : "text-primary font-semibold"
                          }`}
                        >
                          Jamaat
                        </div>
                      )}
                      <div
                        className={`text-2xl sm:text-3xl font-mono font-black tracking-tight ${
                          isTarget ? "text-white" : "text-foreground"
                        }`}
                      >
                        {formatTime(
                          filterMode === "adhan" ? prayer.adhanTime : prayer.jamaatTime,
                          "12h"
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Adhan Time / Secondary Time */}
                  {filterMode === "both" && (
                    <div
                      className={`mt-3 pt-2 border-t text-xs font-mono ${
                        isTarget
                          ? "border-emerald-700/60 text-emerald-100"
                          : "border-border text-muted-foreground"
                      }`}
                    >
                      Adhan:{" "}
                      <strong className={isTarget ? "text-white font-bold" : "text-foreground font-semibold"}>
                        {formatTime(prayer.adhanTime, "12h")}
                      </strong>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* ── NEXT PRAYER COUNTDOWN BAR ───────────────────────────────── */}
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
                    Next Prayer: {nextPrayer.name}{" "}
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
        </div>
      </div>

      {/* ── BOTTOM ACTIONS & COMMUNITY SECTIONS (WHATSAPP, TV MODE & MORE) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: WhatsApp Sharing */}
        <div className="bg-card border border-border hover:border-emerald-500/50 p-5 rounded-2xl shadow-xs transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-3">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-foreground mb-1">
              Share on WhatsApp
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Send today&apos;s verified Adhan &amp; Jamaat timetable to family and prayer groups.
            </p>
          </div>
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="mt-4 w-full py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Timetable</span>
          </button>
        </div>

        {/* Card 2: TV Display Mode */}
        <div className="bg-card border border-border hover:border-primary/50 p-5 rounded-2xl shadow-xs transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Tv className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-foreground mb-1">
              TV Digital Signage
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Dedicated fullscreen digital display for Mosque LED and TV monitors.
            </p>
          </div>
          <Link
            href={`/mosques/${activeMosque.slug}/display`}
            target="_blank"
            className="mt-4 w-full py-2 px-3 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-xs text-center"
          >
            <Tv className="w-3.5 h-3.5" />
            <span>Launch TV Mode</span>
          </Link>
        </div>

        {/* Card 3: Personal Default Mosque Preference */}
        <div className="bg-card border border-border hover:border-amber-500/50 p-5 rounded-2xl shadow-xs transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-3">
              <Star className="w-5 h-5 fill-amber-500" />
            </div>
            <h3 className="font-extrabold text-sm text-foreground mb-1">
              My Default Mosque
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isUserDefault
                ? `Currently set as your personal home screen default.`
                : `Set "${activeMosque.name}" as your personal home default.`}
            </p>
          </div>
          <button
            type="button"
            onClick={handleSetAsDefault}
            disabled={isUserDefault}
            className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
              isUserDefault
                ? "bg-muted text-muted-foreground cursor-default"
                : "bg-amber-500 hover:bg-amber-600 text-white"
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${isUserDefault ? "fill-muted-foreground" : "fill-white"}`} />
            <span>{isUserDefault ? "Default Active" : "Set as Default"}</span>
          </button>
        </div>

        {/* Card 4: Friday Jummah Prayers */}
        <div className="bg-card border border-border hover:border-blue-500/50 p-5 rounded-2xl shadow-xs transition-all flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-foreground mb-1">
              Friday Jummah
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {jummahSessions.length > 0 ? (
                <span>
                  Khutbah: <strong>{formatTime(jummahSessions[0].khutbahTime, "12h")}</strong> • Jamaat: <strong>{formatTime(jummahSessions[0].jamaatTime, "12h")}</strong>
                </span>
              ) : (
                "Weekly Friday congregational schedule."
              )}
            </p>
          </div>
          <Link
            href={`/mosques/${activeMosque.slug}`}
            className="mt-4 w-full py-2 px-3 rounded-xl border border-border hover:bg-muted text-foreground text-xs font-bold transition-colors flex items-center justify-center gap-2 text-center"
          >
            <span>Mosque Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
