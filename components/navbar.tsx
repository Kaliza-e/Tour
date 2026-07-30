"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourLogo } from "@/components/tour-logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/questions", label: "Questions" },
  { href: "/research", label: "Research" },
  { href: "/publications", label: "Publications" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-ivory/95 backdrop-blur">
      <div className="container-tour">
        <div className="flex h-20 items-center justify-between gap-4">
          <TourLogo priority imageClassName="h-11" />

          <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-pill px-4 py-2 text-sm font-semibold transition-colors",
                  isActive(link.href)
                    ? "bg-white text-navy shadow-card"
                    : "text-navy/60 hover:bg-white/70 hover:text-navy"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-pill px-4 py-2 text-sm font-semibold text-navy/65 transition-colors hover:bg-white/70 hover:text-navy sm:block"
            >
              Log In
            </Link>

            <Link href="/join" className="hidden sm:block">
              <Button size="sm" className="bg-navy text-ivory hover:bg-sapphire">
                Get Started
              </Button>
            </Link>

            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-navy/10 bg-white text-navy shadow-card md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="mb-4 rounded-card border border-navy/10 bg-white p-4 shadow-card md:hidden">
            <div className="flex flex-col gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-2xl px-3 py-2 text-sm font-semibold",
                    isActive(link.href)
                      ? "bg-ivory text-navy"
                      : "text-navy/65 hover:bg-ivory hover:text-navy"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-2xl px-3 py-2 text-sm font-semibold text-navy/65 hover:bg-ivory hover:text-navy"
              >
                Log In
              </Link>

              <Link href="/join" onClick={() => setOpen(false)}>
                <Button className="w-full bg-navy text-ivory hover:bg-sapphire">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
