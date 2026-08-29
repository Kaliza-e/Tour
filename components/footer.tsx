"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TourLogo } from "@/components/tour-logo";

const footerLinks = [
  { href: "/research", label: "Explore" },
  { href: "/join", label: "Join" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const pathname = usePathname();

  // Hide footer on portal and auth pages
  const hiddenFooterPages = ["/dashboard", "/workspace", "/submit", "/achievements", "/settings", "/login", "/join"];
  const isHiddenPage = hiddenFooterPages.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
  if (isHiddenPage) return null;

  return (
    <footer className="border-t border-navy/10 bg-navy text-ivory">
      <div className="container-tour py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo + tagline */}
          <div className="flex items-center gap-3">
            <TourLogo variant="panel" imageClassName="h-7" />
            <span className="text-xs text-ivory/50 hidden sm:inline">
              Where curiosity becomes knowledge.
            </span>
          </div>

          {/* Inline links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            {footerLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-[11px] font-semibold text-ivory/50 hover:text-ivory transition uppercase tracking-wide"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <p className="text-[11px] text-ivory/40 shrink-0">
            © {new Date().getFullYear()} Tour
          </p>
        </div>
      </div>
    </footer>
  );
}
