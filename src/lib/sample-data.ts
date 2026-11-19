import type {
  Mosque,
  PrayerTime,
  JummahSession,
  Announcement,
  MosqueSettings,
} from "@/types/mosque";

// ─── Mosques Catalog (Organized by District and Town) ─────────────────────────

export const sampleMosques: Mosque[] = [
  // ── DEFAULT MOSQUE ──────────────────────────────────────────────────────────
  {
    id: "m_bilal",
    name: "Jamia Bilal Masjid",
    slug: "jamia-bilal-masjid",
    address: "Sherwani Colony, Khawajabagh",
    town: "Khawajabagh",
    city: "Baramulla",
    district: "Baramulla",
    state: "Jammu & Kashmir",
    country: "India",
    isDefault: true,
    latitude: 34.205,
    longitude: 74.372,
    contactNumber: "+91 1952 235111",
    email: "jamiabilal.khawajabagh@gmail.com",
    website: null,
    logoUrl: null,
    description:
      "Jamia Bilal Masjid located at Sherwani Colony, Khawajabagh, Baramulla. The central congregational mosque serving Khawajabagh community with five daily prayers, Friday Jummah prayers, and educational halaqas.",
    timezone: "Asia/Kolkata",
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "m1",
    name: "Jamia Masjid Baramulla (Old Town)",
    slug: "jamia-masjid-baramulla",
    address: "Old Town, Near Jhelum River",
    town: "Old Town",
    city: "Baramulla",
    district: "Baramulla",
    state: "Jammu & Kashmir",
    country: "India",
    latitude: 34.198,
    longitude: 74.364,
    contactNumber: "+91 1952 234567",
    email: "info@jamiamasjidbaramulla.org",
    website: null,
    logoUrl: null,
    description:
      "The historic Jamia Masjid of Baramulla Old Town, serving the community with daily prayers, Friday sermons, and Islamic education programs.",
    timezone: "Asia/Kolkata",
    status: "active",
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "m2",
    name: "Masjid Noor",
    slug: "masjid-noor",
    address: "College Road, Sopore",
    town: "Sopore",
    city: "Sopore",
    district: "Baramulla",
    state: "Jammu & Kashmir",
    country: "India",
    latitude: 34.288,
    longitude: 74.472,
    contactNumber: "+91 1954 345678",
    email: null,
    website: null,
    logoUrl: null,
    description:
      "Masjid Noor serves the Sopore apple town community with five daily prayers, weekly Jummah prayers, and community programs.",
    timezone: "Asia/Kolkata",
    status: "active",
    createdAt: "2024-02-15T00:00:00Z",
    updatedAt: "2024-02-15T00:00:00Z",
  },
  {
    id: "m_pattan",
    name: "Markazi Jamia Masjid Pattan",
    slug: "markazi-jamia-masjid-pattan",
    address: "National Highway, Main Market",
    town: "Pattan",
    city: "Pattan",
    district: "Baramulla",
    state: "Jammu & Kashmir",
    country: "India",
    latitude: 34.161,
    longitude: 74.557,
    contactNumber: "+91 1954 220011",
    email: null,
    website: null,
    logoUrl: null,
    description: "Central congregational mosque of Pattan town along the Srinagar-Baramulla highway.",
    timezone: "Asia/Kolkata",
    status: "active",
    createdAt: "2024-02-20T00:00:00Z",
    updatedAt: "2024-02-20T00:00:00Z",
  },
  {
    id: "m3",
    name: "Central Mosque Srinagar (Jamia Masjid)",
    slug: "central-mosque-srinagar",
    address: "Nowhatta, Downtown",
    town: "Downtown",
    city: "Srinagar",
    district: "Srinagar",
    state: "Jammu & Kashmir",
    country: "India",
    latitude: 34.083,
    longitude: 74.797,
    contactNumber: "+91 194 2456789",
    email: "contact@centralmosquesrinagar.org",
    website: "https://centralmosquesrinagar.org",
    logoUrl: null,
    description:
      "Central historic Jamia Masjid in Nowhatta Srinagar, known for its majestic 378 deodar wooden pillars and scholarly traditions.",
    timezone: "Asia/Kolkata",
    status: "active",
    createdAt: "2024-03-10T00:00:00Z",
    updatedAt: "2024-03-10T00:00:00Z",
  },
  {
    id: "m4",
    name: "Bilal Masjid Hazratbal",
    slug: "bilal-masjid-hazratbal",
    address: "Hazratbal Road, Near Dargah",
    town: "Hazratbal",
    city: "Srinagar",
    district: "Srinagar",
    state: "Jammu & Kashmir",
    country: "India",
    latitude: 34.128,
    longitude: 74.838,
    contactNumber: null,
    email: null,
    website: null,
    logoUrl: null,
    description:
      "Bilal Masjid provides daily prayer services and Quran education programs in Hazratbal.",
    timezone: "Asia/Kolkata",
    status: "active",
    createdAt: "2024-04-20T00:00:00Z",
    updatedAt: "2024-04-20T00:00:00Z",
  },
  {
    id: "m5",
    name: "Darul Uloom Mosque Nowgam",
    slug: "darul-uloom-mosque-nowgam",
    address: "University Road, Nowgam",
    town: "Nowgam",
    city: "Srinagar",
    district: "Srinagar",
    state: "Jammu & Kashmir",
    country: "India",
    latitude: 34.012,
    longitude: 74.782,
    contactNumber: "+91 194 3456789",
    email: "darul.uloom@email.com",
    website: null,
    logoUrl: null,
    description:
      "Darul Uloom Mosque is attached to the Islamic seminary in Nowgam Srinagar offering daily prayers and lectures.",
    timezone: "Asia/Kolkata",
    status: "active",
    createdAt: "2024-05-05T00:00:00Z",
    updatedAt: "2024-05-05T00:00:00Z",
  },
  {
    id: "m_anantnag",
    name: "Jamia Masjid Hanfia Anantnag",
    slug: "jamia-masjid-hanfia-anantnag",
    address: "Reshi Bazar, Main Town",
    town: "Main Town",
    city: "Anantnag",
    district: "Anantnag",
    state: "Jammu & Kashmir",
    country: "India",
    latitude: 33.731,
    longitude: 75.149,
    contactNumber: "+91 1932 223344",
    email: null,
    website: null,
    logoUrl: null,
    description: "Historic central mosque located at Reshi Bazar in Anantnag town.",
    timezone: "Asia/Kolkata",
    status: "active",
    createdAt: "2024-05-15T00:00:00Z",
    updatedAt: "2024-05-15T00:00:00Z",
  },
];

