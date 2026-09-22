"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  FlaticonArrowRight, 
  FlaticonGithub,
  FlaticonTwitter,
  FlaticonLinkedin,
  FlaticonInstagram,
  FlaticonCheckCircle
} from "@/components/flaticons";

const footerNavLinks = [
  { href: "/about", label: "About Us" },
  { href: "/research", label: "Research" },
  { href: "/get-published", label: "Get Published" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/contact", label: "Contact Us" },
];

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com", icon: FlaticonTwitter },
  { name: "LinkedIn", href: "https://linkedin.com", icon: FlaticonLinkedin },
  { name: "GitHub", href: "https://github.com", icon: FlaticonGithub },
  { name: "Instagram", href: "https://instagram.com", icon: FlaticonInstagram },
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
    <footer className="border-t-2 border-navy bg-navy text-white">
      {/* MAIN 3-COLUMN FOOTER CONTAINER */}
      <div className="container-tour py-12 md:py-16">
        <div className="grid gap-10 lg:grid-cols-12 items-stretch">
          
          {/* LEFT COLUMN: NAVIGATION & SOCIAL ICONS (3 COLS) */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-8 pr-0 lg:pr-6 border-b lg:border-b-0 lg:border-r border-white/15 pb-8 lg:pb-0">
            <nav aria-label="Footer links" className="space-y-3">
              {footerNavLinks.map((link) => (
                <div key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold text-white/80 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </div>
              ))}
            </nav>

            {/* Flaticon Social Buttons */}
            <div className="flex items-center gap-3 pt-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white hover:text-navy transition-all duration-150"
                  >
                    <Icon size={15} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* CENTER COLUMN: GET UPDATES NEWSLETTER (6 COLS, CENTERED WITH DIVIDERS) */}
          <div className="lg:col-span-6 flex flex-col items-center justify-center text-center px-0 lg:px-8 border-b lg:border-b-0 lg:border-r border-white/15 pb-8 lg:pb-0 space-y-4">
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-white tracking-tight">
              Get Updates
            </h2>
            <p className="text-sm italic text-white/80 max-w-md font-serif">
              Subscribe to our newsletter to receive updates and announcements.
            </p>

            {subscribed ? (
              <div className="mt-4 rounded-xl border border-white/30 bg-white/10 p-4 text-white text-xs md:text-sm font-semibold flex items-center gap-2">
                <FlaticonCheckCircle size={18} className="text-white shrink-0" />
                <span>Thank you for subscribing to TOUR updates!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="w-full max-w-md mt-4 space-y-3">
                <div className="w-full">
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="*Email"
                    className="w-full rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white focus:bg-white/20 focus:outline-none transition"
                  />
                </div>
                
                <div className="flex gap-3">
                  <input
                    required
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="*First Name"
                    className="flex-1 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm text-white placeholder:text-white/50 focus:border-white focus:bg-white/20 focus:outline-none transition"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-white px-6 py-3 text-xs font-bold uppercase tracking-wider text-navy hover:bg-white/90 transition cursor-pointer shrink-0"
                  >
                    SIGN UP
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* RIGHT COLUMN: CONTACT & ADDRESS (3 COLS) */}
          <div className="lg:col-span-3 flex flex-col justify-between space-y-6 pl-0 lg:pl-6 text-left lg:text-right">
            <div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-sm md:text-base font-bold text-white hover:underline transition-all"
              >
                <span>Send Us A Message</span>
                <FlaticonArrowRight size={16} />
              </Link>

              <div className="mt-6 space-y-2 text-xs md:text-sm text-white/80">
                <p className="font-semibold text-white">+250 788 000 000</p>
                <p className="leading-relaxed">
                  285 Research Way<br />
                  Kigali, Rwanda
                </p>
              </div>
            </div>

            {/* Bottom Right TOUR Seal / Badge */}
            <div className="flex justify-start lg:justify-end pt-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-semibold text-white">
                <span className="h-2 w-2 rounded-full bg-white" />
                <span>TOUR Open Platform</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* SUB-FOOTER BOTTOM BAR */}
      <div className="border-t border-white/15 bg-navy/90 py-5 text-xs text-white/60">
        <div className="container-tour flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p>© {new Date().getFullYear()} TOUR — The Open Undergraduate Research Platform. All Rights Reserved.</p>
          <div className="flex items-center gap-4 text-white/70 font-medium">
            <Link href="/about" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>·</span>
            <Link href="/about" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>·</span>
            <span className="text-white/80">Website By TOUR</span>
          </div>
        </div>
      </div>

    </footer>
  );
}
