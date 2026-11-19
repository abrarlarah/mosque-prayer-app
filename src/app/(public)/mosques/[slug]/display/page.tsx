"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getMosqueBySlug,
  getPrayerTimes,
  getJummahSessions,
  getMosqueAnnouncements,
  getSettings,
} from "@/lib/sample-data";
import {
  formatTime,
  getNextPrayer,
  getTimeUntil,
  getCurrentDate,
  getHijriDate,
} from "@/lib/utils";
import {
  ArrowLeft,
  Clock,
  Calendar,
  Volume2,
  Users,
  Megaphone,
} from "lucide-react";

interface DisplayPageProps {
  params: Promise<{ slug: string }>;
}

export default function DisplayPage({ params }: DisplayPageProps) {
  const { slug } = use(params);
  const mosque = getMosqueBySlug(slug);

  if (!mosque) {
    notFound();
  }

  const prayers = getPrayerTimes(mosque.id);
  const jummahSessions = getJummahSessions(mosque.id);
  const announcements = getMosqueAnnouncements(mosque.id);
  const settings = getSettings(mosque.id);

  // Live state
  const [currentTimeStr, setCurrentTimeStr] = useState<string>("");
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
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: mosque.timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: settings.timeFormat !== "24h",
      });
      setCurrentTimeStr(formatter.format(now));

      const next = getNextPrayer(prayers, mosque.timezone);
      setNextPrayer(next);

      if (next?.time) {
        const diff = getTimeUntil(next.time, mosque.timezone);
        setCountdown({
          hours: diff.hours,
          minutes: diff.minutes,
          seconds: diff.seconds,
        });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [mosque.timezone, prayers, settings.timeFormat]);

  const currentDate = getCurrentDate(mosque.timezone);
  const hijriDate = settings.showHijriDate ? getHijriDate(mosque.timezone) : "";

  return (
    <div className="min-h-screen bg-[#07130f] text-neutral-100 flex flex-col justify-between p-6 md:p-10 select-none overflow-hidden font-sans">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between pb-6 border-b border-emerald-900/60">
        <div>
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping inline-block" />
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
              {mosque.name}
            </h1>
          </div>
          <div className="flex items-center gap-4 text-emerald-400/90 text-lg md:text-xl mt-2 font-medium">
            <span>{mosque.city}, {mosque.state}</span>
            <span>•</span>
            <span className="text-amber-300">{currentDate.dayName}, {currentDate.formatted}</span>
            {hijriDate && (
              <>
                <span>•</span>
                <span className="text-amber-400 font-semibold">{hijriDate}</span>
              </>
            )}
          </div>
        </div>

        {/* Current Live Digital Clock */}
        <div className="flex items-center gap-6">
          <div className="bg-emerald-950/70 border border-emerald-700/50 rounded-2xl px-6 py-3 text-right shadow-inner">
            <div className="text-xs uppercase tracking-widest text-emerald-400 font-semibold mb-0.5">
              Current Time
            </div>
            <div className="text-4xl md:text-5xl font-mono font-bold tracking-wider text-amber-300">
              {currentTimeStr || "--:--:--"}
            </div>
          </div>

          {/* Semi-transparent back button */}
          <Link
            href={`/mosques/${mosque.slug}`}
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors border border-white/10"
            title="Exit Display Mode"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </div>
      </header>

      {/* Center Section: Countdown + 5 Prayers Grid */}
      <main className="my-auto py-8">
        {/* Next Prayer Countdown Banner */}
        {nextPrayer && (
          <div className="mb-10 bg-gradient-to-r from-emerald-950/80 via-emerald-900/60 to-emerald-950/80 border-2 border-emerald-500/50 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl relative overflow-hidden">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-500/40">
                <Clock className="w-9 h-9" />
              </div>
              <div>
                <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-emerald-400">
                  Upcoming Congregational Prayer
                </span>
                <h2 className="text-4xl md:text-6xl font-extrabold text-white mt-1">
                  {nextPrayer.name}{" "}
                  <span className="text-2xl md:text-3xl font-semibold text-emerald-300">
                    at {formatTime(nextPrayer.time, settings.timeFormat)}
                  </span>
                </h2>
              </div>
            </div>

            <div className="text-center md:text-right bg-black/40 px-8 py-4 rounded-2xl border border-emerald-500/30">
              <span className="text-xs uppercase font-semibold tracking-wider text-emerald-400 block mb-1">
                Time Remaining
              </span>
              <div className="text-5xl md:text-7xl font-mono font-black tracking-tight text-amber-300">
                {String(countdown.hours).padStart(2, "0")}:
                {String(countdown.minutes).padStart(2, "0")}:
                {String(countdown.seconds).padStart(2, "0")}
              </div>
            </div>
          </div>
        )}

        {/* 5 Daily Prayers Horizontal Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {prayers.map((prayer) => {
            const isTarget = nextPrayer?.name.toLowerCase() === prayer.name.toLowerCase();

            return (
              <div
                key={prayer.name}
                className={`rounded-3xl p-6 transition-all border flex flex-col justify-between ${
                  isTarget
                    ? "bg-emerald-900/80 border-amber-400/80 shadow-[0_0_35px_rgba(16,185,129,0.35)] scale-105 z-10 ring-2 ring-amber-400/50"
                    : "bg-emerald-950/50 border-emerald-900/60 hover:bg-emerald-950/70"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-2xl md:text-3xl font-extrabold tracking-tight ${isTarget ? "text-amber-300" : "text-white"}`}>
                      {prayer.name}
                    </h3>
                    {isTarget && (
                      <span className="px-2.5 py-1 rounded-full bg-amber-400 text-emerald-950 text-xs font-black uppercase tracking-wider">
                        Next
                      </span>
                    )}
                  </div>

                  {settings.showAdhanTimes && (
                    <div className="mb-4 pb-3 border-b border-emerald-800/40">
                      <div className="text-xs uppercase tracking-wider text-emerald-400/80 flex items-center gap-1.5 mb-1 font-semibold">
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Adhan</span>
                      </div>
                      <div className="text-xl md:text-2xl font-mono font-medium text-neutral-300">
                        {formatTime(prayer.adhanTime, settings.timeFormat)}
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="text-xs uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 mb-1 font-bold">
                    <Users className="w-3.5 h-3.5" />
                    <span>Jamaat (Iqamah)</span>
                  </div>
                  <div className={`text-3xl md:text-4xl font-mono font-extrabold ${isTarget ? "text-amber-300" : "text-white"}`}>
                    {formatTime(prayer.jamaatTime, settings.timeFormat)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Bottom Footer: Jummah Highlights & Announcements Ticker */}
      <footer className="pt-6 border-t border-emerald-900/60 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Jummah Sessions info */}
        {jummahSessions.length > 0 && (
          <div className="flex items-center gap-4 bg-emerald-950/60 px-5 py-2.5 rounded-xl border border-emerald-800/50">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm uppercase tracking-wide">
              <Calendar className="w-4 h-4" />
              <span>Jummah:</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-white">
              {jummahSessions.map((session, idx) => (
                <span key={session.id}>
                  Session {idx + 1}: <strong className="text-amber-300 font-mono">{formatTime(session.jamaatTime, settings.timeFormat)}</strong>
                  {idx < jummahSessions.length - 1 && " • "}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Live Announcements Ticker */}
        {announcements.length > 0 && (
          <div className="flex-1 max-w-2xl bg-emerald-950/40 px-4 py-2.5 rounded-xl border border-emerald-800/40 flex items-center gap-3">
            <Megaphone className="w-4 h-4 text-amber-400 shrink-0 animate-bounce" />
            <div className="overflow-hidden whitespace-nowrap text-sm text-neutral-200">
              <span className="font-semibold text-amber-300 mr-2">
                [{announcements[0].title}]:
              </span>
              <span>{announcements[0].message}</span>
            </div>
          </div>
        )}

        <div className="text-xs text-emerald-400/70 font-medium">
          Digital Mosque Signage • Powered by Salah Times
        </div>
      </footer>
    </div>
  );
}
