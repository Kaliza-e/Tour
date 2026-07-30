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
        <div className="bg-navy text-ivory rounded-pill shadow-card flex h-14 items-center justify-between px-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Tour"
              width={140}
              height={40}
              className="hidden sm:block object-contain"
            />

            <span className="grid h-9 w-9 place-items-center rounded-full bg-ivory text-navy font-heading text-sm sm:hidden">
              T
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ivory/85 transition-colors hover:text-ivory"
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
              className="md:hidden text-ivory"
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
              className="hidden sm:block text-sm font-semibold text-ivory/90 hover:text-ivory"
            >
              Log In
            </Link>

            {/* CTA */}
            <Link href="/get-started">
              <Button
                variant="secondary"
                size="sm"
                className="bg-ivory text-navy hover:bg-champagne"
              >
                Get Started
              </Button>
            </Link>

          </div>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="mt-3 rounded-3xl bg-navy/95 p-4 shadow-card md:hidden">
            <div className="flex flex-col gap-4">

              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-medium text-ivory/90 hover:text-ivory"
                >
                  {link.label}
                </Link>
              ))}

              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="text-sm font-medium text-ivory/90 hover:text-ivory"
              >
                Log In
              </Link>

              <Link
                href="/get-started"
                onClick={() => setOpen(false)}
              >
                <Button
                  className="w-full bg-ivory text-navy hover:bg-champagne"
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