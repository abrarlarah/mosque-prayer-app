"use client";

import React, { use, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/admin-header";
import { sampleMosques, sampleMosqueSettings } from "@/lib/sample-data";
import {
  ArrowLeft,
  Save,
  Building2,
  Tv,
  CheckCircle2,
  Trash2,
  ExternalLink,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditMosquePage({ params }: PageProps) {
  const router = useRouter();
  const { id } = use(params);
  const mosque = sampleMosques.find((m) => m.id === id);

  if (!mosque) {
    notFound();
  }

  const settings = sampleMosqueSettings[mosque.id] || {
    mosqueId: mosque.id,
    showAdhanTimes: true,
    showJamaatTimes: true,
    timeFormat: "12h" as const,
    showHijriDate: true,
    displayModeEnabled: true,
  };

  const [name, setName] = useState(mosque.name);
  const [address, setAddress] = useState(mosque.address);
  const [city, setCity] = useState(mosque.city);
  const [state, setState] = useState(mosque.state);
  const [country, setCountry] = useState(mosque.country);
  const [contactNumber, setContactNumber] = useState(mosque.contactNumber || "");
  const [email, setEmail] = useState(mosque.email || "");
  const [website, setWebsite] = useState(mosque.website || "");
  const [description, setDescription] = useState(mosque.description || "");
  const [status, setStatus] = useState(mosque.status);

  // Settings
  const [showAdhan, setShowAdhan] = useState(settings.showAdhanTimes);
  const [timeFormat, setTimeFormat] = useState(settings.timeFormat);
  const [showHijri, setShowHijri] = useState(settings.showHijriDate);
  const [displayEnabled, setDisplayEnabled] = useState(settings.displayModeEnabled);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div>
      <AdminHeader
        title={`Edit ${mosque.name}`}
        subtitle={`Configure mosque profile, contact details, and display parameters.`}
        actions={
          <div className="flex items-center gap-2">
            <Link
              href={`/mosques/${mosque.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs sm:text-sm font-semibold hover:bg-muted transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Page</span>
            </Link>
            <Link
              href="/admin/mosques"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border text-xs sm:text-sm font-semibold hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </Link>
          </div>
        }
      />

      <div className="px-6 sm:px-8 max-w-4xl mx-auto space-y-6">
        {isSaved && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">Mosque details updated successfully!</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Mosque Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="active">Active (Visible Publicly)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Physical Address
              </label>
              <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                City
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                State
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
                Contact Phone
              </label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-1.5">
                Description / Community Note
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Mosque Specific Display Settings */}
          <div className="pt-6 border-t border-border">
            <h3 className="text-base font-bold text-foreground mb-4">
              Timetable &amp; Display Configurations
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/20 border border-border">
                <span className="text-sm font-medium text-foreground">
                  Show Adhan times alongside Iqamah
                </span>
                <input
                  type="checkbox"
                  checked={showAdhan}
                  onChange={(e) => setShowAdhan(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/20 border border-border">
                <span className="text-sm font-medium text-foreground">
                  Enable TV Digital Signage Mode
                </span>
                <input
                  type="checkbox"
                  checked={displayEnabled}
                  onChange={(e) => setDisplayEnabled(e.target.checked)}
                  className="w-4 h-4 accent-primary rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/20 border border-border">
                <span className="text-sm font-medium text-foreground">
                  Time Format
                </span>
                <select
                  value={timeFormat}
                  onChange={(e) => setTimeFormat(e.target.value as "12h" | "24h")}
                  className="px-3 py-1.5 rounded-lg border border-input bg-background text-xs font-semibold"
                >
                  <option value="12h">12-Hour (AM/PM)</option>
                  <option value="24h">24-Hour (Military)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex items-center justify-end gap-3">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/95 transition-all shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Update Mosque Details</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
