import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { samplePrayerTimes, sampleMosques } from "@/lib/sample-data";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const mosqueId = searchParams.get("mosqueId") || "m_bilal";

  const adminClient = createAdminClient();
  if (adminClient) {
    try {
      // Map string mosqueId to UUID if needed
      let targetId = mosqueId;
      if (mosqueId === "m_bilal" || mosqueId === "jamia-bilal-masjid") {
        targetId = "00000000-0000-0000-0000-000000000001";
      }

      const { data, error } = await adminClient
        .from("default_prayer_schedules")
        .select("*")
        .eq("mosque_id", targetId);

      if (!error && data && data.length > 0) {
        const order = ["fajr", "dhuhr", "asr", "maghrib", "isha"];
        const formatted = data
          .map((row) => ({
            name: row.prayer_name.charAt(0).toUpperCase() + row.prayer_name.slice(1),
            adhanTime: row.adhan_time ? row.adhan_time.slice(0, 5) : null,
            jamaatTime: row.jamaat_time ? row.jamaat_time.slice(0, 5) : null,
            isEnabled: row.is_enabled,
          }))
          .sort((a, b) => order.indexOf(a.name.toLowerCase()) - order.indexOf(b.name.toLowerCase()));

        return NextResponse.json({ success: true, prayers: formatted, source: "database" });
      }
    } catch (e) {
      console.error("Supabase GET prayer times error:", e);
    }
  }

  // Fallback to in-memory sample data
  const fallback = samplePrayerTimes[mosqueId] || samplePrayerTimes["m_bilal"] || [];
  return NextResponse.json({ success: true, prayers: fallback, source: "fallback" });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { mosqueId, prayers } = body;

    if (!mosqueId || !Array.isArray(prayers)) {
      return NextResponse.json(
        { success: false, error: "Invalid payload. mosqueId and prayers array required." },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    if (adminClient) {
      let targetId = mosqueId;
      if (mosqueId === "m_bilal" || mosqueId === "jamia-bilal-masjid") {
        targetId = "00000000-0000-0000-0000-000000000001";
      }

      for (const p of prayers) {
        if (!p.name || !p.jamaatTime) continue;
        const prayerName = p.name.toLowerCase();

        // format time with seconds if needed
        const adhan = p.adhanTime ? (p.adhanTime.length === 5 ? `${p.adhanTime}:00` : p.adhanTime) : null;
        const jamaat = p.jamaatTime.length === 5 ? `${p.jamaatTime}:00` : p.jamaatTime;

        await adminClient
          .from("default_prayer_schedules")
          .update({
            adhan_time: adhan,
            jamaat_time: jamaat,
            is_enabled: p.isEnabled ?? true,
            updated_at: new Date().toISOString(),
          })
          .eq("mosque_id", targetId)
          .eq("prayer_name", prayerName);
      }
    }

    // Also update in-memory sample data for instant cache
    samplePrayerTimes[mosqueId] = prayers;
    if (mosqueId === "m_bilal" || mosqueId === "00000000-0000-0000-0000-000000000001") {
      samplePrayerTimes["m_bilal"] = prayers;
      samplePrayerTimes["00000000-0000-0000-0000-000000000001"] = prayers;
    }

    return NextResponse.json({ success: true, message: "Prayer times updated successfully" });
  } catch (error: any) {
    console.error("API error updating prayer times:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
