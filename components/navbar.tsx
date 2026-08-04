"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourLogo } from "@/components/tour-logo";
import { cn } from "@/lib/utils";

// Core navigation groups
const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/research", label: "Explore Research" },
  { href: "/submit", label: "Submit" },
];

const secondaryLinks = [
  { href: "/join", label: "Join TOUR" },
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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "py-2" : "py-3"
      )}
    >
      <div className="container-tour">
        {/* ── Pill Bar ── */}
        <div
          className={cn(
            "flex items-center justify-between gap-4 rounded-full border px-5 py-2.5 transition-all duration-300 backdrop-blur-xl",
            scrolled
              ? "border-navy/15 bg-white/95 shadow-soft"
              : "border-navy/10 bg-white/80 shadow-card"
          )}
        >
          {/* Logo */}
          <div className="shrink-0">
            <TourLogo priority imageClassName="h-9" className="rounded-full bg-navy/5 p-1.5" />
          </div>

          {/* ── Desktop Nav ── */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-0.5">
            {/* Primary links */}
            {primaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[11px] font-bold uppercase tracking-widest transition-all duration-150",
                  isActive(link.href)
                    ? "bg-navy text-ivory shadow-sm"
                    : "text-navy/70 hover:bg-navy/6 hover:text-navy"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Divider */}
            <span className="mx-2 h-4 w-px bg-navy/15 rounded-full" />

            {/* Secondary links */}
            {secondaryLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-[11px] font-bold uppercase tracking-widest transition-all duration-150",
                  isActive(link.href)
                    ? "bg-navy text-ivory shadow-sm"
                    : "text-navy/70 hover:bg-navy/6 hover:text-navy"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* ── CTA + Hamburger ── */}
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/submit" className="hidden md:inline-flex">
              <Button
                size="sm"
                className="rounded-full bg-navy text-ivory hover:bg-sapphire text-[11px] font-bold uppercase tracking-wider px-5"
              >
                Submit Research
              </Button>
            </Link>

            {/* Mobile hamburger */}
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
        </div>

        {/* ── Mobile Drawer ── */}
        {mobileOpen && (
          <div className="mt-3 overflow-hidden rounded-3xl border border-navy/12 bg-white/97 shadow-soft backdrop-blur-2xl lg:hidden">
            <div className="p-5 space-y-5">
              {/* Core Pages */}
              <div className="space-y-1">
                <p className="px-3 text-[9px] font-bold uppercase tracking-[0.15em] text-sapphire mb-2">
                  Core Pages
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {[...primaryLinks, ...secondaryLinks].map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "rounded-2xl px-4 py-3 text-xs font-bold uppercase tracking-wider transition text-center",
                        isActive(link.href)
                          ? "bg-navy text-ivory shadow-sm"
                          : "bg-ivory/70 text-navy hover:bg-champagne/60"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Research Paper shortcut */}
              <div className="border-t border-navy/8 pt-4 space-y-1">
                <p className="px-3 text-[9px] font-bold uppercase tracking-[0.15em] text-sapphire mb-2">
                  Quick Access
                </p>
                <Link
                  href="/research"
                  className="flex items-center gap-2 rounded-2xl bg-ivory/70 px-4 py-3 text-xs font-semibold text-navy hover:bg-champagne/60 transition"
                >
                  Browse Research Papers →
                </Link>
                <Link
                  href="/submit"
                  className="flex items-center gap-2 rounded-2xl bg-navy text-ivory px-4 py-3 text-xs font-bold hover:bg-sapphire transition"
                >
                  Submit Your Research →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
