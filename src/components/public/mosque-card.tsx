import React from "react";
import Link from "next/link";
import { MapPin, Clock, Tv, Star, ArrowRight } from "lucide-react";
import type { Mosque, PrayerTime } from "@/types/mosque";
import { cn, formatTime, getNextPrayer } from "@/lib/utils";

export interface MosqueCardProps {
  mosque: Mosque;
  prayerTimes?: PrayerTime[];
  className?: string;
}

export default function MosqueCard({
  mosque,
  prayerTimes = [],
  className,
}: MosqueCardProps) {
  const nextPrayer =
    prayerTimes.length > 0
      ? getNextPrayer(prayerTimes, mosque.timezone)
      : null;

  return (
    <div
      className={cn(
        "group flex flex-col justify-between rounded-2xl border bg-card p-6 text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md",
        mosque.isDefault ? "border-primary/50 ring-2 ring-primary/20" : "border-border",
        className
      )}
    >
      <div>
        {/* Top Badges: Default Mosque & District/Town */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            {mosque.isDefault && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[11px] font-bold">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                <span>Primary / Default</span>
              </span>
            )}
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground text-[11px] font-semibold">
              {mosque.district} District
            </span>
          </div>

          {mosque.town && (
            <span className="text-[11px] font-medium text-muted-foreground">
              {mosque.town}
            </span>
          )}
        </div>

        {/* Mosque Title & Address */}
        <div className="space-y-1.5 mb-4">
          <h3 className="text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
            <Link href={`/mosques/${mosque.slug}`}>
              {mosque.name}
            </Link>
          </h3>

          <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
            <span>
              {mosque.address}, {mosque.city}
            </span>
          </div>
        </div>

        {/* Next Prayer Highlight Banner */}
        {nextPrayer && (
          <div className="mb-4 flex items-center justify-between rounded-xl bg-primary/10 border border-primary/20 px-3.5 py-2 text-xs">
            <div className="flex items-center gap-1.5 text-primary font-semibold">
              <Clock className="h-3.5 w-3.5 text-primary" />
              <span>Next: {nextPrayer.name}</span>
            </div>
            <div className="font-mono font-bold text-primary">
              Jamaat at {formatTime(nextPrayer.time)}
            </div>
          </div>
        )}

        {/* ALL 5 DAILY PRAYER TIMINGS TABLE */}
        {prayerTimes.length > 0 && (
          <div className="rounded-xl border border-border/80 bg-muted/20 overflow-hidden text-xs mb-4">
            <div className="grid grid-cols-3 bg-muted/50 px-3 py-1.5 font-bold text-[11px] uppercase tracking-wider text-muted-foreground border-b border-border/60">
              <span>Prayer</span>
              <span className="text-center">Adhan</span>
              <span className="text-right">Jamaat</span>
            </div>
            <div className="divide-y divide-border/50">
              {prayerTimes.map((prayer) => {
                const isNext =
                  nextPrayer?.name.toLowerCase() === prayer.name.toLowerCase();

                return (
                  <div
                    key={prayer.name}
                    className={cn(
                      "grid grid-cols-3 px-3 py-1.5 items-center transition-colors",
                      isNext
                        ? "bg-primary/10 font-bold text-primary"
                        : "hover:bg-muted/30 text-foreground"
                    )}
                  >
                    <span className="font-semibold flex items-center gap-1">
                      {isNext && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                      {prayer.name}
                    </span>
                    <span className="text-center font-mono text-muted-foreground">
                      {formatTime(prayer.adhanTime, "12h")}
                    </span>
                    <span className={cn(
                      "text-right font-mono font-bold",
                      isNext ? "text-primary" : "text-foreground"
                    )}>
                      {formatTime(prayer.jamaatTime, "12h")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
        <Link
          href={`/mosques/${mosque.slug}`}
          className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary/80 transition-colors"
        >
          <span>Full Timetable &amp; Jummah</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        <Link
          href={`/mosques/${mosque.slug}/display`}
          target="_blank"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          title="Digital TV Signage Mode"
        >
          <Tv className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
