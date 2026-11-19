import React from "react";
import HomepagePrayerBoard from "@/components/public/homepage-prayer-board";
import {
  getActiveMosques,
  getDefaultMosque,
} from "@/lib/sample-data";

export const metadata = {
  title: "Jamia Bilal Masjid — Live Prayer Timetable & Salah Times",
  description:
    "Official live 5 daily prayer timings, Adhan & Iqamah schedule for Jamia Bilal Masjid, Sherwani Colony, Khawajabagh, Baramulla.",
};

export default function HomePage() {
  const mosques = getActiveMosques();
  const defaultMosque = getDefaultMosque();

  return (
    <div className="flex flex-col">
      {/* ─── DIRECT PRAYERS BOARD (JAMIA BILAL MASJID) ────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-primary/5 to-background pt-5 pb-12 sm:pt-7 sm:pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HomepagePrayerBoard
            mosques={mosques}
            defaultMosque={defaultMosque}
          />
        </div>
      </section>
    </div>
  );
}
