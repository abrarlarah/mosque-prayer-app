"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/admin-header";
import { generateSlug } from "@/lib/utils";
import { sampleMosques, samplePrayerTimes, getDistricts } from "@/lib/sample-data";
import type { Mosque } from "@/types/mosque";
import { ArrowLeft, Save, Building2, MapPin } from "lucide-react";

export default function NewMosquePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [district, setDistrict] = useState("Baramulla");
  const [town, setTown] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Baramulla");
  const [state, setState] = useState("Jammu & Kashmir");
  const [country, setCountry] = useState("India");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [timezone, setTimezone] = useState("Asia/Kolkata");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const existingDistricts = ["Baramulla", "Srinagar", "Anantnag", "Budgam", "Pulwama", "Kupwara", "Ganderbal"];

  const handleNameChange = (val: string) => {
    setName(val);
    setSlug(generateSlug(val));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `m_${Date.now()}`;
    const newMosque: Mosque = {
      id: newId,
      name,
      slug: slug || generateSlug(name),
      address,
      town: town.trim() || city,
      city: city.trim() || district,
      district,
      state,
      country,
      timezone,
      contactNumber,
      email,
      website: website || null,
      description,
      isDefault: false,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add to in-memory catalog
    sampleMosques.push(newMosque);

    // Initialize standard baseline 5 prayer times
    samplePrayerTimes[newId] = [
      { name: "Fajr", adhanTime: "05:15", jamaatTime: "05:45", isEnabled: true },
      { name: "Dhuhr", adhanTime: "12:30", jamaatTime: "13:00", isEnabled: true },
      { name: "Asr", adhanTime: "15:45", jamaatTime: "16:15", isEnabled: true },
      { name: "Maghrib", adhanTime: "17:30", jamaatTime: "17:35", isEnabled: true },
      { name: "Isha", adhanTime: "19:15", jamaatTime: "19:45", isEnabled: true },
    ];

    try {
      const stored = localStorage.getItem("salah_custom_mosques");
      const list = stored ? JSON.parse(stored) : [];
      list.push(newMosque);
      localStorage.setItem("salah_custom_mosques", JSON.stringify(list));
    } catch {}

    alert(`Mosque "${name}" registered successfully under District: ${district}!`);
    router.push("/admin/mosques");
  };

  return (
    <div>
      <AdminHeader
        title="Register New Mosque"
        subtitle="Super Admins can add mosques to the directory with district and town categorization."
        actions={
          <Link
            href="/admin/mosques"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs sm:text-sm font-semibold hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Cancel</span>
          </Link>
        }
      />

      <div className="px-6 sm:px-8 max-w-4xl mx-auto">
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Mosque Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Jamia Masjid Sopore"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Public URL Slug *
              </label>
              <div className="flex rounded-xl border border-input bg-muted/40 overflow-hidden text-sm">
                <span className="px-3 py-2.5 text-muted-foreground text-xs font-mono select-none">
                  /mosques/
                </span>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(generateSlug(e.target.value))}
                  placeholder="jamia-masjid-sopore"
                  className="w-full px-3 py-2.5 bg-transparent font-mono text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* District & Town Cascading categorization */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                District *
              </label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setCity(e.target.value);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
              >
                {existingDistricts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Town / Neighborhood / Area *
              </label>
              <input
                type="text"
                required
                value={town}
                onChange={(e) => setTown(e.target.value)}
                placeholder="e.g. Sopore Main, Old Town, Khawajabagh"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Physical Address *
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Main Chowk, Near Post Office"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                City *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Baramulla"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                State / Province *
              </label>
              <input
                type="text"
                required
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Timezone *
              </label>
              <input
                type="text"
                required
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                placeholder="Asia/Kolkata"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Contact Phone
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                placeholder="+91 1952 000000"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Official Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="office@mosque.org"
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Description / History
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief introduction, congregational capacity, or community info..."
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <Link
              href="/admin/mosques"
              className="px-5 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/95 transition-all shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save &amp; Register</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
