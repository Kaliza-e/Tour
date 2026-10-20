"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUp, ArrowRight, HeartHandshake, CheckCircle2 } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About us" },
  { href: "/research", label: "Research Board" },
  { href: "/publications", label: "Publications" },
  { href: "/questions", label: "Question Hub" },
];

const contributeLinks = [
  { href: "/get-published", label: "Submit Research" },
  { href: "/join-team", label: "Peer Review" },
  { href: "/volunteer", label: "Volunteer" },
  { href: "/contact", label: "Chapter Network" },
];

const policyLinks = [
  { href: "/about#open-access", label: "Open Access" },
  { href: "/about#guidelines", label: "Author Guidelines" },
  { href: "/about#ethics", label: "Ethics & AI Policy" },
  { href: "/about#verification", label: "Student Verification" },
];

const aboutLinks = [
  { href: "/about", label: "Our Mission" },
  { href: "/about#team", label: "Editorial Team" },
  { href: "/about#faqs", label: "FAQs" },
  { href: "/contact", label: "Contact Us" },
];

const socialLinks = [
  {
    name: "Twitter / X",
    href: "https://twitter.com",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.65 1.65 0 1 0 0-3.3 1.66 1.66 0 0 0 0 3.3m1.4 9.74V9.97H5.06v8.53h2.8z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/tour.research/#",
    icon: (
      <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2 stroke-linecap-round stroke-linejoin-round" viewBox="0 0 24 24">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    href: "https://github.com",
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
];

export function Footer() {
  const pathname = usePathname();
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const hiddenFooterPages = [
    "/dashboard",
    "/researcher",
    "/admin",
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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setEmail("");
    }, 3500);
  };

  return (
    <footer className="relative bg-[#EBF1F5] pt-6 sm:pt-8 pb-0 select-none overflow-hidden">

      {/* 1. TOP INSTITUTIONAL DISCLOSURE BANNER */}
      <div className="container-tour mb-6 sm:mb-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl bg-white/95 border border-navy/15 px-4 sm:px-5 py-3 sm:py-3.5 text-navy shadow-xs backdrop-blur-md">
          <div className="flex min-w-0 flex-col sm:flex-row items-start sm:items-center gap-2.5 sm:gap-3.5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sapphire/10 border border-sapphire/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sapphire shrink-0">
              <HeartHandshake size={13} />
              Nonprofit Status Note
            </span>
            <p className="text-xs sm:text-[13px] text-navy/80 leading-relaxed font-normal">
              Tour is not yet a registered 501(c)(3) organization. However, we are happy to provide verification or confirmation of participation for schools or clubs upon request.
            </p>
          </div>
          <Link
            href="/contact"
            className="text-xs sm:text-[13px] font-semibold text-sapphire hover:text-navy transition-colors underline underline-offset-4 shrink-0 inline-flex items-center gap-1.5"
          >
            <span>Request Verification</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* 2. DYNAMIC CURVY WAVE TOP SECTION (Matches reference image with flowing sapphire ribbon & shadow) */}
      <div className="w-full overflow-hidden leading-none relative z-10 -mb-[1px]">
        <svg
          viewBox="0 0 1440 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-16 sm:h-24 md:h-28 lg:h-36 block select-none"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Primary Sapphire Blue Gradient Ribbon */}
            <linearGradient id="footerCurveBlue" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1E40AF" />
              <stop offset="25%" stopColor="#0284C7" />
              <stop offset="55%" stopColor="#38BDF8" />
              <stop offset="80%" stopColor="#2563EB" />
              <stop offset="100%" stopColor="#0284C7" />
            </linearGradient>

            {/* Subtle Drop Shadow Gradient for Wave Depth */}
            <linearGradient id="footerCurveShadow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0B132B" stopOpacity="0.75" />
              <stop offset="45%" stopColor="#1C2D5A" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#0B132B" stopOpacity="0.8" />
            </linearGradient>

            {/* Glowing Accent Line Gradient along Ribbon Crest */}
            <linearGradient id="footerCurveHighlight" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.3" />
              <stop offset="30%" stopColor="#BAE6FD" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#38BDF8" stopOpacity="1" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Layer A: Drop Shadow Band underneath the Ribbon */}
          <path
            d="M -20 72
               C 140 120, 290 126, 490 98
               C 730 64, 970 28, 1190 24
               C 1300 22, 1390 32, 1460 46
               L 1460 145 L -20 145 Z"
            fill="url(#footerCurveShadow)"
          />

          {/* Layer B: Vibrant Curved Sapphire Ribbon Band (Matches reference image) */}
          <path
            d="M -20 62
               C 140 110, 290 116, 490 88
               C 730 54, 970 18, 1190 14
               C 1300 12, 1390 22, 1460 36
               L 1460 52
               C 1390 38, 1300 28, 1190 30
               C 970 34, 730 70, 490 104
               C 290 132, 140 126, -20 78 Z"
            fill="url(#footerCurveBlue)"
          />

          {/* Layer C: Glowing Crest Stroke along Ribbon */}
          <path
            d="M -20 62
               C 140 110, 290 116, 490 88
               C 730 54, 970 18, 1190 14
               C 1300 12, 1390 22, 1460 36"
            stroke="url(#footerCurveHighlight)"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />

          {/* Layer D: Dark Footer Fill (#070D1E) connecting seamlessly */}
          <path
            d="M -20 74
               C 140 122, 290 128, 490 100
               C 730 66, 970 30, 1190 26
               C 1300 24, 1390 34, 1460 48
               L 1460 145 L -20 145 Z"
            fill="#070D1E"
          />
        </svg>
      </div>

      {/* 3. SPACIOUS FOOTER BODY CONTAINER */}
      <div className="w-full bg-[#070D1E] text-white pt-4 sm:pt-6 pb-16 sm:pb-24 shadow-[0_-20px_50px_rgba(7,13,30,0.25)] relative">

        {/* Ambient subtle sapphire/champagne glow in background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="animate-footer-aurora absolute -top-20 left-1/4 w-[32rem] h-[32rem] rounded-full bg-sapphire/20 blur-[130px]" />
          <div className="animate-footer-aurora absolute -bottom-16 right-1/4 w-[28rem] h-[28rem] rounded-full bg-champagne/10 blur-[120px]" style={{ animationDelay: "-6s" }} />
        </div>

        <div className="container-tour relative z-10 px-4 sm:px-6 lg:px-8">

          {/* 4. NEWSLETTER BANNER (Generous padding, curvy rounded borders) */}
          <div className="mb-12 sm:mb-16">
            <div className="rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#112250] via-[#1A3365] to-[#112250] border border-white/15 py-6 sm:py-8 px-5 sm:px-8 md:px-10 shadow-[0_15px_40px_rgba(7,13,30,0.35)] relative overflow-hidden">
              <div className="absolute top-0 right-0 -mt-10 -mr-10 w-44 h-44 rounded-full bg-sapphire/25 blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-8">
                <div className="max-w-xl space-y-1">
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                    Subscribe to our newsletter
                  </h3>
                  <p className="text-xs sm:text-sm text-white/75 font-light leading-relaxed">
                    Stay inspired by student discoveries, call for papers, and curated research highlights from TOUR.
                  </p>
                </div>

                <div className="w-full lg:max-w-md">
                  {isSubscribed ? (
                    <div className="flex items-center gap-2.5 rounded-full bg-white/15 border border-white/20 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm text-champagne backdrop-blur-md">
                      <CheckCircle2 size={16} className="text-champagne shrink-0" />
                      <span>Thank you for subscribing to TOUR research updates!</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubscribe} className="relative flex items-center rounded-full bg-white p-1.5 shadow-md transition-all focus-within:ring-2 focus-within:ring-sapphire">
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        required
                        aria-label="Enter your email address"
                        className="w-full bg-transparent px-3.5 sm:px-4 py-2 text-xs sm:text-sm text-navy placeholder:text-navy/45 focus:outline-none font-medium"
                      />
                      <button
                        type="submit"
                        className="shrink-0 rounded-full bg-[#112250] hover:bg-sapphire text-white px-4 sm:px-6 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm active:scale-95 cursor-pointer"
                      >
                        Subscribe
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 5. MAIN FOOTER COLUMNS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">

            {/* Left Column: Brand Info (4 cols) */}
            <div className="lg:col-span-4 space-y-3.5">
              <div className="flex items-center gap-2.5">
                <Link href="/" aria-label="TOUR Home" className="flex items-center shrink-0 hover:opacity-90 transition-opacity">
                  <Image
                    src="/logo.png"
                    alt="TOUR"
                    width={110}
                    height={32}
                    className="h-7 sm:h-8 w-auto object-contain brightness-0 invert drop-shadow-[0_2px_8px_rgba(255,255,255,0.2)]"
                  />
                </Link>
                <span className="rounded-full border border-sapphire/30 bg-sapphire/20 px-2.5 py-0.5 text-[10px] font-mono font-semibold text-champagne">
                  Open Research
                </span>
              </div>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-light max-w-sm">
                Tour is an open, student-led academic platform providing young scholars a supportive environment to inquire, research, write, and publish peer-reviewed work.
              </p>
              <p className="text-xs sm:text-sm text-champagne/90 italic font-medium">
                Take a Tour between minds.
              </p>
            </div>

            {/* Right Columns: 4 Nav Columns (8 cols) */}
            <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">

              {/* Column 1: Quick links */}
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wider uppercase">
                  Quick links
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-white/65">
                  {quickLinks.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="hover:text-white transition-colors duration-150 block">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 2: Support */}
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wider uppercase">
                  Support
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-white/65">
                  {contributeLinks.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="hover:text-white transition-colors duration-150 block">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 3: Service */}
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wider uppercase">
                  Service
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-white/65">
                  {policyLinks.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="hover:text-white transition-colors duration-150 block">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column 4: About us */}
              <div className="space-y-3">
                <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wider uppercase">
                  About us
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-white/65">
                  {aboutLinks.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className="hover:text-white transition-colors duration-150 block">
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

          </div>

          {/* 6. BOTTOM ROW: Copyright on Left, Social Pill & Back to Top on Right */}
          <div className="mt-12 sm:mt-16 pt-6 sm:pt-7 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-white/50">
            <p>
              © {new Date().getFullYear()} Tour Research. All rights reserved.
            </p>

            {/* Social Pill Container & Back to Top */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 rounded-full bg-white/[0.08] border border-white/15 px-3.5 py-1.5 backdrop-blur-md">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.name}
                    className="text-white/65 hover:text-white transition-colors duration-150 p-1"
                  >
                    {item.icon}
                  </a>
                ))}
              </div>

              <button
                type="button"
                onClick={scrollToTop}
                aria-label="Scroll back to top"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/[0.08] text-white/70 hover:bg-white hover:text-navy transition cursor-pointer shrink-0"
              >
                <ArrowUp size={13} />
              </button>
            </div>
          </div>

        </div>

      </div>

    </footer>
  );
}
