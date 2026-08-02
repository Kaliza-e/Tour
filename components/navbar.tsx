"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Sparkles, BookOpen, Compass, Award, Users, PlusCircle, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourLogo } from "@/components/tour-logo";
import { cn } from "@/lib/utils";

// Primary Navigation Categories
const mainNav = [
  { href: "/questions", label: "Questions" },
  { href: "/research", label: "Explore Research" },
  { href: "/submit", label: "Submit Paper" },
];

const ecosystemDropdown = [
  { href: "/mentorship", label: "Mentorship Directory", icon: Users, desc: "Connect with graduate advisors" },
  { href: "/challenges", label: "Research Challenges", icon: Sparkles, desc: "Monthly contests & seed grants" },
  { href: "/achievements", label: "Badges & Certificates", icon: Award, desc: "Track verified volunteer hours" },
  { href: "/community", label: "Community Feed", icon: BookOpen, desc: "Youth scientific discussions" },
];

const organizationDropdown = [
  { href: "/about", label: "Story & Values", icon: Compass, desc: "Our vision & mission statement" },
  { href: "/join", label: "Volunteer Program", icon: UserCheck, desc: "Become a writer, reviewer or leader" },
  { href: "/team", label: "Our Team", icon: Users, desc: "Leadership & global advisors" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<"ecosystem" | "org" | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const openDropdown = (name: "ecosystem" | "org") => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveDropdown(name);
  };

  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  };

  const cancelClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300 py-3 px-4 md:px-8">
      <div className="container-tour">
        <div
          className={cn(
            "mx-auto flex max-w-7xl items-center justify-between gap-4 rounded-full border border-navy/10 px-5 py-2.5 transition-all duration-300 backdrop-blur-xl",
            scrolled ? "bg-white/95 shadow-soft border-navy/15 py-2" : "bg-white/80 shadow-card"
          )}
        >
          {/* Logo — TourLogo renders its own Link internally */}
          <TourLogo priority imageClassName="h-9" className="rounded-full bg-navy/5 p-1.5 transition hover:scale-105" />

          {/* Desktop Navigation Menu */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-1.5">
            {mainNav.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition duration-200",
                  isActive(link.href)
                    ? "bg-navy text-ivory shadow-sm"
                    : "text-navy/80 hover:bg-navy/5 hover:text-navy"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Ecosystem Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openDropdown("ecosystem")}
              onMouseLeave={scheduleClose}
            >
              <button
                className={cn(
                  "flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition duration-200 text-navy/80 hover:bg-navy/5 hover:text-navy",
                  activeDropdown === "ecosystem" && "bg-navy/5 text-navy"
                )}
              >
                Ecosystem <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200" />
              </button>

              {activeDropdown === "ecosystem" && (
                <div
                  className="absolute top-full left-0 w-72 rounded-3xl border border-navy/10 bg-white shadow-soft backdrop-blur-xl"
                  style={{ paddingTop: "10px" }}
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                >
                  <div className="rounded-3xl bg-white p-3">
                    {ecosystemDropdown.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className={cn(
                            "flex items-start gap-3 rounded-2xl p-3 transition duration-150 hover:bg-ivory/60",
                            isActive(item.href) && "bg-champagne/40"
                          )}
                        >
                          <div className="rounded-full bg-sapphire/10 p-2 text-sapphire mt-0.5">
                            <IconComp className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-navy">{item.label}</p>
                            <p className="text-[11px] text-navy/60 leading-tight">{item.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Organization Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => openDropdown("org")}
              onMouseLeave={scheduleClose}
            >
              <button
                className={cn(
                  "flex items-center gap-1 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-wider transition duration-200 text-navy/80 hover:bg-navy/5 hover:text-navy",
                  activeDropdown === "org" && "bg-navy/5 text-navy"
                )}
              >
                About TOUR <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200" />
              </button>

              {activeDropdown === "org" && (
                <div
                  className="absolute top-full left-0 w-72 rounded-3xl border border-navy/10 bg-white shadow-soft backdrop-blur-xl"
                  style={{ paddingTop: "10px" }}
                  onMouseEnter={cancelClose}
                  onMouseLeave={scheduleClose}
                >
                  <div className="rounded-3xl bg-white p-3">
                    {organizationDropdown.map((item) => {
                      const IconComp = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          className={cn(
                            "flex items-start gap-3 rounded-2xl p-3 transition duration-150 hover:bg-ivory/60",
                            isActive(item.href) && "bg-champagne/40"
                          )}
                        >
                          <div className="rounded-full bg-sapphire/10 p-2 text-sapphire mt-0.5">
                            <IconComp className="h-4 w-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-navy">{item.label}</p>
                            <p className="text-[11px] text-navy/60 leading-tight">{item.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="hidden sm:inline-flex">
              <Button size="sm" variant="secondary" className="rounded-full px-4 text-xs font-semibold">
                Dashboard
              </Button>
            </Link>

            <Link href="/submit" className="hidden sm:inline-flex">
              <Button size="sm" className="rounded-full bg-navy text-ivory hover:bg-sapphire px-5 text-xs font-semibold">
                Submit Research
              </Button>
            </Link>

            {/* Mobile Toggle Button */}
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full border border-navy/15 bg-white text-navy shadow-sm lg:hidden hover:bg-ivory"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Responsive Mobile Drawer */}
        {mobileOpen && (
          <div className="mt-3 overflow-hidden rounded-3xl border border-navy/15 bg-white/95 p-5 shadow-soft backdrop-blur-2xl lg:hidden space-y-4 animate-in fade-in slide-in-from-top-3">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sapphire px-3">Main Directory</p>
              {mainNav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block rounded-2xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition",
                    isActive(link.href) ? "bg-navy text-ivory" : "text-navy hover:bg-ivory"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-navy/10 pt-3 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sapphire px-3">Ecosystem & Programs</p>
              {ecosystemDropdown.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-xs font-semibold text-navy transition hover:bg-ivory",
                    isActive(item.href) && "bg-champagne/50"
                  )}
                >
                  <item.icon className="h-4 w-4 text-sapphire" />
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-navy/10 pt-3 space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-sapphire px-3">Organization</p>
              {organizationDropdown.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-xs font-semibold text-navy transition hover:bg-ivory",
                    isActive(item.href) && "bg-champagne/50"
                  )}
                >
                  <item.icon className="h-4 w-4 text-sapphire" />
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-navy/10 pt-3 grid gap-2">
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button variant="secondary" className="w-full rounded-full text-xs font-bold">
                  User Dashboard
                </Button>
              </Link>
              <Link href="/submit" onClick={() => setMobileOpen(false)}>
                <Button className="w-full rounded-full bg-navy text-ivory hover:bg-sapphire text-xs font-bold">
                  Submit Research Paper
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
