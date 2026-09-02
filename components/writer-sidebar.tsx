"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  PenTool,
  Send,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Home,
  Award,
  Clock,
  FolderOpen,
  Menu,
  X,
} from "lucide-react";
import { TourLogo } from "@/components/tour-logo";
import { cn } from "@/lib/utils";

const writerNav = [
  {
    group: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    group: "Research",
    items: [
      { href: "/workspace/notebook", label: "Research Notebook", icon: PenTool },
      { href: "/workspace", label: "My Projects", icon: FolderOpen },
      { href: "/submit", label: "Submit Paper", icon: Send },
    ],
  },
  {
    group: "Activity",
    items: [
      { href: "/achievements", label: "Achievements", icon: Award },
    ],
  },
];

const bottomNav = [
  { href: "/", label: "Back to Site", icon: Home },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function WriterSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/workspace") {
      return pathname === "/workspace";
    }
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* ─────────────────────────────────────────────────────────────
          MOBILE TOP BAR (Visible on screens < lg)
         ───────────────────────────────────────────────────────────── */}
      <div className="lg:hidden sticky top-0 z-40 flex items-center justify-between border-b border-navy/10 bg-white/95 backdrop-blur-md px-4 py-2.5 shadow-2xs">
        <div className="flex items-center gap-2">
          <TourLogo priority imageClassName="h-7" />
        </div>

        <button
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          className="grid h-9 w-9 place-items-center rounded-xl border border-navy/15 bg-white text-navy shadow-2xs hover:bg-ivory transition"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          MOBILE SLIDE-OVER DRAWER (Visible when open on < lg)
         ───────────────────────────────────────────────────────────── */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer Sheet */}
          <div className="relative flex w-[280px] max-w-[85vw] flex-1 flex-col bg-white shadow-soft p-5 z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-navy/10">
              <div className="flex items-center gap-2">
                <TourLogo priority imageClassName="h-7" />
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-1.5 text-navy/60 hover:bg-ivory hover:text-navy transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Mobile Nav Links */}
            <nav className="flex-1 py-4 space-y-4">
              {writerNav.map((section) => (
                <div key={section.group}>
                  <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-sapphire">
                    {section.group}
                  </p>
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold transition-all",
                            active
                              ? "bg-navy text-ivory shadow-sm"
                              : "text-navy/70 hover:bg-ivory hover:text-navy"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Mobile Bottom Links */}
            <div className="border-t border-navy/10 pt-3 space-y-1">
              {bottomNav.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold text-navy/60 hover:bg-ivory hover:text-navy transition"
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}

              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2 text-xs font-semibold text-red-500 hover:bg-red-50 transition"
              >
                <LogOut className="h-4 w-4 shrink-0" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          DESKTOP SIDEBAR (Visible on screens >= lg)
         ───────────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "hidden lg:flex sticky top-0 h-screen flex-col border-r border-navy/10 bg-white/95 backdrop-blur-xl transition-all duration-300 z-30 shrink-0",
          collapsed ? "w-[68px]" : "w-[240px]"
        )}
      >
        {/* Header: Logo + Collapse (removed line below logo) */}
        <div className="flex items-center justify-between px-4 py-4">
          {!collapsed && (
            <TourLogo priority imageClassName="h-7" className="p-0.5" />
          )}
          {collapsed && (
            <TourLogo priority imageClassName="h-7" className="p-0.5" />
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className={cn(
              "grid h-6 w-6 place-items-center rounded-full border border-navy/15 bg-white text-navy/70 shadow-2xs hover:bg-navy hover:text-white transition-all duration-150",
              collapsed && "mx-auto mt-2"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
          </button>
        </div>

        {/* Desktop Nav Groups */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          {writerNav.map((section) => (
            <div key={section.group}>
              {!collapsed && (
                <p className="px-3 mb-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-sapphire/70">
                  {section.group}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-semibold transition-all duration-150 relative",
                        active
                          ? "text-navy bg-navy/8 border-l-3 border-navy font-semibold"
                          : "text-navy/60 hover:bg-navy/5 hover:text-navy",
                        collapsed && "justify-center px-0 border-l-0"
                      )}
                    >
                      <Icon className={cn("h-4 w-4 shrink-0", active ? "text-navy" : "text-navy/50")} />
                      {!collapsed && <span>{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Desktop Bottom Links */}
        <div className="border-t border-navy/8 p-3 space-y-0.5">
          {bottomNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-[12px] font-semibold text-navy/50 hover:bg-navy/6 hover:text-navy transition",
                  collapsed && "justify-center px-0"
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );
          })}

          {/* Log out */}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            title={collapsed ? "Log Out" : undefined}
            className={cn(
              "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[12px] font-semibold text-red-500/80 hover:bg-red-50 hover:text-red-600 transition",
              collapsed && "justify-center px-0"
            )}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Log Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
