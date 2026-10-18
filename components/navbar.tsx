"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  ExternalLink,
  FileText,
  Sparkles,
} from "lucide-react";
import {
  FlaticonBriefcase,
  FlaticonChevronDown,
  FlaticonFlask,
  FlaticonHeartHandshake,
  FlaticonDashboard,
  FlaticonUser,
  FlaticonMail,
  FlaticonMenu,
  FlaticonBook,
  FlaticonIdea,
  FlaticonSettings,
  FlaticonShieldCheck,
  FlaticonSparkles,
  FlaticonUsers,
  FlaticonClose,
} from "@/components/flaticons";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Navigation Links                                                           */
/* -------------------------------------------------------------------------- */

const navLinks = [
  { href: "/about", label: "About", icon: FlaticonUser },
  { href: "/research", label: "Research", icon: FlaticonSparkles },
  { href: "/questions", label: "Question Hub", icon: FlaticonIdea },
  { href: "/get-published", label: "Publish", icon: FlaticonBriefcase },
  { href: "/volunteer", label: "Volunteer", icon: FlaticonHeartHandshake },
  { href: "/contact", label: "Contact", icon: FlaticonMail },
];

const hiddenNavbarPages = [
  "/login",
  "/join",
  "/dashboard",
  "/researcher",
  "/workspace",
  "/submit",
  "/achievements",
  "/settings",
  "/admin",
];

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type UserRole = "ADMIN" | "REVIEWER" | "STUDENT" | "MENTOR" | string;

type SessionUser = {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: UserRole;
};

interface NotificationItem {
  id: string;
  userId: string;
  message: string;
  link: string | null;
  read: boolean;
  createdAt: string;
  type: string | null;
  title: string | null;
  readAt: string | null;
}

