import { describe, it, expect } from "vitest";
import {
  resolvePrayerTimesForDate,
  shiftTime,
} from "../src/lib/prayer-utils";
import type { PrayerTime, MonthlySchedule } from "../src/types/mosque";

describe("3-Layer Prayer Timing Resolution", () => {
  const defaultPrayers: PrayerTime[] = [
    { name: "Fajr", adhanTime: "05:15", jamaatTime: "05:45", isEnabled: true },
    { name: "Dhuhr", adhanTime: "12:30", jamaatTime: "13:00", isEnabled: true },
    { name: "Asr", adhanTime: "15:45", jamaatTime: "16:15", isEnabled: true },
    { name: "Maghrib", adhanTime: "17:30", jamaatTime: "17:35", isEnabled: true },
    { name: "Isha", adhanTime: "19:15", jamaatTime: "19:45", isEnabled: true },
  ];

  it("should resolve default schedule when no monthly schedule or override exists", () => {
    const resolved = resolvePrayerTimesForDate({
      date: "2026-11-20",
      defaultPrayers,
    });

    expect(resolved).toHaveLength(5);
    const fajr = resolved.find((p) => p.prayerName === "Fajr");
    expect(fajr).toBeDefined();
    expect(fajr?.jamaatTime).toBe("05:45");
    expect(fajr?.source).toBe("default");
  });

  it("should resolve monthly schedule over default schedule", () => {
    const monthlySchedule: MonthlySchedule = {
      id: "m_nov",
      mosqueId: "m1",
      year: 2026,
      month: 11,
      status: "published",
      entries: [
        {
          id: "e1",
          scheduleId: "m_nov",
          date: "2026-11-20",
          prayerName: "Asr",
          adhanTime: "15:30",
          jamaatTime: "16:00",
          isEnabled: true,
        },
      ],
    };

    const resolved = resolvePrayerTimesForDate({
      date: "2026-11-20",
      defaultPrayers,
      monthlySchedule,
    });

    const asr = resolved.find((p) => p.prayerName === "Asr");
    expect(asr?.jamaatTime).toBe("16:00");
    expect(asr?.source).toBe("monthly");

    // Other prayers should still fall back to default
    const fajr = resolved.find((p) => p.prayerName === "Fajr");
    expect(fajr?.jamaatTime).toBe("05:45");
    expect(fajr?.source).toBe("default");
  });

  it("should NOT resolve draft monthly schedules (must be published)", () => {
    const draftMonthly: MonthlySchedule = {
      id: "m_draft",
      mosqueId: "m1",
      year: 2026,
      month: 11,
      status: "draft",
      entries: [
        {
          id: "e1",
          scheduleId: "m_draft",
          date: "2026-11-20",
          prayerName: "Asr",
          adhanTime: "15:30",
          jamaatTime: "16:00",
          isEnabled: true,
        },
      ],
    };

    const resolved = resolvePrayerTimesForDate({
      date: "2026-11-20",
      defaultPrayers,
      monthlySchedule: draftMonthly,
    });

    const asr = resolved.find((p) => p.prayerName === "Asr");
    expect(asr?.jamaatTime).toBe("16:15"); // from default, not draft!
    expect(asr?.source).toBe("default");
  });

  it("should resolve date-specific override over BOTH monthly and default schedules", () => {
    const monthlySchedule: MonthlySchedule = {
      id: "m_nov",
      mosqueId: "m1",
      year: 2026,
      month: 11,
      status: "published",
      entries: [
        {
          id: "e1",
          scheduleId: "m_nov",
          date: "2026-11-20",
          prayerName: "Isha",
          adhanTime: "19:00",
          jamaatTime: "19:30",
          isEnabled: true,
        },
      ],
    };

    const overrides = [
      {
        date: "2026-11-20",
        prayerName: "Isha",
        adhanTime: "19:30",
        jamaatTime: "20:00", // Override for special event
        reason: "Lecture program",
        isEnabled: true,
      },
    ];

    const resolved = resolvePrayerTimesForDate({
      date: "2026-11-20",
      defaultPrayers,
      monthlySchedule,
      overrides,
    });

    const isha = resolved.find((p) => p.prayerName === "Isha");
    expect(isha?.jamaatTime).toBe("20:00");
    expect(isha?.source).toBe("override");
  });

  describe("shiftTime helper", () => {
    it("should shift time forward by positive minutes", () => {
      expect(shiftTime("15:45", 15)).toBe("16:00");
      expect(shiftTime("05:55", 10)).toBe("06:05");
    });

    it("should shift time backward by negative minutes", () => {
      expect(shiftTime("16:00", -15)).toBe("15:45");
      expect(shiftTime("00:05", -10)).toBe("23:55"); // wrap around midnight
    });
  });
});
