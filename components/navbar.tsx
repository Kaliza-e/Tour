"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
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

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status: sessionStatus } = useSession();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const user = session?.user as SessionUser | undefined;
  const role = user?.role ?? "";
  const isSignedIn = Boolean(session);
  const isLoading = sessionStatus === "loading";

  const isAdmin = role === "ADMIN";
  const isReviewer = role === "REVIEWER";
  const isAuthor = role === "STUDENT" || role === "MENTOR" || !role;

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
    <header className="sticky top-3 sm:top-5 z-50 flex flex-col items-center px-3 sm:px-4 pointer-events-none">
      {/* -------------------------------------------------------------------- */}
      {/* Floating Pill Bar                                                    */}
      {/* -------------------------------------------------------------------- */}
      <div className="pointer-events-auto flex items-center h-13 sm:h-14 px-4 sm:px-5 rounded-full bg-white/95 border-2 border-navy/15 transition-all duration-300">
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

        {/* Left Divider */}
        <div
          className="h-5 w-[1px] bg-navy/15 mx-2.5 sm:mx-3 shrink-0"
          aria-hidden="true"
        />

        {/* Center: Navigation Links with Active Dot */}
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

        {/* Mobile current label */}
        <span className="md:hidden text-sm font-extrabold text-navy truncate max-w-[140px]">
          {navLinks.find((l) => isActive(l.href))?.label || "Explore"}
        </span>

        {/* Right Divider */}
        <div
          className="h-6 w-[1px] bg-navy/15 mx-3 sm:mx-4 shrink-0"
          aria-hidden="true"
        />

        {/* Right Corner: Notebook Icon & Profile Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
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

          {/* User Profile / Auth */}
          {isSignedIn ? (
            <div className="relative" data-user-menu>
              <button
                type="button"
                onClick={() => setUserMenuOpen((open) => !open)}
                aria-expanded={userMenuOpen}
                aria-haspopup="menu"
                title={user?.name || "Account"}
                className="grid h-8 w-8 sm:h-9 sm:w-9 place-items-center overflow-hidden rounded-full border-2 border-navy/20 bg-navy text-white transition hover:ring-2 hover:ring-sapphire/40 ml-0.5"
              >
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FlaticonUser size={18} className="text-white" />
                )}
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+14px)] w-64 overflow-hidden rounded-2xl border-2 border-navy/15 bg-white p-2"
                >
                  <div className="border-b border-navy/10 px-3 py-3">
                    <p className="truncate text-xs font-bold text-navy">
                      {user?.name || "User"}
                    </p>
                    <p className="truncate text-[11px] text-navy/60">
                      {user?.email || role || "TOUR Member"}
                    </p>
                  </div>

                  <div className="py-1 space-y-0.5">
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
                  </div>

                  <div className="border-t border-navy/10 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      role="menuitem"
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs font-bold text-navy/80 transition-colors hover:bg-navy/5 cursor-pointer"
                    >
                      <FlaticonUser size={16} className="rotate-180" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            !isLoading && (
              <Link
                href="/login"
                title="Sign in"
                className="hidden lg:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-navy hover:bg-navy/5 rounded-full transition ml-0.5"
              >
                <FlaticonUser size={15} />
                <span>Sign in</span>
              </Link>
            )
          )}

          {/* Mobile Menu Toggle */}
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
      {/* Mobile Drawer (Under Floating Pill)                                  */}
      {/* -------------------------------------------------------------------- */}
      {mobileOpen && (
        <div className="pointer-events-auto mt-2 w-full max-w-xs overflow-hidden rounded-xl border border-navy/10 bg-white/95 p-3 backdrop-blur-xl md:hidden transition-all animate-fade-in">
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
    </header>
  );
}