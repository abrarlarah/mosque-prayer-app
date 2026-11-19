import type { PrayerTime, MonthlySchedule, DailyPrayerSchedule } from "@/types/mosque";
import { PRAYER_NAMES, type PrayerName } from "@/lib/constants";

export interface ResolvedPrayerEntry {
  prayerName: string;
  adhanTime: string | null;
  jamaatTime: string;
  note: string | null;
  isEnabled: boolean;
  source: "override" | "monthly" | "default" | "none";
}

/**
 * Resolves prayer times using the 3-layer priority:
 * 1. Date-Specific Override
 * 2. Monthly Schedule Entry
 * 3. Default Mosque Schedule
 */
export function resolvePrayerTimesForDate({
  date,
  defaultPrayers,
  monthlySchedule,
  overrides = [],
}: {
  date: string; // YYYY-MM-DD
  defaultPrayers: PrayerTime[];
  monthlySchedule?: MonthlySchedule | null;
  overrides?: Array<{
    date: string;
    prayerName: string;
    adhanTime: string | null;
    jamaatTime: string;
    note?: string | null;
    isEnabled: boolean;
  }>;
}): ResolvedPrayerEntry[] {
  const result: ResolvedPrayerEntry[] = [];

  for (const prayerName of PRAYER_NAMES) {
    // 1. Check Date-Specific Override
    const override = overrides.find(
      (o) => o.date === date && o.prayerName.toLowerCase() === prayerName.toLowerCase()
    );
    if (override) {
      result.push({
        prayerName,
        adhanTime: override.adhanTime,
        jamaatTime: override.jamaatTime,
        note: override.note || null,
        isEnabled: override.isEnabled,
        source: "override",
      });
      continue;
    }

    // 2. Check Monthly Schedule Entry
    if (monthlySchedule && monthlySchedule.status === "published") {
      const monthlyEntry = monthlySchedule.entries.find(
        (e) => e.date === date && e.prayerName.toLowerCase() === prayerName.toLowerCase()
      );
      if (monthlyEntry && monthlyEntry.jamaatTime) {
        result.push({
          prayerName,
          adhanTime: monthlyEntry.adhanTime,
          jamaatTime: monthlyEntry.jamaatTime,
          note: monthlyEntry.note || null,
          isEnabled: monthlyEntry.isEnabled,
          source: "monthly",
        });
        continue;
      }
    }

    // 3. Check Default Mosque Schedule
    const defaultPrayer = defaultPrayers.find(
      (d) => d.name.toLowerCase() === prayerName.toLowerCase()
    );
    if (defaultPrayer && defaultPrayer.jamaatTime) {
      result.push({
        prayerName,
        adhanTime: defaultPrayer.adhanTime,
        jamaatTime: defaultPrayer.jamaatTime,
        note: defaultPrayer.note || null,
        isEnabled: defaultPrayer.isEnabled,
        source: "default",
      });
      continue;
    }

    // Fallback: Prayer not configured
    result.push({
      prayerName,
      adhanTime: null,
      jamaatTime: "00:00",
      note: "Not scheduled",
      isEnabled: false,
      source: "none",
    });
  }

  return result;
}

/**
 * Shifts a time string (HH:MM) by a given number of minutes (+ or -)
 */
export function shiftTime(timeStr: string | null, minutesToAdd: number): string | null {
  if (!timeStr) return null;
  const parts = timeStr.split(":").map(Number);
  if (parts.length < 2 || isNaN(parts[0]) || isNaN(parts[1])) return timeStr;

  let totalMinutes = parts[0] * 60 + parts[1] + minutesToAdd;
  // normalize within 24h
  totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;

  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
