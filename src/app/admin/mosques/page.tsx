import React from "react";
import Link from "next/link";
import AdminHeader from "@/components/admin/admin-header";
import { sampleMosques } from "@/lib/sample-data";
import { Plus, Building2, MapPin, ExternalLink, Settings, Edit } from "lucide-react";

export default function AdminMosquesPage() {
  return (
    <div>
      <AdminHeader
        title="Mosques Directory"
        subtitle="Manage all registered mosques, access permissions, and public visibility."
        actions={
          <Link
            href="/admin/mosques/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:bg-primary/95 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Mosque</span>
          </Link>
        }
      />

      <div className="px-6 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground bg-muted/40">
                  <th className="py-4 px-6 font-semibold">Mosque Name</th>
                  <th className="py-4 px-4 font-semibold">Slug (Public URL)</th>
                  <th className="py-4 px-4 font-semibold">Location</th>
                  <th className="py-4 px-4 font-semibold">Timezone</th>
                  <th className="py-4 px-4 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sampleMosques.map((mosque) => (
                  <tr key={mosque.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-foreground">{mosque.name}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {mosque.address}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-muted-foreground">
                      /mosques/{mosque.slug}
                    </td>
                    <td className="py-4 px-4 text-xs">
                      {mosque.city}, {mosque.state}
                    </td>
                    <td className="py-4 px-4 font-mono text-xs text-muted-foreground">
                      {mosque.timezone}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          mosque.status === "active"
                            ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {mosque.status === "active" ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-3">
                        <Link
                          href={`/admin/prayer-times/${mosque.id}`}
                          className="text-xs text-primary font-semibold hover:underline"
                        >
                          Timings
                        </Link>
                        <Link
                          href={`/admin/mosques/${mosque.id}`}
                          className="text-xs text-foreground font-semibold hover:underline"
                        >
                          Edit
                        </Link>
                        <Link
                          href={`/mosques/${mosque.slug}`}
                          target="_blank"
                          className="text-muted-foreground hover:text-foreground"
                          title="View public page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
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
