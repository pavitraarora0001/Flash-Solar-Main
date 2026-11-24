"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { BrandLogo } from "@/components/shared/brand-logo";
import {
  LayoutDashboard,
  BarChart3,
  Globe,
  Cpu,
  Image as ImageIcon,
  BookOpen,
  Quote,
  HelpCircle,
  Package,
  FolderTree,
  Wrench,
  FileText,
  Inbox,
  Users,
  Mail,
  Search,
  Send,
  Shield,
  ShieldAlert,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Sun,
  Moon,
  ChevronRight,
} from "lucide-react";

interface UserProfile {
  userId: string;
  email: string;
  name: string;
  role: string;
}

interface NavGroup {
  group: string;
  items: Array<{
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string;
  }>;
}

const navGroups: NavGroup[] = [
  {
    group: "Core Dashboard",
    items: [
      { name: "Overview", href: "/admin", icon: LayoutDashboard },
      { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    group: "Website CMS",
    items: [
      { name: "Website CMS", href: "/admin/cms", icon: Globe },
      { name: "Engineering Architecture", href: "/admin/engineering", icon: Cpu },
      { name: "Media Library", href: "/admin/media", icon: ImageIcon },
      { name: "Blog & Articles", href: "/admin/blog", icon: BookOpen },
      { name: "Testimonials", href: "/admin/testimonials", icon: Quote },
      { name: "FAQs", href: "/admin/faqs", icon: HelpCircle },
    ],
  },
  {
    group: "Products & Engineering",
    items: [
      { name: "Products", href: "/admin/products", icon: Package },
      { name: "Product Categories", href: "/admin/categories", icon: FolderTree },
      { name: "Services", href: "/admin/services", icon: Wrench },
      { name: "Resources / Datasheets", href: "/admin/resources", icon: FileText },
    ],
  },
  {
    group: "CRM & Inquiries",
    items: [
      { name: "Enquiries", href: "/admin/enquiries", icon: Inbox },
      { name: "Customers / Leads", href: "/admin/leads", icon: Users },
      { name: "Contact Messages", href: "/admin/messages", icon: Mail },
    ],
  },
  {
    group: "System & Management",
    items: [
      { name: "SEO Manager", href: "/admin/seo", icon: Search },
      { name: "Email Templates", href: "/admin/email-templates", icon: Send },
      { name: "Users & Permissions", href: "/admin/users", icon: Shield },
      { name: "Audit Logs", href: "/admin/audit-logs", icon: ShieldAlert },
      { name: "Settings", href: "/admin/settings", icon: Settings },
    ],
  },
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
  const [theme, setTheme] = React.useState<"dark" | "light">("dark");

  React.useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session");
        const data = await res.json();
        if (!data.authenticated || !data.user) {
          router.push("/admin/login");
          return;
        }
        if (data.user.mustChangePassword) {
          router.push("/admin/change-password");
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

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

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

  // Active page title resolution
  let activeTitle = "Admin Control Center";
  for (const group of navGroups) {
    for (const item of group.items) {
      if (item.href === "/admin" && pathname === "/admin") {
        activeTitle = item.name;
        break;
      }
      if (item.href !== "/admin" && pathname.startsWith(item.href)) {
        activeTitle = item.name;
        break;
      }
    }
  }

  return (
    <div className={`min-h-screen flex flex-col lg:flex-row ${theme === "dark" ? "bg-[#061321] text-ivory-100" : "bg-[#F7F9FC] text-midnight-950"}`}>
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-midnight-900 border-b border-midnight-800 px-4 py-3 flex items-center justify-between z-30 sticky top-0 text-ivory-100">
        <BrandLogo variant="compact" subtitle="Admin Control" href="/" />
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-md bg-midnight-800 text-ivory-300 hover:text-white"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="w-4 h-4 text-gold-400" /> : <Moon className="w-4 h-4 text-ivory-300" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-md bg-midnight-800 text-ivory-300 hover:text-white"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Persistent Midnight Navy Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#0a192f] border-r border-midnight-800/80 flex flex-col transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-midnight-800/80 flex items-center justify-between">
          <BrandLogo variant="admin-sidebar" subtitle="Enterprise CMS / CRM" href="/" />
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1 text-ivory-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 20 Sidebar Modules Grouped */}
        <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto custom-scrollbar">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <h4 className="px-3 text-[10px] font-mono uppercase tracking-wider text-ivory-400 font-bold">
                {group.group}
              </h4>
              <div className="space-y-0.5 pt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname === item.href || pathname.startsWith(`${item.href}/`);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-gold-500/15 text-gold-400 border border-gold-500/30 font-semibold"
                          : "text-ivory-300 hover:text-white hover:bg-midnight-800/60"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 ${isActive ? "text-gold-400" : "text-ivory-400"}`} />
                        <span>{item.name}</span>
                      </div>
                      {isActive && <ChevronRight className="w-3.5 h-3.5 text-gold-400" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User Footer Profile & Actions */}
        <div className="p-4 border-t border-midnight-800/80 bg-midnight-950/60 space-y-3">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden">
              <span className="text-xs font-semibold text-ivory-100 block truncate">
                {user?.name || "Administrator"}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] font-mono uppercase tracking-widest text-gold-400 bg-gold-500/10 px-1.5 py-0.5 rounded border border-gold-500/20 font-bold">
                  {user?.role || "SUPER_ADMIN"}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-md hover:bg-rose-500/10 text-ivory-400 hover:text-rose-400 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="pt-2 border-t border-midnight-800/60 flex items-center justify-between text-[11px] text-ivory-400">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1 hover:text-gold-400 transition-colors"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1 hover:text-ivory-200 transition-colors"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-3 h-3 text-gold-400" />
                  <span>Light</span>
                </>
              ) : (
                <>
                  <Moon className="w-3 h-3 text-midnight-400" />
                  <span>Dark</span>
                </>
              )}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className={`hidden lg:flex items-center justify-between px-8 py-4 border-b ${theme === "dark" ? "bg-[#081728] border-midnight-800/80" : "bg-white border-slate-200"}`}>
          <div>
            <h1 className={`text-xl font-heading font-bold ${theme === "dark" ? "text-ivory-100" : "text-slate-900"}`}>
              {activeTitle}
            </h1>
            <p className={`text-xs ${theme === "dark" ? "text-ivory-400" : "text-slate-500"}`}>
              Flash Solar Enterprise Management Platform • Sub-60V DC Architecture
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                theme === "dark"
                  ? "border-midnight-700 bg-midnight-900 text-ivory-200 hover:text-gold-400 hover:border-gold-500/40"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:text-gold-600 hover:border-gold-500/50"
              }`}
            >
              <span>Live Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-colors ${
                theme === "dark"
                  ? "border-midnight-700 bg-midnight-900 text-gold-400 hover:bg-midnight-800"
                  : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
              title="Toggle Light/Dark Workspace"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <div className={`flex items-center gap-2 pl-3 border-l ${theme === "dark" ? "border-midnight-800" : "border-slate-200"}`}>
              <div className="w-7 h-7 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center text-gold-400 font-bold text-xs">
                {user?.name?.[0]?.toUpperCase() || "A"}
              </div>
              <div className="text-left hidden sm:block">
                <span className={`text-xs font-semibold block ${theme === "dark" ? "text-ivory-100" : "text-slate-900"}`}>
                  {user?.name}
                </span>
                <span className="text-[10px] font-mono text-gold-400 block">
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 ${theme === "dark" ? "bg-[#061321]" : "bg-[#F7F9FC]"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