// ─── Prayer Times for All Mosques ───────────────────────────────────────────

export const samplePrayerTimes: Record<string, PrayerTime[]> = {
  // Default Mosque: Jamia Bilal Masjid, Sherwani Colony, Khawajabagh
  m_bilal: [
    { name: "Fajr", adhanTime: "05:15", jamaatTime: "05:45", isEnabled: true },
    { name: "Dhuhr", adhanTime: "12:30", jamaatTime: "13:00", isEnabled: true },
    { name: "Asr", adhanTime: "15:45", jamaatTime: "16:15", isEnabled: true },
    { name: "Maghrib", adhanTime: "17:30", jamaatTime: "17:35", isEnabled: true },
    { name: "Isha", adhanTime: "19:15", jamaatTime: "19:45", isEnabled: true },
  ],
  m1: [
    { name: "Fajr", adhanTime: "05:15", jamaatTime: "05:45", isEnabled: true },
    { name: "Dhuhr", adhanTime: "12:30", jamaatTime: "13:00", isEnabled: true },
    { name: "Asr", adhanTime: "15:45", jamaatTime: "16:15", isEnabled: true },
    { name: "Maghrib", adhanTime: "17:30", jamaatTime: "17:35", isEnabled: true },
    { name: "Isha", adhanTime: "19:15", jamaatTime: "19:45", isEnabled: true },
  ],
  m2: [
    { name: "Fajr", adhanTime: "05:10", jamaatTime: "05:40", isEnabled: true },
    { name: "Dhuhr", adhanTime: "12:30", jamaatTime: "13:00", isEnabled: true },
    { name: "Asr", adhanTime: "15:45", jamaatTime: "16:10", isEnabled: true },
    { name: "Maghrib", adhanTime: "17:28", jamaatTime: "17:33", isEnabled: true },
    { name: "Isha", adhanTime: "19:10", jamaatTime: "19:40", isEnabled: true },
  ],
  m_pattan: [
    { name: "Fajr", adhanTime: "05:12", jamaatTime: "05:42", isEnabled: true },
    { name: "Dhuhr", adhanTime: "12:30", jamaatTime: "13:00", isEnabled: true },
    { name: "Asr", adhanTime: "15:45", jamaatTime: "16:15", isEnabled: true },
    { name: "Maghrib", adhanTime: "17:29", jamaatTime: "17:34", isEnabled: true },
    { name: "Isha", adhanTime: "19:12", jamaatTime: "19:42", isEnabled: true },
  ],
  m3: [
    { name: "Fajr", adhanTime: "05:20", jamaatTime: "05:50", isEnabled: true },
    { name: "Dhuhr", adhanTime: "12:35", jamaatTime: "13:05", isEnabled: true },
    { name: "Asr", adhanTime: "15:50", jamaatTime: "16:20", isEnabled: true },
    { name: "Maghrib", adhanTime: "17:32", jamaatTime: "17:37", isEnabled: true },
    { name: "Isha", adhanTime: "19:20", jamaatTime: "19:50", isEnabled: true },
  ],
  m4: [
    { name: "Fajr", adhanTime: "05:18", jamaatTime: "05:48", isEnabled: true },
    { name: "Dhuhr", adhanTime: "12:32", jamaatTime: "13:02", isEnabled: true },
    { name: "Asr", adhanTime: "15:48", jamaatTime: "16:18", isEnabled: true },
    { name: "Maghrib", adhanTime: "17:30", jamaatTime: "17:35", isEnabled: true },
    { name: "Isha", adhanTime: "19:18", jamaatTime: "19:48", isEnabled: true },
  ],
  m5: [
    { name: "Fajr", adhanTime: "05:22", jamaatTime: "05:52", isEnabled: true },
    { name: "Dhuhr", adhanTime: "12:35", jamaatTime: "13:05", isEnabled: true },
    { name: "Asr", adhanTime: "15:50", jamaatTime: "16:20", isEnabled: true },
    { name: "Maghrib", adhanTime: "17:33", jamaatTime: "17:38", isEnabled: true },
    { name: "Isha", adhanTime: "19:22", jamaatTime: "19:52", isEnabled: true },
  ],
  m_anantnag: [
    { name: "Fajr", adhanTime: "05:14", jamaatTime: "05:44", isEnabled: true },
    { name: "Dhuhr", adhanTime: "12:30", jamaatTime: "13:00", isEnabled: true },
    { name: "Asr", adhanTime: "15:45", jamaatTime: "16:15", isEnabled: true },
    { name: "Maghrib", adhanTime: "17:28", jamaatTime: "17:33", isEnabled: true },
    { name: "Isha", adhanTime: "19:15", jamaatTime: "19:45", isEnabled: true },
  ],
};

