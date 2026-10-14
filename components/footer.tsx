"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { TourLogo } from "@/components/tour-logo";
import { 
  FlaticonArrowRight, 
  FlaticonGithub,
  FlaticonTwitter,
  FlaticonLinkedin,
  FlaticonInstagram,
  FlaticonCheckCircle,
  FlaticonBook,
  FlaticonStar
} from "@/components/flaticons";
import { Mail, MapPin, Send, ShieldCheck, HeartHandshake } from "lucide-react";

const exploreLinks = [
  { href: "/about", label: "About Tour" },
  { href: "/research", label: "Research Board" },
  { href: "/publications", label: "Published Library" },
  { href: "/join", label: "Join the Platform" },
];

const participateLinks = [
  { href: "/get-published", label: "Submit Research" },
  { href: "/volunteer", label: "Volunteer with Us" },
  { href: "/contact", label: "Contact & Inquiries" },
  { href: "/about#guidelines", label: "Author Guidelines" },
];

const socialLinks = [
  { name: "Twitter / X", href: "https://twitter.com", icon: FlaticonTwitter },
  { name: "LinkedIn", href: "https://linkedin.com", icon: FlaticonLinkedin },
  { name: "GitHub", href: "https://github.com", icon: FlaticonGithub },
  { name: "Instagram", href: "https://www.instagram.com/tour.research/#", icon: FlaticonInstagram },
];

export function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const hiddenFooterPages = [
    "/dashboard",
    "/workspace",
    "/submit",
    "/achievements",
    "/settings",
    "/login",
    "/join",
  ];
  
  const isHiddenPage = hiddenFooterPages.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );

  if (isHiddenPage) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && firstName) {
      setSubscribed(true);
    }
  };

  return (
    <footer className="relative bg-[#090F24] text-white border-t border-white/10 overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 rounded-full bg-sapphire/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 translate-y-1/3 w-80 h-80 rounded-full bg-champagne/10 blur-[100px] pointer-events-none" />

      {/* 1. INSTITUTIONAL STATUS BANNER (Sleek, reassuring, non-intrusive) */}
      <div className="border-b border-white/10 bg-white/[0.02]">
        <div className="container-tour py-4">
          <div className="flex flex-col gap-3 rounded-2xl bg-white/[0.04] border border-white/10 px-5 py-4 text-left backdrop-blur-md md:flex-row md:items-center md:justify-between">
            <div className="flex min-w-0 flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-champagne/20 border border-champagne/30 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-champagne shrink-0">
                <HeartHandshake size={13} />
                Nonprofit Status Note
              </span>
              <p className="w-full text-xs sm:w-auto sm:flex-1 sm:text-[13px] text-white/80 leading-relaxed font-light">
                Tour is not yet a registered 501(c)(3) organization. However, we are happy to provide verification or confirmation of participation for schools or clubs upon request.
              </p>
            </div>
            <Link
              href="/contact"
              className="self-start text-[11px] font-semibold text-champagne hover:text-white transition-colors underline underline-offset-4 shrink-0 md:self-auto"
            >
              Request Verification &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* 2. MAIN FOOTER CONTENT GRID */}
      <div className="container-tour pt-14 pb-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          
          {/* COLUMN 1: BRAND & MISSION STATEMENT (4 COLS) */}
          <div className="lg:col-span-4 space-y-5">
            <TourLogo className="justify-start" imageClassName="h-10 w-auto brightness-0 invert" />

            <p className="text-sm text-white/75 leading-relaxed font-light max-w-sm">
              An open, student-led academic platform providing young scholars a supportive environment to inquire, research, write, and publish peer-reviewed work.
            </p>

            {/* Platform Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.05] px-3.5 py-1.5 text-xs text-white/85">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-medium text-[11px]">The Open Student Research Platform</span>
            </div>

            {/* Social Icons */}
            <div className="pt-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/50 mb-2.5">
                Connect With Us
              </p>
              <div className="flex items-center gap-2.5">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/15 bg-white/[0.04] text-white/80 hover:bg-white hover:text-navy hover:border-white transition-all duration-200"
                    >
                      <Icon size={15} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* COLUMN 2: EXPLORE LINKS (2.5 COLS) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-champagne">
              Explore
            </h3>
            <ul className="space-y-2.5 text-sm">
              {exploreLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/75 hover:text-white transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <span className="h-1 w-1 rounded-full bg-champagne/50 group-hover:bg-champagne transition-colors" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: GET INVOLVED (2.5 COLS) */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-champagne">
              Contribute
            </h3>
            <ul className="space-y-2.5 text-sm">
              {participateLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/75 hover:text-white transition-colors duration-150 flex items-center gap-1.5 group"
                  >
                    <span className="h-1 w-1 rounded-full bg-champagne/50 group-hover:bg-champagne transition-colors" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: NEWSLETTER & DIRECT CONTACT (3 COLS) */}
          <div className="lg:col-span-4 space-y-5">
            <div>
              <h3 className="font-heading text-xs font-bold uppercase tracking-[0.2em] text-champagne">
                Get Updates
              </h3>
              <p className="mt-1.5 text-xs text-white/70 leading-relaxed font-light">
                Subscribe to our newsletter to receive student research updates and call-for-papers.
              </p>
            </div>

            {subscribed ? (
              <div className="rounded-2xl border border-emerald-400/30 bg-emerald-950/40 p-4 text-xs font-medium text-emerald-200 flex items-center gap-2.5 backdrop-blur-sm">
                <FlaticonCheckCircle size={18} className="text-emerald-400 shrink-0" />
                <span>Thank you! You are subscribed to TOUR announcements.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full rounded-xl border border-white/20 bg-white/[0.06] px-3.5 py-2.5 text-xs text-white placeholder:text-white/45 focus:border-champagne focus:bg-white/[0.1] focus:outline-none transition backdrop-blur-sm"
                />
                
                <div className="flex gap-2">
                  <input
                    required
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="flex-1 rounded-xl border border-white/20 bg-white/[0.06] px-3.5 py-2.5 text-xs text-white placeholder:text-white/45 focus:border-champagne focus:bg-white/[0.1] focus:outline-none transition backdrop-blur-sm"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-champagne px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-navy hover:bg-white transition-all cursor-pointer shrink-0 shadow-md font-heading"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            )}

            {/* Direct Editorial Office Contact */}
            <div className="pt-2 border-t border-white/10 space-y-2 text-xs text-white/75">
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-champagne shrink-0" />
                <a 
                  href="mailto:tourresearchhub@gmail.com" 
                  className="hover:text-white hover:underline transition-colors"
                >
                  tourresearchhub@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-champagne shrink-0" />
                <span>Tripoli, Libya · Africa</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. SUB-FOOTER BOTTOM BAR (With generous right clearance for Ask Tour AI) */}
      <div className="border-t border-white/10 bg-black/30 py-5 text-xs text-white/60">
        <div className="container-tour flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left pr-4 md:pr-36">
          <p className="text-[11px] leading-relaxed">
            © {new Date().getFullYear()} TOUR — The Open Undergraduate Research Platform. All Rights Reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-white/70">
            <Link href="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/about" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>·</span>
            <Link href="/contact" className="hover:text-white transition-colors">Contact Editorial Team</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
