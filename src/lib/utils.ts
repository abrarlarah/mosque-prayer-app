import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(time: string | null | undefined, format: "12h" | "24h" = "12h"): string {
  if (!time) return "—";

  const [hours, minutes] = time.split(":").map(Number);

  if (format === "24h") {
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
  }

  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${String(minutes).padStart(2, "0")} ${period}`;
}

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function getNextPrayer(
  prayers: Array<{ name: string; adhanTime: string | null; jamaatTime: string | null; isEnabled: boolean }>,
  timezone: string = "UTC"
): { name: string; time: string; isNext: boolean } | null {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const currentTime = formatter.format(now);
  const [currentHours, currentMinutes] = currentTime.split(":").map(Number);
  const currentTotalMinutes = currentHours * 60 + currentMinutes;

  for (const prayer of prayers) {
    if (!prayer.isEnabled || !prayer.jamaatTime) continue;
    const [h, m] = prayer.jamaatTime.split(":").map(Number);
    const prayerTotalMinutes = h * 60 + m;
    if (prayerTotalMinutes > currentTotalMinutes) {
      return { name: prayer.name, time: prayer.jamaatTime, isNext: true };
    }
  }

  // All prayers passed — next is Fajr tomorrow
  const firstEnabled = prayers.find((p) => p.isEnabled && p.jamaatTime);
  if (firstEnabled) {
    return { name: firstEnabled.name, time: firstEnabled.jamaatTime!, isNext: true };
  }

  return null;
}

export function getTimeUntil(targetTime: string, timezone: string = "UTC"): {
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
} {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
  const currentTime = formatter.format(now);
  const [ch, cm, cs] = currentTime.split(":").map(Number);
  const [th, tm] = targetTime.split(":").map(Number);

  let currentSeconds = ch * 3600 + cm * 60 + cs;
  let targetSeconds = th * 3600 + tm * 60;

  if (targetSeconds <= currentSeconds) {
    targetSeconds += 24 * 3600; // next day
  }

  const diff = targetSeconds - currentSeconds;
  return {
    hours: Math.floor(diff / 3600),
    minutes: Math.floor((diff % 3600) / 60),
    seconds: diff % 60,
    totalSeconds: diff,
  };
}

export function getCurrentDate(timezone: string = "UTC"): {
  formatted: string;
  dayName: string;
  date: string;
} {
  const now = new Date();
  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const dayFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
  });
  const isoFormatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return {
    formatted: dateFormatter.format(now),
    dayName: dayFormatter.format(now),
    date: isoFormatter.format(now),
  };
}

const ISLAMIC_MONTH_NAMES: Record<number, string> = {
  1: "Muharram",
  2: "Safar",
  3: "Rabi al-Awwal",
  4: "Rabi al-Thani",
  5: "Jumada al-Ula",
  6: "Jumada al-Thani",
  7: "Rajab",
  8: "Sha'ban",
  9: "Ramadan",
  10: "Shawwal",
  11: "Dhul Qadah",
  12: "Dhul Hijjah",
};

export function getHijriDate(timezone: string = "Asia/Kolkata", offsetDays: number = -1): string {
  try {
    const now = new Date();
    // In Kashmir / South Asia, local moon sighting is typically 1 day behind Saudi Umm al-Qura
    const isSouthAsia = !timezone || timezone === "Asia/Kolkata" || timezone === "Asia/Calcutta";
    const effectiveOffset = isSouthAsia ? offsetDays : 0;
    const adjustedDate = new Date(now.getTime() + effectiveOffset * 86400000);

    const parts = new Intl.DateTimeFormat("en-US-u-ca-islamic-umalqura", {
      timeZone: timezone || "Asia/Kolkata",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    }).formatToParts(adjustedDate);

    let day = "";
    let monthNum = 0;
    let year = "";

    for (const p of parts) {
      if (p.type === "day") day = p.value;
      if (p.type === "month") monthNum = parseInt(p.value, 10);
      if (p.type === "year") year = p.value;
    }

    const monthName = ISLAMIC_MONTH_NAMES[monthNum] || "Jumada al-Thani";
    return `${day} ${monthName} ${year} AH`;
  } catch {
    return "";
  }
}

/**
 * Shifts a 24h time string ("HH:MM") by a given number of minutes (+/-).
 */
export function shiftTime(time: string | null | undefined, deltaMinutes: number): string {
  if (!time) return "12:00";
  const [hStr, mStr] = time.split(":");
  let totalMinutes = (parseInt(hStr, 10) || 0) * 60 + (parseInt(mStr, 10) || 0) + deltaMinutes;

  // Wrap around 24 hours (1440 minutes in a day)
  totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
