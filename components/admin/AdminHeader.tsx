"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  Music,
  SlidersHorizontal,
  CreditCard,
  Settings2,
  RefreshCw,
  Home,
  LogOut,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface AdminHeaderProps {
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function AdminHeader({ onRefresh, isRefreshing }: AdminHeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const navItems = [
    {
      name: "Analytics",
      href: "/admin",
      icon: LayoutDashboard,
      isActive: pathname === "/admin",
    },
    {
      name: "Bookings",
      href: "/admin/bookings",
      icon: Calendar,
      isActive: pathname === "/admin/bookings",
    },
    {
      name: "Studios",
      href: "/admin/studios",
      icon: Music,
      isActive: pathname === "/admin/studios",
    },
    {
      name: "Gear",
      href: "/admin/equipments",
      icon: SlidersHorizontal,
      isActive: pathname === "/admin/equipments",
    },
    {
      name: "Payments",
      href: "/admin/payments",
      icon: CreditCard,
      isActive: pathname === "/admin/payments",
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings2,
      isActive: pathname === "/admin/settings",
    },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050505]/85 backdrop-blur-2xl shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Brand & Title */}
          <div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold text-[#6C63FF] uppercase tracking-widest bg-[#6C63FF]/10 px-2.5 py-0.5 rounded-full border border-[#6C63FF]/25">
                  Dashboard Admin
                </span>
                <span className="text-[10px] font-medium text-[#A7B0C0]">
                  SVARA STUDIO
                </span>
              </div>
            </div>
          </div>

          {/* Nav Tabs & Actions */}
          <div className="flex items-center justify-between sm:justify-end gap-3">
            {/* Navigation Tabs */}
            <nav className="flex items-center space-x-1 rounded-2xl bg-white/5 p-1 border border-white/10 backdrop-blur-md">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                      item.isActive
                        ? "bg-[#6C63FF] text-[#050510] shadow-[0_4px_16px_rgba(108,99,255,0.3)]"
                        : "text-[#A7B0C0] hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#A7B0C0] hover:text-white hover:border-[#6C63FF]/40 transition-all"
                title="View Main Site"
              >
                <Home className="h-3.5 w-3.5" />
                <span className="hidden md:inline">Main Site</span>
              </Link>

              {onRefresh && (
                <button
                  onClick={onRefresh}
                  disabled={isRefreshing}
                  className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-[#A7B0C0] hover:text-white hover:border-[#6C63FF]/40 transition-all disabled:opacity-50 cursor-pointer"
                  title="Refresh Data"
                >
                  <RefreshCw
                    className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-[#6C63FF]" : ""}`}
                  />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
              )}

              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 rounded-2xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
