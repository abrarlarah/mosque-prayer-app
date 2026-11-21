import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { samplePrayerTimes, sampleJummahSchedules } from "@/lib/sample-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

const MOSQUE_UUID_MAP: Record<string, string> = {
  m_bilal: "00000000-0000-0000-0000-000000000001",
  "jamia-bilal-masjid": "00000000-0000-0000-0000-000000000001",
  m1: "00000000-0000-0000-0000-000000000002",
  "jamia-masjid-baramulla": "00000000-0000-0000-0000-000000000002",
  m2: "00000000-0000-0000-0000-000000000003",
  "masjid-noor-sopore": "00000000-0000-0000-0000-000000000003",
  m_pattan: "00000000-0000-0000-0000-000000000004",
  "jamia-masjid-pattan": "00000000-0000-0000-0000-000000000004",
  m3: "00000000-0000-0000-0000-000000000005",
  "jamia-masjid-tangmarg": "00000000-0000-0000-0000-000000000005",
  m4: "00000000-0000-0000-0000-000000000006",
  "jamia-masjid-srinagar": "00000000-0000-0000-0000-000000000006",
  m5: "00000000-0000-0000-0000-000000000007",
  "dargah-hazratbal": "00000000-0000-0000-0000-000000000007",
  m_anantnag: "00000000-0000-0000-0000-000000000008",
  "jamia-masjid-anantnag": "00000000-0000-0000-0000-000000000008",
};

function getMosqueUUID(id: string): string {
  if (MOSQUE_UUID_MAP[id]) return MOSQUE_UUID_MAP[id];
  if (id.includes("-") && id.length === 36) return id;
  return "00000000-0000-0000-0000-000000000001";
}

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0, s-maxage=0",
  Pragma: "no-cache",
  Expires: "0",
  "Surrogate-Control": "no-store",
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mosqueId = searchParams.get("mosqueId") || "m_bilal";
  const targetId = getMosqueUUID(mosqueId);

  let formattedPrayers = samplePrayerTimes[mosqueId] || samplePrayerTimes["m_bilal"] || [];
  let formattedJummah = sampleJummahSchedules[mosqueId] || sampleJummahSchedules["m_bilal"] || [];
  let source = "fallback";

  const adminClient = createAdminClient();
  if (adminClient) {
    try {
      // 1. Fetch 5 Daily Prayers from Supabase
      const { data: pData, error: pErr } = await adminClient
        .from("default_prayer_schedules")
        .select("*")
        .eq("mosque_id", targetId);

      if (!pErr && pData && pData.length > 0) {
        const order = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
        formattedPrayers = pData
          .map((row) => ({
            name: row.prayer_name.charAt(0).toUpperCase() + row.prayer_name.slice(1).toLowerCase(),
            adhanTime: row.adhan_time ? row.adhan_time.slice(0, 5) : null,
            jamaatTime: row.jamaat_time ? row.jamaat_time.slice(0, 5) : null,
            isEnabled: row.is_enabled,
          }))
          .sort((a, b) => order.indexOf(a.name.toLowerCase()) - order.indexOf(b.name.toLowerCase()));
        source = "database";
      }

      // 2. Fetch Friday Jummah Sessions from Supabase
      const { data: jData, error: jErr } = await adminClient
        .from("jummah_schedules")
        .select("*")
        .eq("mosque_id", targetId)
        .order("session_number", { ascending: true });

      if (!jErr && jData && jData.length > 0) {
        formattedJummah = jData.map((row) => ({
          id: row.id,
          mosqueId,
          sessionNumber: row.session_number,
          khutbahTime: row.khutbah_time ? row.khutbah_time.slice(0, 5) : "12:45",
          jamaatTime: row.jamaat_time ? row.jamaat_time.slice(0, 5) : "13:15",
          isEnabled: row.is_enabled ?? true,
          note: row.khateeb_name || undefined,
        }));
        source = "database";
      }
    } catch (e) {
      console.error("Supabase GET prayer times error:", e);
    }
  }

  return NextResponse.json(
    {
      success: true,
      mosqueId,
      prayers: formattedPrayers,
      jummah: formattedJummah,
      source,
      timestamp: Date.now(),
    },
    {
      status: 200,
      headers: NO_CACHE_HEADERS,
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mosqueId, prayers, jummah } = body;

    if (!mosqueId) {
      return NextResponse.json(
        { success: false, error: "Invalid payload. mosqueId is required." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const targetId = getMosqueUUID(mosqueId);
    const adminClient = createAdminClient();

    if (adminClient) {
      // 1. Update 5 Daily Prayers in Supabase
      if (Array.isArray(prayers) && prayers.length > 0) {
        for (const p of prayers) {
          if (!p.name || !p.jamaatTime) continue;
          const prayerName = p.name.charAt(0).toUpperCase() + p.name.slice(1).toLowerCase();
          const adhan = p.adhanTime ? (p.adhanTime.length === 5 ? `${p.adhanTime}:00` : p.adhanTime) : null;
          const jamaat = p.jamaatTime.length === 5 ? `${p.jamaatTime}:00` : p.jamaatTime;

          await adminClient
            .from("default_prayer_schedules")
            .upsert(
              {
                mosque_id: targetId,
                prayer_name: prayerName,
                adhan_time: adhan,
                jamaat_time: jamaat,
                is_enabled: p.isEnabled ?? true,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "mosque_id, prayer_name" }
            );
        }
      }

      // 2. Update Friday Jummah in Supabase
      if (jummah && (jummah.jamaatTime || jummah.khutbahTime)) {
        const khutbah = jummah.khutbahTime
          ? (jummah.khutbahTime.length === 5 ? `${jummah.khutbahTime}:00` : jummah.khutbahTime)
          : "12:45:00";
        const jamaat = jummah.jamaatTime
          ? (jummah.jamaatTime.length === 5 ? `${jummah.jamaatTime}:00` : jummah.jamaatTime)
          : "13:15:00";

        await adminClient
          .from("jummah_schedules")
          .upsert(
            {
              mosque_id: targetId,
              session_number: 1,
              khutbah_time: khutbah,
              jamaat_time: jamaat,
              is_enabled: true,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "mosque_id, session_number" }
          );
      }
    }

    // Also update in-memory fallback for instant consistency
    if (Array.isArray(prayers) && prayers.length > 0) {
      samplePrayerTimes[mosqueId] = prayers;
      samplePrayerTimes[targetId] = prayers;
      if (mosqueId === "m_bilal") {
        samplePrayerTimes["00000000-0000-0000-0000-000000000001"] = prayers;
      }
    }

    if (jummah && (jummah.jamaatTime || jummah.khutbahTime)) {
      const session = [
        {
          id: `j_${mosqueId}`,
          mosqueId,
          sessionNumber: 1,
          khutbahTime: jummah.khutbahTime || "12:45",
          jamaatTime: jummah.jamaatTime || "13:15",
          isEnabled: true,
        },
      ];
      sampleJummahSchedules[mosqueId] = session;
      sampleJummahSchedules[targetId] = session;
      if (mosqueId === "m_bilal") {
        sampleJummahSchedules["00000000-0000-0000-0000-000000000001"] = session;
      }
    }

    return NextResponse.json(
      { success: true, message: "Timetable & Jummah updated successfully" },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("API error updating prayer times:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
