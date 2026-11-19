import React from "react";
import MosqueListingSection from "@/components/public/mosque-listing-section";
import { getActiveMosques } from "@/lib/sample-data";

export const metadata = {
  title: "Browse All Mosques | Salah Times",
  description:
    "Explore registered mosques and their up-to-date prayer schedules, Adhan, Iqamah, and Jummah times.",
};

export default function MosquesPage() {
  const mosques = getActiveMosques();

  return (
    <div className="py-8">
      <MosqueListingSection
        initialMosques={mosques}
        title="All Mosques Directory"
        subtitle="Select any mosque to view full prayer timetables, upcoming Jamaat countdown, and announcements."
      />
    </div>
  );
}
