"use client";

import React, { useState } from "react";
import AdminHeader from "@/components/admin/admin-header";
import { sampleMosques, sampleJummahSchedules } from "@/lib/sample-data";
import { formatTime } from "@/lib/utils";
import type { JummahSession } from "@/types/mosque";
import {
  CalendarDays,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  Clock,
  Layers,
} from "lucide-react";

export default function JummahAdminPage() {
  const [selectedMosqueId, setSelectedMosqueId] = useState<string>("m1");
  const [sessions, setSessions] = useState<Record<string, JummahSession[]>>(
    sampleJummahSchedules
  );
  const [isSaved, setIsSaved] = useState(false);

  const currentMosque = sampleMosques.find((m) => m.id === selectedMosqueId);
  const currentSessions = sessions[selectedMosqueId] || [];

  const handleSessionChange = (
    idx: number,
    field: keyof JummahSession,
    value: unknown
  ) => {
    setSessions((prev) => {
      const mosqueSessions = [...(prev[selectedMosqueId] || [])];
      mosqueSessions[idx] = { ...mosqueSessions[idx], [field]: value };
      return { ...prev, [selectedMosqueId]: mosqueSessions };
    });
  };

  const handleAddSession = () => {
    const nextSessionNumber = currentSessions.length + 1;
    const newSession: JummahSession = {
      id: `j_${Date.now()}`,
      mosqueId: selectedMosqueId,
      sessionNumber: nextSessionNumber,
      khutbahTime: "13:30",
      jamaatTime: "14:00",
      note: `Session ${nextSessionNumber}`,
      isEnabled: true,
    };

    setSessions((prev) => ({
      ...prev,
      [selectedMosqueId]: [...(prev[selectedMosqueId] || []), newSession],
    }));
  };

  const handleDeleteSession = (idx: number) => {
    if (window.confirm("Delete this Jummah session?")) {
      setSessions((prev) => {
        const next = [...(prev[selectedMosqueId] || [])];
        next.splice(idx, 1);
        return { ...prev, [selectedMosqueId]: next };
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div>
      <AdminHeader
        title="Jummah Timetable Management"
        subtitle="Manage Friday congregational prayer sessions, Khutbah timings, and overflow capacity."
      />

      <div className="px-6 sm:px-8 max-w-5xl mx-auto space-y-6">
        {/* Mosque Selector */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
              Select Mosque
            </label>
            <select
              value={selectedMosqueId}
              onChange={(e) => setSelectedMosqueId(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-input bg-background text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {sampleMosques.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name} ({m.city})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleAddSession}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary/10 text-primary hover:bg-primary/20 text-xs sm:text-sm font-semibold transition-colors cursor-pointer self-start sm:self-end"
          >
            <Plus className="w-4 h-4" />
            <span>Add Jummah Session</span>
          </button>
        </div>

        {isSaved && (
          <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-800 dark:text-emerald-300 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">
              Jummah timetable updated and published for {currentMosque?.name}!
            </span>
          </div>
        )}

        {/* Sessions Form */}
        <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-primary" />
            <span>Configured Jummah Sessions ({currentSessions.length})</span>
          </h2>

          <div className="space-y-4">
            {currentSessions.map((session, idx) => (
              <div
                key={session.id}
                className="p-5 rounded-2xl border border-border bg-muted/20 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <span className="font-bold text-sm text-foreground">
                      Session {idx + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        handleSessionChange(idx, "isEnabled", !session.isEnabled)
                      }
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                        session.isEnabled
                          ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {session.isEnabled ? "Active" : "Disabled"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteSession(idx)}
                      className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                      title="Delete session"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Khutbah (Sermon) Time
                    </label>
                    <input
                      type="time"
                      value={session.khutbahTime || ""}
                      onChange={(e) =>
                        handleSessionChange(idx, "khutbahTime", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-xl border border-input bg-background font-mono text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Jamaat / Iqamah Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={session.jamaatTime || ""}
                      onChange={(e) =>
                        handleSessionChange(idx, "jamaatTime", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-xl border border-input bg-background font-mono text-xs font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1">
                      Optional Note / Hall
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Main Hall / Basement"
                      value={session.note || ""}
                      onChange={(e) =>
                        handleSessionChange(idx, "note", e.target.value)
                      }
                      className="w-full px-3 py-2 rounded-xl border border-input bg-background text-xs focus:outline-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-4 border-t border-border flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/95 transition-all shadow-md cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Jummah Schedule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
