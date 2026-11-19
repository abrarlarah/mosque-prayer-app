"use client";

import { useEffect, useState } from "react";
import { Clock, Timer, Sparkles } from "lucide-react";
import { cn, formatTime, getNextPrayer, getTimeUntil } from "@/lib/utils";
import type { PrayerTime } from "@/types/mosque";

interface PrayerCountdownProps {
  prayers: PrayerTime[];
  timezone: string;
  timeFormat?: "12h" | "24h";
  className?: string;
}

export default function PrayerCountdown({
  prayers,
  timezone,
  timeFormat = "12h",
  className,
}: PrayerCountdownProps) {
  // Live current clock time string
  const [currentClock, setCurrentClock] = useState<string>("");
  const [currentPeriod, setCurrentPeriod] = useState<string>("");

  const [nextPrayer, setNextPrayer] = useState<{
    name: string;
    time: string;
    isNext: boolean;
  } | null>(() => {
    try {
      return getNextPrayer(prayers, timezone);
    } catch {
      return null;
    }
  });

  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  } | null>(() => {
    try {
      const next = getNextPrayer(prayers, timezone);
      return next?.time ? getTimeUntil(next.time, timezone) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const update = () => {
      // 1. Update live clock
      const now = new Date();
      if (timeFormat === "24h") {
        const fmt = new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        });
        setCurrentClock(fmt.format(now));
        setCurrentPeriod("");
      } else {
        const fmt = new Intl.DateTimeFormat("en-US", {
          timeZone: timezone,
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });
        const [timePart, ampm] = fmt.format(now).split(" ");
        setCurrentClock(timePart);
        setCurrentPeriod(ampm || "");
      }

      // 2. Update next prayer & countdown
      try {
        const next = getNextPrayer(prayers, timezone);
        setNextPrayer(next);
        if (next?.time) {
          setTimeLeft(getTimeUntil(next.time, timezone));
        } else {
          setTimeLeft(null);
        }
      } catch {
        setNextPrayer(null);
        setTimeLeft(null);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [prayers, timezone, timeFormat]);

  if (!nextPrayer) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm",
          className
        )}
      >
        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Clock className="h-5 w-5" />
        </div>
        <p className="text-sm font-semibold text-foreground">
          No prayers scheduled
        </p>
      </div>
    );
  }

  const hours = String(timeLeft?.hours ?? 0).padStart(2, "0");
  const minutes = String(timeLeft?.minutes ?? 0).padStart(2, "0");
  const seconds = String(timeLeft?.seconds ?? 0).padStart(2, "0");

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/10 via-card to-primary/5 p-6 sm:p-8 shadow-md",
        className
      )}
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Column: LIVE CURRENT CLOCK */}
        <div className="md:col-span-5 text-center md:text-left border-b md:border-b-0 md:border-r border-border/80 pb-6 md:pb-0 md:pr-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span>Live Clock</span>
          </div>

          <div className="font-mono font-black tracking-tight text-foreground text-4xl sm:text-5xl flex items-baseline justify-center md:justify-start gap-1.5 tabular-nums">
            <span>{currentClock || "--:--:--"}</span>
            {currentPeriod && (
              <span className="text-lg font-bold text-primary font-sans">
                {currentPeriod}
              </span>
            )}
          </div>

          <p className="text-xs text-muted-foreground mt-1.5 flex items-center justify-center md:justify-start gap-1">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Timezone: {timezone}</span>
          </p>
        </div>

        {/* Right Column: UPCOMING PRAYER & COUNTDOWN */}
        <div className="md:col-span-7 flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Target Prayer Info */}
          <div className="text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Next Congregational Prayer
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-0.5">
              {nextPrayer.name}
            </h3>
            <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary mt-1">
              <span>Jamaat at</span>
              <strong className="font-mono text-base font-extrabold text-primary">
                {formatTime(nextPrayer.time, timeFormat)}
              </strong>
            </div>
          </div>

          {/* Countdown Clock Display */}
          <div className="bg-card/90 border border-primary/30 rounded-2xl p-4 text-center shadow-inner min-w-[200px]">
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary flex items-center justify-center gap-1 mb-1">
              <Timer className="w-3 h-3 text-primary animate-pulse" />
              <span>Time Remaining</span>
            </span>

            <div
              suppressHydrationWarning
              className="font-mono text-3xl sm:text-4xl font-black tracking-wider text-primary tabular-nums"
            >
              <span>{hours}</span>
              <span className="mx-0.5 text-primary/40">:</span>
              <span>{minutes}</span>
              <span className="mx-0.5 text-primary/40">:</span>
              <span>{seconds}</span>
            </div>

            <div className="mt-1 flex justify-between px-1 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
              <span>Hours</span>
              <span>Mins</span>
              <span>Secs</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
