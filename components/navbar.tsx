"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  ChevronDown,
  FlaskConical,
  LayoutDashboard,
  LogIn,
  Menu,
  Settings,
  ShieldCheck,
  User,
  UserPlus,
  X,
} from "lucide-react";

import { TourLogo } from "@/components/tour-logo";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Navigation                                                                 */
/* -------------------------------------------------------------------------- */

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/research", label: "Research & Publications" },
  { href: "/get-published", label: "Get Published" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/contact", label: "Contact" },
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
  const router = useRouter();

  const { data: session, status: sessionStatus } = useSession();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /* ------------------------------------------------------------------------ */
  /* Session                                                                  */
  /* ------------------------------------------------------------------------ */

  const user = session?.user as SessionUser | undefined;

  const role = user?.role ?? "";

  const isSignedIn = Boolean(session);
  const isLoading = sessionStatus === "loading";

  const isAdmin = role === "ADMIN";
  const isReviewer = role === "REVIEWER";
  const isAuthor = role === "STUDENT" || role === "MENTOR" || !role;

  /* ------------------------------------------------------------------------ */
  /* Effects                                                                  */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!target.closest("[data-user-menu]")) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  /* ------------------------------------------------------------------------ */
  /* Helpers                                                                  */
  /* ------------------------------------------------------------------------ */

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const isHiddenPage = hiddenNavbarPages.some(
    (page) => pathname === page || pathname.startsWith(`${page}/`)
  );

  /* ------------------------------------------------------------------------ */
  /* Role-based destinations                                                  */
  /* ------------------------------------------------------------------------ */

  const getDashboardPath = () => {
    if (isAdmin || isReviewer) {
      return "/admin/submissions";
    }

    return "/dashboard";
  };

  const getDashboardLabel = () => {
    if (isAdmin) {
      return "Admin Panel";
    }

    if (isReviewer) {
      return "Review Queue";
    }

    return "Dashboard";
  };

  /* ------------------------------------------------------------------------ */
  /* Logout                                                                   */
  /* ------------------------------------------------------------------------ */

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setMobileOpen(false);

    await signOut({
      callbackUrl: "/",
    });
  };

  /* ------------------------------------------------------------------------ */
  /* Hide navbar on protected application pages                               */
  /* ------------------------------------------------------------------------ */

  if (isHiddenPage) {
    return null;
  }

  /* ------------------------------------------------------------------------ */
  /* Render                                                                   */
  /* ------------------------------------------------------------------------ */

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full px-2 transition-[padding] duration-300 sm:px-4 lg:px-6",
        scrolled ? "py-2" : "py-3"
      )}
    >
      <div className="mx-auto max-w-[1440px]">
        {/* ---------------------------------------------------------------- */}
        {/* Main Navbar                                                       */}
        {/* ---------------------------------------------------------------- */}

        <div
          className={cn(
            "flex min-h-16 items-center gap-4 rounded-2xl border border-navy/10 bg-white px-4 shadow-[0_8px_24px_rgba(20,35,70,0.08)] transition-all duration-300 sm:px-6 lg:gap-6 lg:px-8"
          )}
        >
          {/* ---------------------------------------------------------------- */}
          {/* Logo                                                              */}
          {/* ---------------------------------------------------------------- */}

          <TourLogo
            priority
            imageClassName="h-10 w-auto sm:h-11"
            className="shrink-0 transition-opacity hover:opacity-80"
          />

          {/* ---------------------------------------------------------------- */}
          {/* Desktop Navigation                                               */}
          {/* ---------------------------------------------------------------- */}

          <nav
            aria-label="Primary navigation"
            className="hidden min-w-0 flex-1 items-center justify-center gap-4 xl:flex 2xl:gap-6"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive(link.href) ? "page" : undefined}
                className={cn(
                  "relative whitespace-nowrap py-3 text-[13px] font-semibold text-navy/65 transition-colors hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire focus-visible:ring-offset-4 focus-visible:ring-offset-white 2xl:text-[14px]",
                  isActive(link.href) && "text-navy"
                )}
              >
                {link.label}

                {isActive(link.href) && (
                  <span className="absolute inset-x-0 -bottom-1 mx-auto h-0.5 w-8 bg-navy" />
                )}
              </Link>
            ))}
          </nav>

          {/* ---------------------------------------------------------------- */}
          {/* Desktop Authentication                                            */}
          {/* ---------------------------------------------------------------- */}

          <div className="ml-auto hidden shrink-0 items-center gap-2 xl:flex">
            {/* Not signed in */}
            {!isSignedIn && !isLoading && (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-navy/15 px-3 py-2 text-[13px] font-semibold text-navy transition-colors hover:bg-navy/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire sm:px-4 sm:py-2.5 2xl:text-[14px]"
                >
                  <LogIn className="h-4 w-4 shrink-0" />
                  <span>Sign in</span>
                </Link>

                <Link
                  href="/join"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-navy px-3 py-2 text-[13px] font-semibold text-white transition-colors hover:bg-sapphire focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire sm:px-4 sm:py-2.5 2xl:text-[14px]"
                >
                  <UserPlus className="h-4 w-4 shrink-0" />
                  <span>Join TOUR</span>
                </Link>
              </>
            )}

            {/* Signed in */}
            {isSignedIn && (
              <div className="relative" data-user-menu>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="menu"
                  className="flex items-center gap-2 rounded-xl border border-navy/10 bg-white px-2.5 py-2 transition-colors hover:bg-navy/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire"
                >
                  {/* Avatar */}
                  <div className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-navy text-white">
                    {user?.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                  </div>

                  {/* Name */}
                  <div className="hidden max-w-[130px] text-left 2xl:block">
                    <p className="truncate text-[13px] font-semibold text-navy">
                      {user?.name || "User"}
                    </p>

                    <p className="truncate text-[10px] font-medium uppercase tracking-wide text-navy/45">
                      {role || "Member"}
                    </p>
                  </div>

                  <ChevronDown
                    className={cn(
                      "h-4 w-4 text-navy/50 transition-transform",
                      userMenuOpen && "rotate-180"
                    )}
                  />
                </button>

                {/* ---------------------------------------------------------- */}
                {/* User Dropdown                                               */}
                {/* ---------------------------------------------------------- */}

                {userMenuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 top-[calc(100%+10px)] w-64 overflow-hidden rounded-2xl border border-navy/10 bg-white shadow-[0_12px_35px_rgba(20,35,70,0.14)]"
                  >
                    {/* User information */}
                    <div className="border-b border-navy/10 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-navy text-white">
                          {user?.image ? (
                            <img
                              src={user.image}
                              alt={user.name || "User"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-navy">
                            {user?.name || "User"}
                          </p>

                          {user?.email && (
                            <p className="truncate text-xs text-navy/50">
                              {user.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Dashboard */}
                    <div className="p-2">
                      <Link
                        href={getDashboardPath()}
                        role="menuitem"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-navy/5"
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

                      {/* Researcher */}
                      {isAuthor && (
                        <Link
                          href="/researcher"
                          role="menuitem"
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-navy/5"
                        >
                          <FlaskConical className="h-4 w-4 text-sapphire" />
                          My Research
                        </Link>
                      )}

                      {/* Settings */}
                      <Link
                        href="/settings"
                        role="menuitem"
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-navy/5"
                      >
                        <Settings className="h-4 w-4 text-sapphire" />
                        Settings
                      </Link>
                    </div>

                    {/* Logout */}
                    <div className="border-t border-navy/10 p-2">
                      <button
                        type="button"
                        onClick={handleLogout}
                        role="menuitem"
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                      >
                        <LogIn className="h-4 w-4 rotate-180" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Mobile Menu Button                                               */}
          {/* ---------------------------------------------------------------- */}

          <button
            type="button"
            aria-label={
              mobileOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMobileOpen((open) => !open)}
            className="ml-auto grid h-10 w-10 shrink-0 place-items-center rounded-lg text-navy transition-colors hover:bg-navy/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire xl:hidden"
          >
            {mobileOpen ? (
              <X size={21} strokeWidth={1.8} />
            ) : (
              <Menu size={21} strokeWidth={1.8} />
            )}
          </button>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Mobile Navigation Drawer                                           */}
        {/* ------------------------------------------------------------------ */}

        <div
          id="mobile-navigation"
          aria-hidden={!mobileOpen}
          className={cn(
            "grid transition-[grid-template-rows,opacity] duration-200 xl:hidden",
            mobileOpen
              ? "grid-rows-[1fr] opacity-100"
              : "pointer-events-none grid-rows-[0fr] opacity-0"
          )}
        >
          <div className="min-h-0 overflow-hidden">
            <nav
              aria-label="Mobile navigation"
              className="mt-3 rounded-2xl border border-navy/10 bg-white px-5 py-3 shadow-[0_8px_24px_rgba(20,35,70,0.08)]"
            >
              {/* ------------------------------------------------------------ */}
              {/* Main Links                                                    */}
              {/* ------------------------------------------------------------ */}

              <div>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    tabIndex={mobileOpen ? 0 : -1}
                    aria-current={
                      isActive(link.href) ? "page" : undefined
                    }
                    className={cn(
                      "flex min-h-12 items-center border-b border-navy/5 text-[15px] font-medium text-navy/70 transition-colors hover:text-navy focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sapphire",
                      isActive(link.href) && "font-semibold text-navy"
                    )}
                  >
                    {link.label}

                    {isActive(link.href) && (
                      <span className="ml-auto h-1.5 w-1.5 rounded-full bg-navy" />
                    )}
                  </Link>
                ))}
              </div>

              {/* ------------------------------------------------------------ */}
              {/* Mobile Authentication                                         */}
              {/* ------------------------------------------------------------ */}

              <div className="mt-4 border-t border-navy/10 pt-4">
                {/* Not signed in */}
                {!isSignedIn && !isLoading && (
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/login"
                      tabIndex={mobileOpen ? 0 : -1}
                      className="flex min-h-12 items-center justify-center gap-2 rounded-xl border border-navy/15 text-[15px] font-semibold text-navy transition-colors hover:bg-navy/5"
                    >
                      <LogIn className="h-4 w-4" />
                      Sign in
                    </Link>

                    <Link
                      href="/join"
                      tabIndex={mobileOpen ? 0 : -1}
                      className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-navy text-[15px] font-semibold text-white transition-colors hover:bg-sapphire"
                    >
                      <UserPlus className="h-4 w-4" />
                      Join TOUR
                    </Link>
                  </div>
                )}

                {/* Signed in */}
                {isSignedIn && (
                  <div className="space-y-2">
                    {/* User information */}
                    <div className="flex items-center gap-3 rounded-xl bg-navy/5 px-3 py-3">
                      <div className="grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full bg-navy text-white">
                        {user?.image ? (
                          <img
                            src={user.image}
                            alt={user.name || "User"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <User className="h-5 w-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-navy">
                          {user?.name || "User"}
                        </p>

                        <p className="truncate text-xs text-navy/50">
                          {user?.email || role || "TOUR Member"}
                        </p>
                      </div>
                    </div>

                    {/* Dashboard */}
                    <Link
                      href={getDashboardPath()}
                      tabIndex={mobileOpen ? 0 : -1}
                      className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-[15px] font-semibold text-navy transition-colors hover:bg-navy/5"
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

                    {/* Author links */}
                    {isAuthor && (
                      <>
                        <Link
                          href="/researcher"
                          tabIndex={mobileOpen ? 0 : -1}
                          className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-[15px] font-semibold text-navy transition-colors hover:bg-navy/5"
                        >
                          <FlaskConical className="h-4 w-4 text-sapphire" />
                          My Research
                        </Link>

                        <Link
                          href="/my-submissions"
                          tabIndex={mobileOpen ? 0 : -1}
                          className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-[15px] font-semibold text-navy transition-colors hover:bg-navy/5"
                        >
                          <FlaskConical className="h-4 w-4 text-sapphire" />
                          My Submissions
                        </Link>
                      </>
                    )}

                    {/* Settings */}
                    <Link
                      href="/settings"
                      tabIndex={mobileOpen ? 0 : -1}
                      className="flex min-h-12 items-center gap-3 rounded-xl px-3 text-[15px] font-semibold text-navy transition-colors hover:bg-navy/5"
                    >
                      <Settings className="h-4 w-4 text-sapphire" />
                      Settings
                    </Link>

                    {/* Logout */}
                    <button
                      type="button"
                      onClick={handleLogout}
                      tabIndex={mobileOpen ? 0 : -1}
                      className="flex min-h-12 w-full items-center gap-3 rounded-xl px-3 text-left text-[15px] font-semibold text-red-600 transition-colors hover:bg-red-50"
                    >
                      <LogIn className="h-4 w-4 rotate-180" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}