// ─── Jummah Schedules ────────────────────────────────────────────────────────

export const sampleJummahSchedules: Record<string, JummahSession[]> = {
  m_bilal: [
    {
      id: "j_bilal_1",
      mosqueId: "m_bilal",
      sessionNumber: 1,
      khutbahTime: "12:30",
      jamaatTime: "13:00",
      note: "Main Friday Congregational Prayer - Sherwani Colony",
      isEnabled: true,
    },
  ],
  m1: [
    {
      id: "j1",
      mosqueId: "m1",
      sessionNumber: 1,
      khutbahTime: "12:30",
      jamaatTime: "13:00",
      note: "Main Jummah prayer",
      isEnabled: true,
    },
    {
      id: "j2",
      mosqueId: "m1",
      sessionNumber: 2,
      khutbahTime: "13:30",
      jamaatTime: "14:00",
      note: "Second Jummah prayer",
      isEnabled: true,
    },
  ],
  m2: [
    {
      id: "j3",
      mosqueId: "m2",
      sessionNumber: 1,
      khutbahTime: "12:30",
      jamaatTime: "13:00",
      note: null,
      isEnabled: true,
    },
  ],
  m_pattan: [
    {
      id: "j_pattan_1",
      mosqueId: "m_pattan",
      sessionNumber: 1,
      khutbahTime: "12:30",
      jamaatTime: "13:00",
      note: "Pattan Central Jummah",
      isEnabled: true,
    },
  ],
  m3: [
    {
      id: "j4",
      mosqueId: "m3",
      sessionNumber: 1,
      khutbahTime: "12:15",
      jamaatTime: "12:45",
      note: "First session",
      isEnabled: true,
    },
    {
      id: "j5",
      mosqueId: "m3",
      sessionNumber: 2,
      khutbahTime: "13:15",
      jamaatTime: "13:45",
      note: "Second session",
      isEnabled: true,
    },
  ],
  m4: [
    {
      id: "j7",
      mosqueId: "m4",
      sessionNumber: 1,
      khutbahTime: "12:30",
      jamaatTime: "13:00",
      note: null,
      isEnabled: true,
    },
  ],
  m5: [
    {
      id: "j8",
      mosqueId: "m5",
      sessionNumber: 1,
      khutbahTime: "12:00",
      jamaatTime: "12:30",
      note: "Darul Uloom Jummah",
      isEnabled: true,
    },
  ],
  m_anantnag: [
    {
      id: "j_anantnag_1",
      mosqueId: "m_anantnag",
      sessionNumber: 1,
      khutbahTime: "12:30",
      jamaatTime: "13:00",
      note: "Main Hanfia Jummah",
      isEnabled: true,
    },
  ],
};

