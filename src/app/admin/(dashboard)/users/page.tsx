"use client";

import * as React from "react";
import {
  Shield,
  Plus,
  Edit,
  Trash2,
  Key,
  CheckCircle2,
  AlertCircle,
  UserCheck,
  UserX,
  Lock,
} from "lucide-react";
import { Role } from "@prisma/client";

interface UserItem {
  id: string;
  email: string;
  name: string;
  phone?: string;
  company?: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

const ROLES: Array<{ role: Role; label: string; desc: string }> = [
  { role: Role.SUPER_ADMIN, label: "Super Admin", desc: "Unrestricted infrastructure, user provisioning, security, and database access." },
  { role: Role.ADMIN, label: "Administrator", desc: "Manage all content, catalog, settings, media, and customer leads." },
  { role: Role.CONTENT_MANAGER, label: "Content Manager", desc: "Publish and update website CMS, articles, FAQs, and engineering stages." },
  { role: Role.SALES_MANAGER, label: "Sales Manager", desc: "Manage sizing enquiries, lead assignments, contact responses, and pipelines." },
  { role: Role.MARKETING_MANAGER, label: "Marketing Manager", desc: "SEO configuration, analytics inspection, and marketing campaigns." },
  { role: Role.VIEWER, label: "Viewer", desc: "Read-only access to analytics and reporting dashboards." },
];

export default function UsersPermissionsPage() {
  const [users, setUsers] = React.useState<UserItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [modalType, setModalType] = React.useState<"create" | "edit" | "password" | null>(null);
  const [selectedUser, setSelectedUser] = React.useState<UserItem | null>(null);
  const [saving, setSaving] = React.useState(false);
  const [message, setMessage] = React.useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form fields
  const [formData, setFormData] = React.useState<{
    name: string;
    email: string;
    password: string;
    role: Role;
    company: string;
    phone: string;
    isActive: boolean;
  }>({
    name: "",
    email: "",
    password: "",
    role: Role.SALES_MANAGER,
    company: "Flash Solar",
    phone: "",
    isActive: true,
  });

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to load team." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error loading users." });
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenCreate = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: Role.SALES_MANAGER,
      company: "Flash Solar",
      phone: "",
      isActive: true,
    });
    setModalType("create");
    setMessage(null);
  };

  const handleOpenEdit = (u: UserItem) => {
    setSelectedUser(u);
    setFormData({
      name: u.name,
      email: u.email,
      password: "",
      role: u.role,
      company: u.company || "Flash Solar",
      phone: u.phone || "",
      isActive: u.isActive,
    });
    setModalType("edit");
    setMessage(null);
  };

  const handleOpenPassword = (u: UserItem) => {
    setSelectedUser(u);
    setFormData({ ...formData, password: "" });
    setModalType("password");
    setMessage(null);
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `User "${formData.name}" (${formData.email}) created.` });
        setModalType(null);
        fetchUsers();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to create user." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedUser.id,
          name: formData.name,
          role: formData.role,
          phone: formData.phone,
          isActive: formData.isActive,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `Account for "${formData.name}" updated.` });
        setModalType(null);
        fetchUsers();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to update user." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !formData.password) return;
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedUser.id,
          newPassword: formData.password,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `Password rotated for "${selectedUser.email}".` });
        setModalType(null);
      } else {
        setMessage({ type: "error", text: data.error || "Failed to rotate password." });
      }
    } catch {
      setMessage({ type: "error", text: "Network error occurred." });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteUser = async (id: string, email: string) => {
    if (!confirm(`Are you sure you want to delete user "${email}"? This action is permanent.`)) return;

    try {
      const res = await fetch(`/api/users?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: `User "${email}" deleted.` });
        fetchUsers();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to delete user." });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to delete user." });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-midnight-800">
        <div>
          <h2 className="text-2xl font-heading font-extrabold text-ivory-100 flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-gold-400" />
            <span>Users &amp; Role-Based Permissions (RBAC)</span>
          </h2>
          <p className="text-xs text-ivory-400 mt-1">
            Manage administrative credentials, team assignments, security roles, and enforce server-side access boundaries.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold text-xs shadow-goldGlow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Team Member</span>
        </button>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-3 border ${
            message.type === "success"
              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
              : "bg-rose-950/60 border-rose-500/40 text-rose-200"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-midnight-900 border border-midnight-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-midnight-800 flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase text-ivory-400">
            Registered Internal Staff ({users.length})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-midnight-950/80 text-ivory-400 font-mono text-[10px] uppercase border-b border-midnight-800">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Assigned Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Contact Phone</th>
                <th className="py-3 px-4">Created Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-midnight-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-ivory-400">Loading user accounts...</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u.id} className="hover:bg-midnight-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-semibold text-ivory-100 block">{u.name}</span>
                      <span className="text-[11px] font-mono text-ivory-400">{u.email}</span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] border ${
                        u.role === Role.SUPER_ADMIN
                          ? "bg-gold-500/20 text-gold-400 border-gold-500/40"
                          : u.role === Role.ADMIN
                          ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                          : "bg-midnight-800 text-ivory-300 border-midnight-700"
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-mono ${u.isActive ? "text-emerald-400" : "text-rose-400"}`}>
                        {u.isActive ? <UserCheck className="w-3.5 h-3.5" /> : <UserX className="w-3.5 h-3.5" />}
                        <span>{u.isActive ? "Active" : "Disabled"}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-ivory-400">{u.phone || "—"}</td>
                    <td className="py-3 px-4 font-mono text-ivory-400 text-[11px]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleOpenPassword(u)}
                        className="p-1.5 rounded hover:bg-midnight-800 text-ivory-300 hover:text-gold-400"
                        title="Rotate Password"
                      >
                        <Key className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(u)}
                        className="p-1.5 rounded hover:bg-midnight-800 text-ivory-300 hover:text-white"
                        title="Edit Role / Status"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.email)}
                        className="p-1.5 rounded hover:bg-rose-500/10 text-rose-400 hover:text-rose-300"
                        title="Delete User"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Role Descriptions Legend */}
      <div className="bg-midnight-900 border border-midnight-800 rounded-2xl p-5 space-y-3">
        <h3 className="font-heading font-bold text-xs text-ivory-100 uppercase tracking-wider">
          Role-Based Access Control Scope Matrix
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {ROLES.map((r) => (
            <div key={r.role} className="bg-midnight-950 p-3 rounded-xl border border-midnight-850 space-y-1">
              <span className="font-mono font-bold text-gold-400 block">{r.label}</span>
              <p className="text-[11px] text-ivory-400 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Create User Modal */}
      {modalType === "create" && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateSubmit}
            className="bg-midnight-900 border border-midnight-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between border-b border-midnight-800 pb-3">
              <h3 className="font-heading font-bold text-sm text-ivory-100">
                Add New Team Member
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="text-ivory-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="e.g. Elena Rostova"
                className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">Work Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="elena@flashsolar.org"
                className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">Initial Password (min 12 characters)</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={12}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">Assigned Security Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
              >
                {ROLES.map((r) => (
                  <option key={r.role} value={r.role}>{r.label} ({r.role})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-midnight-800">
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-lg bg-midnight-800 text-ivory-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold"
              >
                {saving ? "Creating..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Role Modal */}
      {modalType === "edit" && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form
            onSubmit={handleEditSubmit}
            className="bg-midnight-900 border border-midnight-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between border-b border-midnight-800 pb-3">
              <h3 className="font-heading font-bold text-sm text-ivory-100">
                Modify Account: {selectedUser.email}
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="text-ivory-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">Security Role</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
              >
                {ROLES.map((r) => (
                  <option key={r.role} value={r.role}>{r.label} ({r.role})</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-ivory-300">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="rounded border-midnight-700 bg-midnight-950 text-gold-500"
                />
                <span>Account Active &amp; Login Allowed</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-midnight-800">
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-lg bg-midnight-800 text-ivory-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold"
              >
                {saving ? "Saving..." : "Update Permissions"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Rotate Password Modal */}
      {modalType === "password" && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <form
            onSubmit={handlePasswordSubmit}
            className="bg-midnight-900 border border-midnight-700 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl text-xs"
          >
            <div className="flex items-center justify-between border-b border-midnight-800 pb-3">
              <h3 className="font-heading font-bold text-sm text-ivory-100">
                Reset Password: {selectedUser.email}
              </h3>
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="text-ivory-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1">
              <label className="text-ivory-300 font-semibold">New Password (min 12 characters)</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={12}
                placeholder="••••••••••••"
                className="w-full px-3 py-2 bg-midnight-950 border border-midnight-700 rounded-lg text-ivory-100 font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-midnight-800">
              <button
                type="button"
                onClick={() => setModalType(null)}
                className="px-4 py-2 rounded-lg bg-midnight-800 text-ivory-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-lg bg-gold-500 hover:bg-gold-600 text-midnight-950 font-bold"
              >
                {saving ? "Rotating..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
