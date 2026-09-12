"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Briefcase,
  ChevronDown,
  FlaskConical,
  HeartHandshake,
  LayoutDashboard,
  LogIn,
  Mail,
  Menu,
  Notebook,
  Settings,
  ShieldCheck,
  Sparkles,
  User,
  UserPlus,
  X,
} from "lucide-react";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Navigation Links                                                           */
/* -------------------------------------------------------------------------- */

const navLinks = [
  { href: "/about", label: "About", icon: User },
  { href: "/research", label: "Research", icon: Sparkles },
  { href: "/get-published", label: "Get Published", icon: Briefcase },
  { href: "/volunteer", label: "Volunteer", icon: HeartHandshake },
  { href: "/contact", label: "Contact", icon: Mail },
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
    await signOut({ callbackUrl: "/" });
  };

  if (isHiddenPage) {
    return null;
  }

  return (
    <header className="sticky top-3 sm:top-5 z-50 flex flex-col items-center px-3 sm:px-4 pointer-events-none">
      {/* -------------------------------------------------------------------- */}
      {/* Floating Pill Bar                                                    */}
      {/* -------------------------------------------------------------------- */}
      <div className="pointer-events-auto flex items-center h-12 sm:h-14 px-3.5 sm:px-5 rounded-full bg-white/85 backdrop-blur-xl border border-navy/10 shadow-[0_8px_30px_rgba(17,34,80,0.08)] transition-all duration-300">
        {/* Left Corner: TOUR Logo (replaces Home icon) */}
        <Link
          href="/"
          aria-label="Home"
          className="flex items-center shrink-0 pr-1 hover:opacity-85 transition-opacity"
        >
          <Image
            src="/logo.png"
            alt="TOUR"
            width={110}
            height={34}
            priority
            className="h-6 sm:h-7 w-auto object-contain"
          />
        </Link>

        {/* Left Divider */}
        <div
          className="h-5 w-[1px] bg-navy/15 mx-2 sm:mx-3 shrink-0"
          aria-hidden="true"
        />

        {/* Center: Navigation Links with Icons */}
        <nav
          aria-label="Primary navigation"
          className="hidden md:flex items-center gap-1 lg:gap-2"
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
                  "flex items-center gap-1.5 lg:gap-2 px-2.5 lg:px-3 py-1.5 rounded-full text-[13px] lg:text-[14px] font-medium transition-all duration-150 whitespace-nowrap",
                  active
                    ? "text-navy font-semibold bg-navy/8"
                    : "text-navy/70 hover:text-navy hover:bg-navy/5"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    active ? "text-navy" : "text-navy/60"
                  )}
                  strokeWidth={1.8}
                />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile current label */}
        <span className="md:hidden text-xs font-semibold text-navy truncate max-w-[120px]">
          {navLinks.find((l) => isActive(l.href))?.label || "Explore"}
        </span>

        {/* Right Divider */}
        <div
          className="h-5 w-[1px] bg-navy/15 mx-2 sm:mx-3 shrink-0"
          aria-hidden="true"
        />

        {/* Right Corner: Notebook Icon & Profile Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Notebook icon (replaces Moon icon) */}
          <Link
            href="/researcher"
            title="Research Notebook"
            aria-label="Research Notebook"
            className={cn(
              "grid h-8 sm:h-9 w-8 sm:w-9 place-items-center rounded-full text-navy/75 hover:text-navy hover:bg-navy/5 transition-colors",
              isActive("/researcher") && "text-navy bg-navy/8"
            )}
          >
            <Notebook className="h-[18px] w-[18px]" strokeWidth={1.8} />
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
                className="grid h-7 w-7 sm:h-8 sm:w-8 place-items-center overflow-hidden rounded-full border border-navy/15 bg-navy text-white transition hover:ring-2 hover:ring-sapphire/30 ml-0.5"
              >
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={32}
                    height={32}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-4 w-4 text-white" />
                )}
              </button>

              {/* User Dropdown */}
              {userMenuOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-[calc(100%+12px)] w-60 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[0_12px_35px_rgba(20,35,70,0.14)] p-1.5"
                >
                  <div className="border-b border-navy/10 px-3 py-2.5">
                    <p className="truncate text-xs font-semibold text-navy">
                      {user?.name || "User"}
                    </p>
                    <p className="truncate text-[10px] text-navy/50">
                      {user?.email || role || "TOUR Member"}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href={getDashboardPath()}
                      role="menuitem"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-navy transition-colors hover:bg-navy/5"
                    >
                      {isAdmin ? (
                        <ShieldCheck className="h-4 w-4 text-sapphire" />
                      ) : isReviewer ? (
                        <Settings className="h-4 w-4 text-sapphire" />
                      ) : (
                        <LayoutDashboard className="h-4 w-4 text-sapphire" />
                      )}
                      {getDashboardLabel()}
                    </Link>

                    {isAuthor && (
                      <Link
                        href="/researcher"
                        role="menuitem"
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-navy transition-colors hover:bg-navy/5"
                      >
                        <FlaskConical className="h-4 w-4 text-sapphire" />
                        My Research
                      </Link>
                    )}

                    <Link
                      href="/settings"
                      role="menuitem"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-navy transition-colors hover:bg-navy/5"
                    >
                      <Settings className="h-4 w-4 text-sapphire" />
                      Settings
                    </Link>
                  </div>

                  <div className="border-t border-navy/10 pt-1">
                    <button
                      type="button"
                      onClick={handleLogout}
                      role="menuitem"
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-xs font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogIn className="h-4 w-4 rotate-180" />
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
                className="hidden lg:inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-navy/70 hover:text-navy hover:bg-navy/5 rounded-full transition ml-0.5"
              >
                <LogIn className="h-3.5 w-3.5" />
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
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* Mobile Drawer (Under Floating Pill)                                  */}
      {/* -------------------------------------------------------------------- */}
      {mobileOpen && (
        <div className="pointer-events-auto mt-2 w-full max-w-xs overflow-hidden rounded-2xl border border-navy/10 bg-white/95 p-3 shadow-xl backdrop-blur-xl md:hidden transition-all animate-fade-in">
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
                  <Icon className="h-4 w-4 text-navy/70" />
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
                  <LogIn className="h-4 w-4" />
                  <span>Sign in</span>
                </Link>
                <Link
                  href="/join"
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-sapphire hover:bg-navy/5"
                >
                  <UserPlus className="h-4 w-4" />
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