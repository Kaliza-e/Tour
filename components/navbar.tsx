import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/explore", label: "For Students" },
  { href: "/companies", label: "For Companies" },
  { href: "/blog", label: "Blog" },
  { href: "/support", label: "Support" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50">
      <div className="container-tour">
        <div className="bg-navy text-ivory rounded-pill shadow-card flex items-center justify-between h-14 px-4">
          <Link href="/" className="flex items-center gap-3">
            {/* Put a `public/logo.png` file to use a custom image. */}
            <div className="flex items-center">
              <Image src="/logo.png" alt="Tour" width={120} height={36} className="hidden sm:block object-contain" />
              <span className="grid h-9 w-9 place-items-center rounded-full bg-ivory text-navy font-heading text-sm sm:hidden">
                T
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium text-ivory/85 hover:text-ivory transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-ivory/90"
              aria-label="Toggle menu"
              onClick={() => setOpen((v) => !v)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>

            <Link href="/login" className="hidden sm:block text-sm font-semibold text-ivory/90 hover:text-ivory">
              Log in
            </Link>

            <Link href="/get-started">
              <Button variant="secondary" size="sm" className="bg-ivory text-navy hover:bg-champagne">
                Get Started
              </Button>
            </Link>
          </div>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div className="mt-3 bg-navy/95 text-ivory rounded-lg p-3 shadow-card md:hidden">
            <div className="flex flex-col gap-3">
              {links.map((l) => (
                <Link key={l.href} href={l.href} className="text-sm font-medium text-ivory/90 hover:text-ivory">
                  {l.label}
                </Link>
              ))}
              <Link href="/login" className="text-sm font-medium text-ivory/90 hover:text-ivory">
                Log in
              </Link>
              <Link href="/get-started" className="pt-2">
                <Button variant="secondary" size="default" className="w-full bg-ivory text-navy">
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
