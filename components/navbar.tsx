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

  // Hide the global navbar on writer pages that use the sidebar layout
  const writerPages = ["/dashboard", "/workspace", "/submit"];
  const isWriterPage = writerPages.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (isWriterPage) return null;

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
          <Link href="/" className="shrink-0">
            <TourLogo
              priority
              imageClassName="h-9"
              className="rounded-full bg-navy/5 p-1.5 hover:bg-navy/10 transition"
            />
          </Link>

          {/* ── Desktop Nav Links ── */}
          <nav aria-label="Primary" className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-[12px] font-bold uppercase tracking-wide transition-all duration-150",
                  isActive(link.href)
                    ? "bg-navy text-ivory shadow-sm"
                    : "text-navy/60 hover:bg-navy/6 hover:text-navy"
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
          <div className="mt-3 overflow-hidden rounded-3xl border border-navy/12 bg-white/97 shadow-soft backdrop-blur-2xl lg:hidden">
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-1.5">
                {navLinks.map((link) => (
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

              <div className="border-t border-navy/8 pt-4 space-y-2">
                <Link
                  href="/login"
                  className="block rounded-2xl border border-navy/15 bg-ivory/50 px-4 py-3 text-xs font-bold text-navy text-center hover:bg-champagne/60 transition"
                >
                  Log In to Your Account
                </Link>
                <Link
                  href="/join"
                  className="block rounded-2xl bg-navy text-ivory px-4 py-3 text-xs font-bold text-center hover:bg-sapphire transition"
                >
                  Join Tour →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
