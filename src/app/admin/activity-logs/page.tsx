"use client";

import React from "react";
import AdminHeader from "@/components/admin/admin-header";
import { ScrollText, Clock, User, Building2, CheckCircle2 } from "lucide-react";

interface LogItem {
  id: string;
  user: string;
  mosque: string;
  action: string;
  entity: string;
  details: string;
  timestamp: string;
}

export default function ActivityLogsAdminPage() {
  const logs: LogItem[] = [
    {
      id: "log1",
      user: "Chief Administrator",
      mosque: "Jamia Masjid Baramulla",
      action: "Timing Changed",
      entity: "Prayer Schedule",
      details: "Updated Asr Jamaat to 16:15 and Isha Jamaat to 19:45 for winter season.",
      timestamp: "Today at 10:14 AM",
    },
    {
      id: "log2",
      user: "Baramulla Mosque Admin",
      mosque: "Jamia Masjid Baramulla",
      action: "Announcement Published",
      entity: "Announcement",
      details: "Published notice: 'Winter Prayer Time Changes' valid until March 2025.",
      timestamp: "Yesterday at 04:30 PM",
    },
    {
      id: "log3",
      user: "Chief Administrator",
      mosque: "Masjid Noor",
      action: "Jummah Updated",
      entity: "Jummah Schedule",
      details: "Updated Friday 1st session Khutbah to 12:30 and Jamaat to 13:00.",
      timestamp: "Nov 15, 2026, 02:15 PM",
    },
    {
      id: "log4",
      user: "Srinagar Central Admin",
      mosque: "Central Mosque Srinagar",
      action: "Monthly Timetable Published",
      entity: "Monthly Schedule",
      details: "Generated and published full 30-day timetable for November 2026.",
      timestamp: "Nov 10, 2026, 11:00 AM",
    },
    {
      id: "log5",
      user: "Chief Administrator",
      mosque: "Masjid Al-Falah",
      action: "Mosque Registered",
      entity: "Mosque Directory",
      details: "Registered new mosque entry with slug /mosques/masjid-al-falah.",
      timestamp: "Nov 01, 2026, 09:20 AM",
    },
  ];

  return (
    <div>
      <AdminHeader
        title="Audit &amp; Activity Logs"
        subtitle="Immutable audit trail of timing modifications, schedule publications, and administrative actions."
      />

      <div className="px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
                  <th className="py-4 px-6 font-semibold">Timestamp</th>
                  <th className="py-4 px-4 font-semibold">Administrator</th>
                  <th className="py-4 px-4 font-semibold">Mosque</th>
                  <th className="py-4 px-4 font-semibold">Action</th>
                  <th className="py-4 px-6 font-semibold">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/10 transition-colors">
                    <td className="py-4 px-6 whitespace-nowrap font-mono text-xs text-muted-foreground">
                      {log.timestamp}
                    </td>

                    <td className="py-4 px-4 font-semibold text-foreground whitespace-nowrap">
                      {log.user}
                    </td>

                    <td className="py-4 px-4 text-xs font-medium text-foreground whitespace-nowrap">
                      {log.mosque}
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-primary/10 text-primary">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-xs text-muted-foreground max-w-lg">
                      {log.details}
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
