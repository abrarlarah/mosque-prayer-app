"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/admin/admin-header";
import { Save, CheckCircle2, Sliders, Tv, Bell, Globe } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function AdminSettingsPage() {
  const [appName, setAppName] = useState(APP_NAME);
  const [defaultTimezone, setDefaultTimezone] = useState("Asia/Kolkata");
  const [defaultFormat, setDefaultFormat] = useState<"12h" | "24h">("12h");
  const [showHijri, setShowHijri] = useState(true);
  const [tvSignageEnabled, setTvSignageEnabled] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div>
      <AdminHeader
        title="Global Platform Settings"
        subtitle="Configure default time formats, display modes, and system preferences."
      />

      <div className="px-6 sm:px-8 max-w-4xl mx-auto space-y-6">
        {isSaved && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">System settings saved successfully!</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-sm space-y-6"
        >
          <div className="space-y-6">
            <div>
              <h2 className="text-base font-bold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                <span>General Platform Configuration</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Platform Branding Name
                  </label>
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                    Default Regional Timezone
                  </label>
                  <input
                    type="text"
                    value={defaultTimezone}
                    onChange={(e) => setDefaultTimezone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-input bg-background font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-base font-bold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2">
                <Tv className="w-4 h-4 text-primary" />
                <span>Display &amp; Signage Settings</span>
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border">
                  <div>
                    <div className="font-semibold text-sm text-foreground">
                      Enable Digital TV Signage Mode
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Allows mosques to run fullscreen prayer timetables on TV screens
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={tvSignageEnabled}
                    onChange={(e) => setTvSignageEnabled(e.target.checked)}
                    className="w-5 h-5 accent-primary rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border">
                  <div>
                    <div className="font-semibold text-sm text-foreground">
                      Show Hijri Calendar Date
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Displays calculated Islamic date alongside Gregorian date
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={showHijri}
                    onChange={(e) => setShowHijri(e.target.checked)}
                    className="w-5 h-5 accent-primary rounded cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-muted/20 border border-border">
                  <div>
                    <div className="font-semibold text-sm text-foreground">
                      Default Clock Format
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Canonical time presentation across timetable components
                    </div>
                  </div>
                  <select
                    value={defaultFormat}
                    onChange={(e) => setDefaultFormat(e.target.value as "12h" | "24h")}
                    className="px-3 py-1.5 rounded-lg border border-input bg-background text-xs font-semibold"
                  >
                    <option value="12h">12-Hour (AM/PM)</option>
                    <option value="24h">24-Hour (Military)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/95 transition-all shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Configuration</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
