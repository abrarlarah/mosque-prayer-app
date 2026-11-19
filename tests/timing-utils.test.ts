import { describe, it, expect } from "vitest";
import {
  formatTime,
  generateSlug,
  getNextPrayer,
  getTimeUntil,
} from "../src/lib/utils";

describe("Timing & Utility Functions", () => {
  describe("formatTime", () => {
    it("formats 24h string to 12h AM/PM correctly", () => {
      expect(formatTime("05:45", "12h")).toBe("5:45 AM");
      expect(formatTime("12:00", "12h")).toBe("12:00 PM");
      expect(formatTime("13:15", "12h")).toBe("1:15 PM");
      expect(formatTime("19:45", "12h")).toBe("7:45 PM");
      expect(formatTime("00:15", "12h")).toBe("12:15 AM");
    });

    it("formats 24h string to 24h properly padded", () => {
      expect(formatTime("5:45", "24h")).toBe("05:45");
      expect(formatTime("13:15", "24h")).toBe("13:15");
    });

    it("handles null or undefined safely", () => {
      expect(formatTime(null)).toBe("—");
      expect(formatTime(undefined)).toBe("—");
    });
  });

  describe("generateSlug", () => {
    it("converts mosque names to URL friendly slugs", () => {
      expect(generateSlug("Jamia Masjid Baramulla")).toBe("jamia-masjid-baramulla");
      expect(generateSlug("Masjid Al-Noor & Islamic Center")).toBe(
        "masjid-al-noor-islamic-center"
      );
      expect(generateSlug("Central Mosque (Downtown)")).toBe(
        "central-mosque-downtown"
      );
    });
  });

  describe("getNextPrayer", () => {
    const prayers = [
      { name: "Fajr", adhanTime: "05:15", jamaatTime: "05:45", isEnabled: true },
      { name: "Dhuhr", adhanTime: "12:30", jamaatTime: "13:00", isEnabled: true },
      { name: "Asr", adhanTime: "15:45", jamaatTime: "16:15", isEnabled: true },
      { name: "Maghrib", adhanTime: "17:30", jamaatTime: "17:35", isEnabled: true },
      { name: "Isha", adhanTime: "19:15", jamaatTime: "19:45", isEnabled: true },
    ];

    it("finds the next prayer when one is pending today", () => {
      const next = getNextPrayer(prayers, "Asia/Kolkata");
      expect(next).not.toBeNull();
      expect(next?.name).toBeDefined();
      expect(next?.time).toBeDefined();
    });

    it("ignores disabled prayers", () => {
      const withDisabled = prayers.map((p) =>
        p.name === "Fajr" ? { ...p, isEnabled: false } : p
      );
      const next = getNextPrayer(withDisabled, "Asia/Kolkata");
      expect(next).not.toBeNull();
    });
  });

  describe("getTimeUntil", () => {
    it("returns remaining hours, minutes, and seconds to target", () => {
      const countdown = getTimeUntil("23:59:00", "Asia/Kolkata");
      expect(countdown.hours).toBeGreaterThanOrEqual(0);
      expect(countdown.minutes).toBeGreaterThanOrEqual(0);
      expect(countdown.seconds).toBeGreaterThanOrEqual(0);
      expect(countdown.totalSeconds).toBeGreaterThan(0);
    });
  });
});
