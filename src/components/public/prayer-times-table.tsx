"use client";

import React, { useEffect, useState } from "react";
import { Sunrise, Sun, Sunset, Moon, Star, Clock, Building2 } from "lucide-react";
import { cn, formatTime, getNextPrayer } from "@/lib/utils";
import type { PrayerTime, JummahSession } from "@/types/mosque";

interface PrayerTimesTableProps {
  prayers: PrayerTime[];
  jummahSessions?: JummahSession[];
  timezone: string;
  showAdhan?: boolean;
  timeFormat?: "12h" | "24h";
  className?: string;
}

function getPrayerIcon(name: string) {
  switch (name.toLowerCase().trim()) {
    case "fajr":
      return Sunrise;
    case "dhuhr":
    case "zuhr":
      return Sun;
    case "asr":
      return Sunset;
    case "maghrib":
      return Moon;
    case "isha":
      return Star;
    default:
      return Clock;
  }
}

export default function PrayerTimesTable({
  prayers,
  jummahSessions = [],
  timezone,
  showAdhan = true,
  timeFormat = "12h",
  className,
}: PrayerTimesTableProps) {
  const [nextPrayer, setNextPrayer] = useState<{
    name: string;
    time: string;
    isNext: boolean;
  } | null>(null);

  useEffect(() => {
    const updateNextPrayer = () => {
      if (prayers && prayers.length > 0) {
        setNextPrayer(getNextPrayer(prayers, timezone));
      } else {
        setNextPrayer(null);
      }
    };

    updateNextPrayer();
    const interval = setInterval(updateNextPrayer, 60_000);

    return () => clearInterval(interval);
  }, [prayers, timezone]);

  if (!prayers || prayers.length === 0) {
    return (
      <div
        className={cn(
          "w-full rounded-xl border border-border bg-card p-8 text-center text-sm text-muted-foreground shadow-sm",
          className
        )}
      >
        No prayer times available.
      </div>
    );
  }

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <th scope="col" className="px-4 py-3.5 sm:px-6">
                Prayer Name
              </th>
              {showAdhan && (
                <th scope="col" className="px-4 py-3.5 text-right sm:px-6">
                  Adhan Time
                </th>
              )}
              <th scope="col" className="px-4 py-3.5 text-right sm:px-6">
                Jamaat / Iqamah Time
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {prayers.map((prayer) => {
              const isEnabled = prayer.isEnabled;
              const isNext = Boolean(
                isEnabled &&
                  nextPrayer &&
                  nextPrayer.name.toLowerCase() === prayer.name.toLowerCase()
              );
              const Icon = getPrayerIcon(prayer.name);

              return (
                <tr
                  key={prayer.name}
                  className={cn(
                    "border-l-4 transition-colors",
                    isNext
                      ? "border-l-primary bg-primary/5 font-medium"
                      : isEnabled
                        ? "border-l-transparent hover:bg-muted/30"
                        : "border-l-transparent bg-muted/20 opacity-50"
                  )}
                >
                  <td className="px-4 py-3.5 sm:px-6 sm:py-4">
                    <div className="flex items-center gap-3">
                      <span
                        className={cn(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                          isNext
                            ? "bg-primary/10 text-primary"
                            : isEnabled
                              ? "bg-muted text-foreground"
                              : "bg-muted/40 text-muted-foreground"
                        )}
                        aria-hidden="true"
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={cn(
                              "font-medium text-foreground",
                              isNext && "font-semibold text-primary",
                              !isEnabled && "text-muted-foreground"
                            )}
                          >
                            {prayer.name}
                          </span>
                          {isNext && (
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                              Next
                            </span>
                          )}
                          {!isEnabled && (
                            <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              Not scheduled
                            </span>
                          )}
                        </div>
                        {prayer.note && (
                          <p className="mt-0.5 truncate text-xs text-muted-foreground">
                            {prayer.note}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {showAdhan && (
                    <td className="whitespace-nowrap px-4 py-3.5 text-right tabular-nums sm:px-6 sm:py-4">
                      {isEnabled ? (
                        <span className="text-muted-foreground">
                          {formatTime(prayer.adhanTime, timeFormat)}
                        </span>
                      ) : (
                        <span className="text-xs italic text-muted-foreground">
                          Not scheduled
                        </span>
                      )}
                    </td>
                  )}

                  <td className="whitespace-nowrap px-4 py-3.5 text-right tabular-nums sm:px-6 sm:py-4">
                    {isEnabled ? (
                      <span
                        className={cn(
                          "font-semibold text-foreground",
                          isNext && "text-base font-bold text-primary"
                        )}
                      >
                        {formatTime(prayer.jamaatTime, timeFormat)}
                      </span>
                    ) : (
                      <span className="text-xs italic text-muted-foreground">
                        Not scheduled
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}

            {/* Friday Jummah Session Row */}
            {jummahSessions && jummahSessions.length > 0 && (
              <tr className="border-l-4 border-l-amber-500 bg-amber-500/5 hover:bg-amber-500/10 transition-colors">
                <td className="px-4 py-3.5 sm:px-6 sm:py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400">
                      <Building2 className="h-4 w-4" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">JUMMAH</span>
                        <span className="inline-flex items-center rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-200 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider">
                          Friday
                        </span>
                      </div>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        Weekly Congregational Prayer
                      </p>
                    </div>
                  </div>
                </td>

                {showAdhan && (
                  <td className="whitespace-nowrap px-4 py-3.5 text-right tabular-nums sm:px-6 sm:py-4">
                    <span className="text-muted-foreground font-mono text-xs">
                      Khutbah: <strong className="text-foreground">{formatTime(jummahSessions[0].khutbahTime, timeFormat)}</strong>
                    </span>
                  </td>
                )}

                <td className="whitespace-nowrap px-4 py-3.5 text-right tabular-nums sm:px-6 sm:py-4">
                  <span className="font-mono font-bold text-primary text-base">
                    {formatTime(jummahSessions[0].jamaatTime, timeFormat)}
                  </span>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
