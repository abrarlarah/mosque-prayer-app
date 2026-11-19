export interface Mosque {
  id: string;
  name: string;
  slug: string;
  address: string;
  town?: string;
  city: string;
  district: string;
  state: string;
  country: string;
  isDefault?: boolean;
  latitude?: number | null;
  longitude?: number | null;
  contactNumber?: string | null;
  email?: string | null;
  website?: string | null;
  logoUrl?: string | null;
  description?: string | null;
  timezone: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}

export interface PrayerTime {
  name: string;
  adhanTime: string | null;
  jamaatTime: string | null;
  note?: string | null;
  isEnabled: boolean;
}

export interface DailyPrayerSchedule {
  mosqueId: string;
  date: string;
  prayers: PrayerTime[];
  source: "override" | "monthly" | "default";
}

export interface JummahSession {
  id: string;
  mosqueId: string;
  sessionNumber: number;
  khutbahTime?: string | null;
  jamaatTime: string;
  note?: string | null;
  isEnabled: boolean;
  effectiveFrom?: string | null;
  effectiveUntil?: string | null;
}

export interface Announcement {
  id: string;
  mosqueId: string;
  title: string;
  message: string;
  type: "general" | "ramadan" | "eid" | "timing_change" | "event" | "emergency";
  priority: "low" | "normal" | "high" | "urgent";
  status: "draft" | "published" | "archived";
  startDate: string;
  endDate: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface MonthlySchedule {
  id: string;
  mosqueId: string;
  year: number;
  month: number;
  status: "draft" | "published";
  publishedAt?: string | null;
  entries: MonthlyScheduleEntry[];
}

export interface MonthlyScheduleEntry {
  id: string;
  scheduleId: string;
  date: string;
  prayerName: string;
  adhanTime: string | null;
  jamaatTime: string | null;
  note?: string | null;
  isEnabled: boolean;
}

export interface MosqueSettings {
  mosqueId: string;
  showAdhanTimes: boolean;
  showJamaatTimes: boolean;
  timeFormat: "12h" | "24h";
  showHijriDate: boolean;
  displayModeEnabled: boolean;
}

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  role: "super_admin" | "mosque_admin";
  avatarUrl?: string | null;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  mosqueId: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  previousValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
  createdAt: string;
}
