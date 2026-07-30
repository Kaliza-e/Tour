"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/questions", label: "Questions" },
  { href: "/research", label: "Research" },
  { href: "/publications", label: "Publications" },
  { href: "/community", label: "Community" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-4 z-50">
      <div className="container-tour">
        <div className="flex h-16 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/logo.png"
              alt="Tour"
              width={156}
              height={50}
              priority
              className="h-12 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-navy/70 transition-colors hover:text-navy"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Side */}
          <div className="flex items-center gap-3">

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="text-navy md:hidden"
              aria-label="Toggle Menu"
              onClick={() => setOpen(!open)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {open ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {/* Login */}
            <Link
              href="/login"
              className="hidden text-sm font-semibold text-navy/70 hover:text-navy sm:block"
            >
              Log In
            </Link>

            {/* CTA */}
            <Link href="/get-started">
              <Button
                size="sm"
                className="bg-navy text-ivory hover:bg-sapphire"
              >
                Get Started
              </Button>
            </Link>

          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="mt-3 rounded-card border border-navy/10 bg-white p-4 shadow-card md:hidden">
            <div className="flex flex-col gap-4">

              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-navy/70 hover:text-navy"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-navy/70 hover:text-navy"
              >
                Log In
              </Link>

              <Link
                href="/get-started"
                onClick={() => setOpen(false)}
              >
                <Button
                  className="w-full bg-navy text-ivory hover:bg-sapphire"
                >
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
