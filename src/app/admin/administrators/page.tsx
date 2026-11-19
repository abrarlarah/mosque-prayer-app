"use client";

import React, { useState, useEffect } from "react";
import AdminHeader from "@/components/admin/admin-header";
import { sampleMosques } from "@/lib/sample-data";
import {
  Users,
  Shield,
  Plus,
  Mail,
  Building2,
  CheckCircle2,
  X,
  UserPlus,
  Trash2,
} from "lucide-react";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "mosque_admin";
  assignedMosques: string[];
  isActive: boolean;
}

const STORAGE_KEY = "salah_admin_users";

export default function AdministratorsAdminPage() {
  const [admins, setAdmins] = useState<AdminUser[]>([
    {
      id: "u1",
      name: "Super Administrator",
      email: "superadmin@salahtimes.org",
      role: "super_admin",
      assignedMosques: ["All Mosques"],
      isActive: true,
    },
    {
      id: "u_bilal",
      name: "Jamia Bilal Mosque Admin",
      email: "admin.bilal@salahtimes.org",
      role: "mosque_admin",
      assignedMosques: ["Jamia Bilal Masjid (Khawajabagh)"],
      isActive: true,
    },
    {
      id: "u2",
      name: "Baramulla Mosque Admin",
      email: "admin@jamiamasjidbaramulla.org",
      role: "mosque_admin",
      assignedMosques: ["Jamia Masjid Baramulla (Old Town)"],
      isActive: true,
    },
    {
      id: "u3",
      name: "Sopore Committee Admin",
      email: "admin@masjidnoor.org",
      role: "mosque_admin",
      assignedMosques: ["Masjid Noor (Sopore)"],
      isActive: true,
    },
    {
      id: "u4",
      name: "Srinagar Central Admin",
      email: "contact@centralmosquesrinagar.org",
      role: "mosque_admin",
      assignedMosques: ["Central Jamia Masjid (Srinagar)"],
      isActive: true,
    },
  ]);

  // Load from localStorage if present
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAdmins(parsed);
        }
      }
    } catch {}
  }, []);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState<"super_admin" | "mosque_admin">("mosque_admin");
  const [newMosqueName, setNewMosqueName] = useState(sampleMosques[0]?.name || "Jamia Bilal Masjid");

  const handleAddAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newAdmin: AdminUser = {
      id: `u_${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      role: newRole,
      assignedMosques:
        newRole === "super_admin" ? ["All Mosques"] : [newMosqueName],
      isActive: true,
    };

    const updated = [newAdmin, ...admins];
    setAdmins(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {}

    // Reset & Close
    setNewName("");
    setNewEmail("");
    setShowModal(false);
  };

  const handleDeleteAdmin = (id: string, name: string) => {
    if (confirm(`Remove administrator ${name}?`)) {
      const updated = admins.filter((a) => a.id !== id);
      setAdmins(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }
  };

  return (
    <div>
      <AdminHeader
        title="Administrators &amp; Role Management"
        subtitle="Super Admins can register new mosque administrators and assign scoped mosque permissions."
        actions={
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-semibold hover:bg-primary/95 transition-all shadow-sm cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add New Administrator</span>
          </button>
        }
      />

      <div className="px-6 sm:px-8 max-w-7xl mx-auto space-y-6">
        {/* Info callout */}
        <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-xs sm:text-sm text-foreground flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary shrink-0" />
            <div>
              <span className="font-bold">Role-Based Access Control:</span>{" "}
              <span className="text-muted-foreground">
                <strong>Super Admins</strong> manage the entire system, districts, and all mosques.{" "}
                <strong>Mosque Admins</strong> are strictly scoped to update prayer times and notices for their assigned mosque only.
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground bg-muted/30">
                  <th className="py-4 px-6 font-semibold">User</th>
                  <th className="py-4 px-4 font-semibold">Role</th>
                  <th className="py-4 px-4 font-semibold">Assigned Mosque</th>
                  <th className="py-4 px-4 font-semibold">Status</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {admins.map((adm) => (
                  <tr key={adm.id} className="hover:bg-muted/10 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-foreground">{adm.name}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">
                        {adm.email}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          adm.role === "super_admin"
                            ? "bg-purple-500/10 text-purple-700 dark:text-purple-400"
                            : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                        }`}
                      >
                        <Shield className="w-3 h-3" />
                        <span>
                          {adm.role === "super_admin" ? "Super Admin" : "Mosque Admin"}
                        </span>
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs font-medium text-foreground">
                      {adm.assignedMosques.join(", ")}
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Active</span>
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      {adm.id !== "u1" && (
                        <button
                          type="button"
                          onClick={() => handleDeleteAdmin(adm.id, adm.name)}
                          className="text-muted-foreground hover:text-destructive transition-colors p-1"
                          title="Remove administrator"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── ASSIGN ADMINISTRATOR MODAL ──────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-5 text-muted-foreground hover:text-foreground p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-lg text-foreground">
                  Add Administrator
                </h3>
                <p className="text-xs text-muted-foreground">
                  Create an admin account and assign mosque permissions.
                </p>
              </div>
            </div>

            <form onSubmit={handleAddAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1 uppercase tracking-wider">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Tariq Ahmad"
                  className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1 uppercase tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="tariq@mosque.org"
                  className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-foreground mb-1 uppercase tracking-wider">
                  Role *
                </label>
                <select
                  value={newRole}
                  onChange={(e) =>
                    setNewRole(e.target.value as "super_admin" | "mosque_admin")
                  }
                  className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                >
                  <option value="mosque_admin">
                    Mosque Admin (Restricted to single mosque)
                  </option>
                  <option value="super_admin">
                    Super Admin (Full access to all mosques)
                  </option>
                </select>
              </div>

              {newRole === "mosque_admin" && (
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1 uppercase tracking-wider">
                    Assign to Mosque *
                  </label>
                  <select
                    value={newMosqueName}
                    onChange={(e) => setNewMosqueName(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                  >
                    {sampleMosques.map((m) => (
                      <option key={m.id} value={`${m.name} (${m.town || m.city})`}>
                        {m.name} — {m.district} ({m.town || m.city})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="pt-3 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/95 transition-all shadow-sm cursor-pointer"
                >
                  Create &amp; Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
