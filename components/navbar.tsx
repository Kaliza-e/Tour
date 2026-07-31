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
    <header className="site-header">
      <div className="container-tour">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-full border border-slate-200/30 bg-white/85 px-4 py-3 shadow-soft backdrop-blur-xl backdrop-saturate-150">
          <TourLogo priority imageClassName="h-11" className="rounded-full bg-sapphire/10 p-2 shadow-soft" />

          <nav aria-label="Primary navigation" className="hidden flex-1 items-center justify-center gap-2 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] transition duration-200",
                  isActive(link.href)
                    ? "bg-sapphire text-white shadow-card"
                    : "text-slate-600 hover:bg-slate-100 hover:text-navy"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-full px-4 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-100 md:inline-flex"
            >
              Log in
            </Link>

            <Link href="/join" className="hidden md:inline-flex">
              <Button size="sm" variant="primary" className="rounded-full px-5 py-2">
                Get Started
              </Button>
            </Link>

            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-navy shadow-soft md:hidden"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="mb-4 overflow-hidden rounded-3xl border border-slate-200/30 bg-white/95 p-4 shadow-soft md:hidden">
            <div className="flex flex-col gap-3">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "rounded-full px-4 py-3 text-sm font-semibold uppercase transition duration-200",
                    isActive(link.href)
                      ? "bg-sapphire text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-navy"
                  )}
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="rounded-full px-4 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:bg-slate-100 hover:text-navy"
              >
                Log in
              </Link>

              <Link href="/join" onClick={() => setOpen(false)}>
                <Button className="w-full rounded-full bg-sapphire text-white hover:bg-navy">
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
