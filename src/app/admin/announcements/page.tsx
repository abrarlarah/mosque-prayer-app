"use client";

import React, { useState } from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/admin-header";
import { sampleAnnouncements, sampleMosques } from "@/lib/sample-data";
import {
  Megaphone,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  Eye,
  CheckCircle2,
} from "lucide-react";

export default function AnnouncementsAdminPage() {
  const [announcements, setAnnouncements] = useState(sampleAnnouncements);

  const getMosqueName = (id: string) => {
    return sampleMosques.find((m) => m.id === id)?.name || "All Mosques";
  };

  const handleToggleStatus = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const nextStatus = a.status === "published" ? "draft" : "published";
          return { ...a, status: nextStatus };
        }
        return a;
      })
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Permanently delete this announcement?")) {
      setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    }
  };

  return (
    <div>
      <AdminHeader
        title="Announcements Management"
        subtitle="Publish notices, Ramadan/Eid advisories, and timing changes across mosques."
        actions={
          <Link
            href="/admin/announcements/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:bg-primary/95 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>New Announcement</span>
          </Link>
        }
      />

      <div className="px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
                  <th className="py-4 px-6 font-semibold">Title &amp; Message</th>
                  <th className="py-4 px-4 font-semibold">Mosque</th>
                  <th className="py-4 px-4 font-semibold">Type</th>
                  <th className="py-4 px-4 font-semibold">Priority</th>
                  <th className="py-4 px-4 font-semibold">Valid Period</th>
                  <th className="py-4 px-4 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {announcements.map((ann) => (
                  <tr key={ann.id} className="hover:bg-muted/10 transition-colors">
                    <td className="py-4 px-6 max-w-md">
                      <div className="font-bold text-foreground">{ann.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                        {ann.message}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs font-medium text-foreground">
                      {getMosqueName(ann.mosqueId)}
                    </td>

                    <td className="py-4 px-4">
                      <span className="text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                        {ann.type}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`text-xs font-semibold ${
                          ann.priority === "urgent" || ann.priority === "high"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-muted-foreground"
                        }`}
                      >
                        {ann.priority}
                      </span>
                    </td>

                    <td className="py-4 px-4 font-mono text-xs text-muted-foreground">
                      {ann.startDate} to {ann.endDate}
                    </td>

                    <td className="py-4 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(ann.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition-colors ${
                          ann.status === "published"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {ann.status === "published" ? "Live" : "Draft"}
                      </button>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(ann.id)}
                        className="p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                        title="Delete announcement"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