// ─── Announcements ───────────────────────────────────────────────────────────

export const sampleAnnouncements: Announcement[] = [
  {
    id: "a_bilal_1",
    mosqueId: "m_bilal",
    title: "Winter Prayer Timetable in Effect",
    message:
      "Asr and Isha jamaat timings at Jamia Bilal Masjid Sherwani Colony Khawajabagh have been adjusted for the winter season. Please refer to today's timetable.",
    type: "timing_change",
    priority: "high",
    status: "published",
    startDate: "2024-11-01",
    endDate: "2027-03-31",
    createdBy: "admin_bilal",
    createdAt: "2024-11-01T10:00:00Z",
    updatedAt: "2024-11-01T10:00:00Z",
  },
  {
    id: "a1",
    mosqueId: "m1",
    title: "Old Town Dars-e-Quran Program",
    message:
      "Weekly Dars-e-Quran will be held every Sunday after Maghrib prayer. All community members are cordially invited.",
    type: "general",
    priority: "normal",
    status: "published",
    startDate: "2024-11-01",
    endDate: "2027-03-31",
    createdBy: "admin1",
    createdAt: "2024-10-28T10:00:00Z",
    updatedAt: "2024-10-28T10:00:00Z",
  },
  {
    id: "a3",
    mosqueId: "m3",
    title: "Annual Community Fundraiser",
    message:
      "Join us for the annual community program in Srinagar downtown after Isha prayer. Refreshments will be provided.",
    type: "event",
    priority: "normal",
    status: "published",
    startDate: "2024-11-15",
    endDate: "2027-12-15",
    createdBy: "admin2",
    createdAt: "2024-11-10T09:00:00Z",
    updatedAt: "2024-11-10T09:00:00Z",
  },
];

// ─── Mosque Settings ─────────────────────────────────────────────────────────