function timeAgo(dateString: string | Date | null | undefined): string {
  if (!dateString) return "";
  const now = new Date();
  const date = new Date(dateString);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "Just now";
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d ago`;

  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status: sessionStatus } = useSession();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(false);
  const [activeMenuTab, setActiveMenuTab] = useState<"notifications" | "menu">("notifications");

  const user = session?.user as SessionUser | undefined;
  const role = user?.role ?? "";
  const isSignedIn = Boolean(session);
  const isLoading = sessionStatus === "loading";

  const isAdmin = role === "ADMIN";
  const isReviewer = role === "REVIEWER";
  const isAuthor = role === "STUDENT" || role === "MENTOR" || !role;

  /* Fetch unread notifications count */
  const fetchUnread = () => {
    fetch("/api/notifications/unread-count")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.count === "number") setUnreadCount(data.count);
      })
      .catch(() => {});
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchUnread();
      const interval = setInterval(fetchUnread, 30000); // 30s polling
      return () => clearInterval(interval);
    }
  }, [isSignedIn]);

  /* Fetch full notification list */
  const fetchNotifications = async () => {
    setNotificationsLoading(true);
    try {
      const res = await fetch("/api/notifications", { cache: "no-store" });
      if (res.ok) {
        const data = (await res.json()) as { notifications: NotificationItem[]; unreadCount: number };
        setNotifications(data.notifications || []);
        if (typeof data.unreadCount === "number") {
          setUnreadCount(data.unreadCount);
        }
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setNotificationsLoading(false);
    }
  };

  /* Mark all notifications as read */
  const markAllAsRead = async () => {
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await fetch("/api/notifications/read-all", { method: "POST" });
    } catch (err) {
      console.error("Failed to mark notifications read", err);
    }
  };

  /* Mark single notification as read & handle link */
  const handleNotificationClick = async (n: NotificationItem) => {
    if (!n.read) {
      setUnreadCount((prev) => Math.max(0, prev - 1));
      setNotifications((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
      );
      try {
        await fetch("/api/notifications", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: n.id, read: true }),
        });
      } catch (err) {
        console.error("Failed to mark notification read", err);
      }
    }
    if (n.link) {
      setUserMenuOpen(false);
    }
  };

  /* Toggle dropdown menu and load notifications */
  const handleToggleUserMenu = () => {
    setUserMenuOpen((prev) => {
      const next = !prev;
      if (next) {
        if (unreadCount > 0) {
          setActiveMenuTab("notifications");
        }
        void fetchNotifications();
      }
      return next;
    });
  };

  /* Auto-mark notifications as read when the user views the notifications tab */
  useEffect(() => {
    if (userMenuOpen && activeMenuTab === "notifications" && unreadCount > 0) {
      const timer = setTimeout(() => {
        void markAllAsRead();
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [userMenuOpen, activeMenuTab, unreadCount]);

  /* Close menus on path change */
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest("[data-user-menu]")) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isHiddenPage = hiddenNavbarPages.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`)
  );

  const getDashboardPath = () => {
    if (isAdmin || isReviewer) {
      return "/admin/submissions";
    }
    return "/dashboard";
  };

  const getDashboardLabel = () => {
    if (isAdmin) return "Admin Panel";
    if (isReviewer) return "Review Queue";
    return "Dashboard";
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    try {
      await signOut({ redirect: false });
    } catch {
      // Ignore transient network errors during signout
    }
    window.location.href = "/";
  };

  if (isHiddenPage) {
    return null;
  }

  return (
    <header className="sticky top-3 sm:top-5 z-50 w-full pointer-events-none">
      <div className="container-tour">
        {/* -------------------------------------------------------------------- */}
        {/* Floating Pill Bar (Fills Container Width)                            */}
        {/* -------------------------------------------------------------------- */}
        <div className="pointer-events-auto w-full flex items-center justify-between h-13 sm:h-14 px-4 sm:px-6 rounded-full bg-white/95 border-2 border-navy/15 shadow-sm backdrop-blur-md transition-all duration-300">
          
          {/* Left Group: Logo + Left Divider + Nav Links */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Left Corner: TOUR Logo */}
            <Link
              href="/"
              aria-label="Home"
              className="flex items-center shrink-0 pr-1 hover:opacity-85 transition-opacity"
            >
              <Image
                src="/logo.png"
                alt="TOUR"
                width={115}
                height={34}
                priority
                className="h-6.5 sm:h-7.5 w-auto object-contain"
              />
            </Link>

            {/* Left Divider (Desktop) */}
            <div
              className="hidden md:block h-5 w-[1px] bg-navy/15 mx-1 sm:mx-2 shrink-0"
              aria-hidden="true"
            />

            {/* Navigation Links grouped after logo */}
            <nav
              aria-label="Primary navigation"
              className="hidden md:flex items-center gap-1 sm:gap-1.5"
            >
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-150 whitespace-nowrap",
                      active
                        ? "text-navy font-bold"
                        : "text-navy/70 hover:text-navy hover:bg-navy/5"
                    )}
                  >
                    <Icon
                      className={cn(
                        "h-4 w-4 shrink-0 transition-colors",
                        active ? "text-navy" : "text-navy/60"
                      )}
                    />
                    <span>{link.label}</span>
                    {active && (
                      <span className="h-1.5 w-1.5 rounded-full bg-navy shrink-0 ml-0.5" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Corner: Notebook Icon & Profile Actions & Mobile Menu Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Notebook icon */}
            <Link
              href="/researcher"
              title="Research Notebook"
              aria-label="Research Notebook"
              className={cn(
                "grid h-9 sm:h-10 w-9 sm:w-10 place-items-center rounded-full text-navy/80 hover:text-navy hover:bg-navy/5 transition-colors",
                isActive("/researcher") && "text-navy bg-navy/10 font-bold"
              )}
            >
              <FlaticonBook size={20} />
            </Link>

            {/* User Profile / Notifications Auth */}
            {isSignedIn ? (
              <div className="relative" data-user-menu>
                <button
                  type="button"
                  onClick={handleToggleUserMenu}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  title={user?.name || "Account"}
                  className="relative grid h-8 w-8 sm:h-9 sm:w-9 place-items-center overflow-visible rounded-full border-2 border-navy/20 bg-navy text-white transition hover:ring-2 hover:ring-sapphire/40 ml-0.5 cursor-pointer"
                >
                  {user?.image ? (
                    <Image
                      src={user.image}
                      alt={user.name || "User"}
                      width={36}
                      height={36}
                      className="h-full w-full object-cover rounded-full"
                    />
                  ) : (
                    <FlaticonUser size={18} className="text-white" />
                  )}
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white shadow-sm ring-2 ring-white animate-in zoom-in-75">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </button>

                {/* Modern User & Notifications Dropdown */}
                {userMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+14px)] w-80 sm:w-92 overflow-hidden rounded-3xl border-2 border-navy/15 bg-white shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    {/* User Header */}
                    <div className="border-b border-navy/10 px-4 py-3 bg-ivory/50 flex items-center justify-between">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="h-8.5 w-8.5 rounded-full bg-navy text-white text-xs font-bold grid place-items-center shrink-0 border border-navy/20 shadow-xs">
                          {user?.name ? user.name.slice(0, 2).toUpperCase() : "AU"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-navy">
                            {user?.name || "User"}
                          </p>
                          <p className="truncate text-[11px] text-navy/55">
                            {user?.email || "TOUR Member"}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-sapphire/10 text-sapphire border border-sapphire/20">
                        {role || "Author"}
                      </span>
                    </div>

                    {/* Tab Navigation: Notifications vs Account Menu */}
                    <div className="flex items-center border-b border-navy/10 bg-white px-2 pt-1.5">
                      <button
                        type="button"
                        onClick={() => setActiveMenuTab("notifications")}
                        className={cn(
                          "flex-1 pb-2 text-xs font-bold transition flex items-center justify-center gap-1.5 border-b-2 cursor-pointer",
                          activeMenuTab === "notifications"
                            ? "border-navy text-navy font-extrabold"
                            : "border-transparent text-navy/50 hover:text-navy"
                        )}
                      >
                        <Bell className="h-3.5 w-3.5" />
                        <span>Notifications</span>
                        {unreadCount > 0 && (
                          <span className="ml-1 rounded-full bg-rose-500 px-1.5 py-0.2 text-[9px] font-bold text-white shadow-2xs">
                            {unreadCount}
                          </span>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveMenuTab("menu")}
                        className={cn(
                          "flex-1 pb-2 text-xs font-bold transition flex items-center justify-center gap-1.5 border-b-2 cursor-pointer",
                          activeMenuTab === "menu"
                            ? "border-navy text-navy font-extrabold"
                            : "border-transparent text-navy/50 hover:text-navy"
                        )}
                      >
                        <FlaticonDashboard size={14} />
                        <span>Account</span>
                      </button>
                    </div>

                    {/* Tab 1: Notifications List */}
                    {activeMenuTab === "notifications" && (
                      <div>
                        {/* Sub-header with mark all as read */}
                        <div className="flex items-center justify-between px-4 py-2 border-b border-navy/5 bg-ivory/20">
                          <span className="text-[11px] font-semibold text-navy/60">
                            {unreadCount > 0 ? (
                              <span className="text-sapphire font-bold">{unreadCount} unread</span>
                            ) : (
                              "All notifications read"
                            )}
                          </span>
                          {unreadCount > 0 && (
                            <button
                              type="button"
                              onClick={markAllAsRead}
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-sapphire hover:text-navy transition cursor-pointer"
                            >
                              <CheckCheck className="h-3.5 w-3.5" />
                              <span>Mark all read</span>
                            </button>
                          )}
                        </div>

                        {/* List */}
                        <div className="max-h-72 overflow-y-auto divide-y divide-navy/5">
                          {notificationsLoading && notifications.length === 0 ? (
                            <div className="py-8 text-center text-xs text-navy/50">
                              Loading notifications…
                            </div>
                          ) : notifications.length === 0 ? (
                            <div className="py-10 text-center px-4">
                              <Bell className="h-7 w-7 text-navy/20 mx-auto mb-2" />
                              <p className="text-xs font-bold text-navy">No notifications yet</p>
                              <p className="text-[11px] text-navy/50 mt-1 max-w-[200px] mx-auto">
                                Updates regarding research submissions and reviews will show up here.
                              </p>
                            </div>
                          ) : (
                            notifications.map((n) => {
                              const itemInner = (
                                <>
                                  <div
                                    className={cn(
                                      "mt-0.5 grid h-7 w-7 place-items-center rounded-full shrink-0",
                                      !n.read
                                        ? "bg-sapphire/15 text-sapphire"
                                        : "bg-navy/5 text-navy/40"
                                    )}
                                  >
                                    {!n.read ? (
                                      <Sparkles className="h-3.5 w-3.5 text-sapphire" />
                                    ) : (
                                      <Check className="h-3.5 w-3.5 text-navy/40" />
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    {n.title && (
                                      <p className="text-xs font-bold text-navy truncate">
                                        {n.title}
                                      </p>
                                    )}
                                    <p
                                      className={cn(
                                        "text-xs leading-snug",
                                        !n.read ? "font-semibold text-navy" : "text-navy/70"
                                      )}
                                    >
                                      {n.message}
                                    </p>
                                    <div className="mt-1 flex items-center justify-between">
                                      <span className="text-[10px] text-navy/45">
                                        {timeAgo(n.createdAt)}
                                      </span>
                                      {n.link && (
                                        <span className="text-[10px] font-bold text-sapphire inline-flex items-center gap-0.5">
                                          View <ExternalLink className="h-2.5 w-2.5" />
                                        </span>
                                      )}
                                    </div>
                                  </div>

                                  {!n.read && (
                                    <span
                                      className="h-2 w-2 rounded-full bg-sapphire shrink-0 mt-1.5"
                                      title="Unread"
                                    />
                                  )}
                                </>
                              );

                              const itemClasses = cn(
                                "px-4 py-3 transition cursor-pointer flex items-start gap-3 hover:bg-ivory/60 text-left w-full",
                                !n.read ? "bg-sapphire/5" : "bg-white"
                              );

                              return n.link ? (
                                <Link
                                  key={n.id}
                                  href={n.link}
                                  onClick={() => void handleNotificationClick(n)}
                                  className={itemClasses}
                                >
                                  {itemInner}
                                </Link>
                              ) : (
                                <div
                                  key={n.id}
                                  onClick={() => void handleNotificationClick(n)}
                                  className={itemClasses}
                                >
                                  {itemInner}
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    )}

                    {/* Tab 2: Account Navigation Links */}
                    {activeMenuTab === "menu" && (
                      <div className="py-2 px-1 space-y-0.5">
                        <Link
                          href={getDashboardPath()}
                          role="menuitem"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-navy transition-colors hover:bg-navy/5"
                        >
                          {isAdmin ? (
                            <FlaticonShieldCheck size={16} className="text-sapphire" />
                          ) : isReviewer ? (
                            <FlaticonSettings size={16} className="text-sapphire" />
                          ) : (
                            <FlaticonDashboard size={16} className="text-sapphire" />
                          )}
                          {getDashboardLabel()}
                        </Link>

                        {isAuthor && (
                          <Link
                            href="/researcher"
                            role="menuitem"
                            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-navy transition-colors hover:bg-navy/5"
                          >
                            <FlaticonFlask size={16} className="text-sapphire" />
                            My Research
                          </Link>
                        )}

                        <Link
                          href="/settings"
                          role="menuitem"
                          className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-navy transition-colors hover:bg-navy/5"
                        >
                          <FlaticonSettings size={16} className="text-sapphire" />
                          Settings
                        </Link>

                        <div className="border-t border-navy/10 pt-1 mt-1">
                          <button
                            type="button"
                            onClick={handleLogout}
                            role="menuitem"
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-bold text-rose-700 transition-colors hover:bg-rose-50 cursor-pointer"
                          >
                            <FlaticonUser size={16} className="rotate-180" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              !isLoading && (
                <Link
                  href="/login"
                  title="Sign in"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-navy hover:bg-navy/5 rounded-full transition ml-0.5"
                >
                  <FlaticonUser size={15} />
                  <span>Sign in</span>
                </Link>
              )
            )}

            {/* Mobile Menu Toggle inside the pill */}
            <button
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((open) => !open)}
              className="grid h-8 w-8 place-items-center rounded-full text-navy/70 hover:text-navy hover:bg-navy/5 transition-colors md:hidden ml-0.5"
            >
              {mobileOpen ? <FlaticonClose size={18} /> : <FlaticonMenu size={18} />}
            </button>
          </div>
        </div>

        {/* -------------------------------------------------------------------- */}
        {/* Mobile Drawer (Under Floating Pill, Aligned to Container)             */}
        {/* -------------------------------------------------------------------- */}
        {mobileOpen && (
          <div className="pointer-events-auto mt-2 w-full max-w-sm ml-auto overflow-hidden rounded-2xl border-2 border-navy/15 bg-white/95 p-3 shadow-xl backdrop-blur-xl md:hidden transition-all animate-fade-in z-50">
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium transition-colors",
                      active
                        ? "text-navy font-semibold bg-navy/8"
                        : "text-navy/75 hover:bg-navy/5"
                    )}
                  >
                    <Icon size={16} className="text-navy/70" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}

              {!isSignedIn && !isLoading && (
                <div className="mt-2 pt-2 border-t border-navy/10 flex flex-col gap-1">
                  <Link
                    href="/login"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-navy/75 hover:bg-navy/5"
                  >
                    <FlaticonUser size={16} />
                    <span>Sign in</span>
                  </Link>
                  <Link
                    href="/join"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-sapphire hover:bg-navy/5"
                  >
                    <FlaticonUsers size={16} />
                    <span>Join TOUR</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}