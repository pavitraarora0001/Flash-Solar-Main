"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Package,
  Wrench,
  FileText,
  Mail,
  BarChart3,
  ShieldAlert,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  User,
} from "lucide-react";

interface UserProfile {
  userId: string;
  email: string;
  name: string;
  role: string;
}

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Leads & Enquiries", href: "/admin/enquiries", icon: Inbox },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Services", href: "/admin/services", icon: Wrench },
  { name: "Resources", href: "/admin/resources", icon: FileText },
  { name: "Messages", href: "/admin/messages", icon: Mail },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Audit Trail", href: "/admin/audit-logs", icon: ShieldAlert },
  { name: "Site Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (!data.authenticated || !data.user) {
          router.push("/admin/login");
          return;
        }
        setUser(data.user);
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } catch {
      router.push("/admin/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-midnight-950 flex flex-col items-center justify-center text-ivory-100">
        <div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-mono text-ivory-400 uppercase tracking-widest">
          Authenticating Flash Solar Admin...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight-950 text-ivory-100 flex flex-col lg:flex-row">
      {/* Mobile Top Bar */}
      <div className="lg:hidden bg-midnight-900 border-b border-midnight-800 px-4 py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-2.5">
          <div className="relative w-7 h-7 rounded bg-midnight-950 border border-gold-500/40 p-1 flex items-center justify-center">
            <Image src="/images/logo.jpg" alt="Logo" width={22} height={22} className="object-contain" />
          </div>
          <span className="font-heading font-extrabold text-sm text-ivory-100">
            FLASH <span className="text-gold-400">ADMIN</span>
          </span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 rounded-md bg-midnight-800 text-ivory-300 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-midnight-900 border-r border-midnight-800/80 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-midnight-800/80 flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-lg bg-midnight-950 border border-gold-500/40 p-1.5 flex items-center justify-center shadow">
            <Image src="/images/logo.jpg" alt="Flash Solar" width={28} height={28} className="object-contain" />
          </div>
          <div>
            <span className="font-heading font-extrabold text-sm text-ivory-100 block leading-tight tracking-tight">
              FLASH <span className="text-gold-400">SOLAR</span>
            </span>
            <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 font-semibold block">
              Control Center
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-gold-500/10 text-gold-400 border border-gold-500/30 font-semibold"
                    : "text-ivory-400 hover:text-ivory-100 hover:bg-midnight-800/60"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-gold-400" : "text-ivory-400"}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="p-4 border-t border-midnight-800/80 bg-midnight-950/40 space-y-3">
          {user && (
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-midnight-800 border border-midnight-700 flex items-center justify-center text-gold-400 shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-ivory-100 truncate">{user.name}</p>
                <span className="inline-block px-1.5 py-0.5 rounded text-[9px] font-mono uppercase bg-midnight-800 text-gold-400 border border-midnight-700">
                  {user.role}
                </span>
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-midnight-800 hover:bg-midnight-700 text-[11px] text-ivory-300 font-medium transition-colors border border-midnight-700"
            >
              <span>Site</span>
              <ExternalLink className="w-3 h-3 text-ivory-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 rounded-md bg-rose-950/40 hover:bg-rose-900/60 text-[11px] text-rose-300 font-medium transition-colors border border-rose-800/40"
              title="Sign Out"
            >
              <LogOut className="w-3 h-3" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Backdrop for mobile menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-30 lg:hidden"
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="hidden lg:flex items-center justify-between px-8 py-4 bg-midnight-900/60 border-b border-midnight-800/80 sticky top-0 z-20 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs text-ivory-400">
            <span>Admin</span>
            <span>/</span>
            <span className="text-ivory-100 capitalize">
              {pathname === "/admin"
                ? "Overview"
                : pathname.replace("/admin/", "").replace("-", " ")}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 transition-colors"
            >
              <span>View Public Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
