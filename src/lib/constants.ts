// Prayer names used throughout the application
export const PRAYER_NAMES = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"] as const;

export type PrayerName = (typeof PRAYER_NAMES)[number];

// Application name
export const APP_NAME = "Salah Times";
export const APP_DESCRIPTION =
  "Find accurate prayer times for mosques near you. View daily prayer schedules, Jummah timings, and announcements.";

// Default timezone
export const DEFAULT_TIMEZONE = "Asia/Kolkata";

// Announcement types
export const ANNOUNCEMENT_TYPES = [
  "general",
  "ramadan",
  "eid",
  "timing_change",
  "event",
  "emergency",
] as const;

export type AnnouncementType = (typeof ANNOUNCEMENT_TYPES)[number];

// Announcement priorities
export const ANNOUNCEMENT_PRIORITIES = ["low", "normal", "high", "urgent"] as const;

export type AnnouncementPriority = (typeof ANNOUNCEMENT_PRIORITIES)[number];

// Mosque status
export const MOSQUE_STATUSES = ["active", "inactive"] as const;

export type MosqueStatus = (typeof MOSQUE_STATUSES)[number];

// User roles
export const USER_ROLES = ["super_admin", "mosque_admin"] as const;

export type UserRole = (typeof USER_ROLES)[number];

// Time formats
export const TIME_FORMATS = ["12h", "24h"] as const;

export type TimeFormat = (typeof TIME_FORMATS)[number];

// Schedule status
export const SCHEDULE_STATUSES = ["draft", "published"] as const;

export type ScheduleStatus = (typeof SCHEDULE_STATUSES)[number];

// Navigation links for public site
export const PUBLIC_NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Mosques", href: "/mosques" },
  { label: "About", href: "/#about" },
] as const;

// Admin navigation links
export const ADMIN_NAV_LINKS = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Mosques", href: "/admin/mosques", icon: "Building2", superAdminOnly: true },
  { label: "Prayer Times", href: "/admin/prayer-times", icon: "Clock" },
  { label: "Jummah", href: "/admin/jummah", icon: "CalendarDays" },
  { label: "Announcements", href: "/admin/announcements", icon: "Megaphone" },
  { label: "Administrators", href: "/admin/administrators", icon: "Users", superAdminOnly: true },
  { label: "Activity Logs", href: "/admin/activity-logs", icon: "ScrollText" },
  { label: "Settings", href: "/admin/settings", icon: "Settings", superAdminOnly: true },
] as const;
