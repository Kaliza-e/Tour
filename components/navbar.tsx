"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourLogo } from "@/components/tour-logo";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/research", label: "Explore Research" },
  { href: "/questions", label: "Question Hub" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  // Hide the global navbar on writer portal & auth pages
  const hiddenNavbarPages = ["/dashboard", "/workspace", "/submit", "/achievements", "/settings", "/login", "/join"];
  const isHiddenPage = hiddenNavbarPages.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (isHiddenPage) return null;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "py-1.5" : "py-2.5"
      )}
    >
      <div className="container-tour">
        <div
          className={cn(
            "flex items-center justify-between gap-6 rounded-full border px-5 lg:px-7 py-2.5 transition-all duration-300 backdrop-blur-xl",
            scrolled
              ? "border-navy/15 bg-white/95 shadow-soft"
              : "border-navy/10 bg-white/85 shadow-card"
          )}
        >
          {/* Logo */}
          <TourLogo
            priority
            imageClassName="h-9"
            className="p-1 transition opacity-95 hover:opacity-100"
          />

          {/* ── Desktop Nav Links ── */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-wide transition-all duration-150 border-b-2",
                  isActive(link.href)
                    ? "text-navy border-navy font-extrabold"
                    : "text-navy/65 hover:text-navy border-transparent hover:border-navy/30"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── Desktop: Auth CTAs ── */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <Link href="/login">
              <Button
                size="sm"
                variant="secondary"
                className="rounded-full border-navy/20 text-navy hover:bg-navy hover:text-ivory text-[11px] font-bold uppercase tracking-wider px-5 py-1.5 flex items-center gap-1.5"
              >
                <LogIn className="h-3.5 w-3.5" />
                Log In
              </Button>
            </Link>

            <Link href="/join">
              <Button
                size="sm"
                className="rounded-full bg-navy text-ivory hover:bg-sapphire text-[11px] font-bold uppercase tracking-wider px-5 py-1.5 shadow-sm flex items-center gap-1.5"
              >
                <UserPlus className="h-3.5 w-3.5" />
                Join Tour
              </Button>
            </Link>
          </div>

          {/* ── Mobile Hamburger ── */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-full border border-navy/15 bg-white text-navy shadow-sm hover:bg-ivory lg:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* ── Mobile Drawer ── */}
        {mobileOpen && (
          <div className="mt-2 overflow-hidden rounded-3xl border border-navy/10 bg-white shadow-xl lg:hidden">
            <div className="p-4 pb-6 space-y-6">
              <div className="flex flex-col space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "rounded-full px-6 py-3.5 text-[15px] font-semibold transition flex items-center justify-between",
                      isActive(link.href)
                        ? "bg-navy/5 text-navy"
                        : "text-navy/75 hover:text-navy"
                    )}
                  >
                    <span>{link.label}</span>
                    {isActive(link.href) && (
                      <span className="h-1.5 w-1.5 rounded-full bg-navy" />
                    )}
                  </Link>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link
                  href="/login"
                  className="flex items-center justify-center rounded-full border border-navy/20 bg-white px-4 py-3.5 text-sm font-bold text-navy hover:bg-navy/5 transition"
                >
                  Log In
                </Link>
                <Link
                  href="/join"
                  className="flex items-center justify-center rounded-full bg-navy text-ivory px-4 py-3.5 text-sm font-bold hover:bg-sapphire transition shadow-md"
                >
                  Join Tour
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