export const sampleMosqueSettings: Record<string, MosqueSettings> = {
  m_bilal: {
    mosqueId: "m_bilal",
    showAdhanTimes: true,
    showJamaatTimes: true,
    timeFormat: "12h",
    showHijriDate: true,
    displayModeEnabled: true,
  },
  m1: {
    mosqueId: "m1",
    showAdhanTimes: true,
    showJamaatTimes: true,
    timeFormat: "12h",
    showHijriDate: true,
    displayModeEnabled: true,
  },
  m2: {
    mosqueId: "m2",
    showAdhanTimes: true,
    showJamaatTimes: true,
    timeFormat: "12h",
    showHijriDate: true,
    displayModeEnabled: false,
  },
  m_pattan: {
    mosqueId: "m_pattan",
    showAdhanTimes: true,
    showJamaatTimes: true,
    timeFormat: "12h",
    showHijriDate: true,
    displayModeEnabled: true,
  },
  m3: {
    mosqueId: "m3",
    showAdhanTimes: true,
    showJamaatTimes: true,
    timeFormat: "12h",
    showHijriDate: true,
    displayModeEnabled: true,
  },
  m4: {
    mosqueId: "m4",
    showAdhanTimes: false,
    showJamaatTimes: true,
    timeFormat: "12h",
    showHijriDate: true,
    displayModeEnabled: false,
  },
  m5: {
    mosqueId: "m5",
    showAdhanTimes: true,
    showJamaatTimes: true,
    timeFormat: "24h",
    showHijriDate: false,
    displayModeEnabled: false,
  },
  m_anantnag: {
    mosqueId: "m_anantnag",
    showAdhanTimes: true,
    showJamaatTimes: true,
    timeFormat: "12h",
    showHijriDate: true,
    displayModeEnabled: true,
  },
};

// ─── Filter & Lookup Helpers ─────────────────────────────────────────────────

export function getDefaultMosque(): Mosque {
  const found = sampleMosques.find((m) => m.isDefault && m.status === "active");
  return found || sampleMosques[0];
}

export function getMosqueBySlug(slug: string): Mosque | undefined {
  return sampleMosques.find((m) => m.slug === slug && m.status === "active");
}

export function getActiveMosques(): Mosque[] {
  return sampleMosques.filter((m) => m.status === "active");
}

export function getPrayerTimes(mosqueId: string): PrayerTime[] {
  return samplePrayerTimes[mosqueId] || [];
}

export function getJummahSessions(mosqueId: string): JummahSession[] {
  return (sampleJummahSchedules[mosqueId] || []).filter((j) => j.isEnabled);
}

export function getMosqueAnnouncements(mosqueId: string): Announcement[] {
  const today = new Date().toISOString().split("T")[0];
  return sampleAnnouncements.filter(
    (a) =>
      a.mosqueId === mosqueId &&
      a.status === "published" &&
      a.startDate <= today &&
      a.endDate >= today
  );
}

export function getSettings(mosqueId: string): MosqueSettings {
  return (
    sampleMosqueSettings[mosqueId] || {
      mosqueId,
      showAdhanTimes: true,
      showJamaatTimes: true,
      timeFormat: "12h" as const,
      showHijriDate: true,
      displayModeEnabled: true,
    }
  );
}

/**
 * Returns distinct list of all districts
 */
export function getDistricts(): string[] {
  const districts = sampleMosques
    .filter((m) => m.status === "active" && m.district)
    .map((m) => m.district);
  return Array.from(new Set(districts)).sort();
}

/**
 * Returns distinct towns for a selected district
 */
export function getTownsByDistrict(district: string): string[] {
  const towns = sampleMosques
    .filter(
      (m) =>
        m.status === "active" &&
        (!district || m.district.toLowerCase() === district.toLowerCase()) &&
        m.town
    )
    .map((m) => m.town!);
  return Array.from(new Set(towns)).sort();
}

/**
 * Filter mosques by District, Town, and search query
 */
export function filterMosques({
  district,
  town,
  query,
}: {
  district?: string;
  town?: string;
  query?: string;
}): Mosque[] {
  let list = getActiveMosques();

  if (district && district !== "all") {
    list = list.filter(
      (m) => m.district.toLowerCase() === district.toLowerCase()
    );
  }

  if (town && town !== "all") {
    list = list.filter(
      (m) => m.town?.toLowerCase() === town.toLowerCase()
    );
  }

  if (query && query.trim()) {
    const q = query.toLowerCase().trim();
    list = list.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.address.toLowerCase().includes(q) ||
        m.city.toLowerCase().includes(q) ||
        (m.town && m.town.toLowerCase().includes(q)) ||
        m.district.toLowerCase().includes(q)
    );
  }

  // Ensure default mosque is placed first if included in filtered results
  return list.sort((a, b) => {
    if (a.isDefault) return -1;
    if (b.isDefault) return 1;
    return a.name.localeCompare(b.name);
  });
}
