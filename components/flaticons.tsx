"use client";

import React from "react";

export interface FlaticonProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

// 1. Rocket (Doodle / Flat outline)
export function FlaticonRocket({ size = 24, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M32 6C42 6 52 14 54 28C54 36 48 46 38 52L32 58L26 52C16 46 10 36 10 28C12 14 22 6 32 6Z" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="32" cy="26" r="6" stroke="currentColor" strokeWidth="3.5" />
      <path d="M14 36C8 40 4 48 6 56C14 58 22 54 26 48" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M50 36C56 40 60 48 58 56C50 58 42 54 38 48" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 2. Star Sparkle (✦)
export function FlaticonStar({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}

// 3. Sparkles Multi
export function FlaticonSparkles({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M10 0L12 6L18 8L12 10L10 16L8 10L2 8L8 6L10 0Z" />
      <path d="M19 12L20.2 15.8L24 17L20.2 18.2L19 22L17.8 18.2L14 17L17.8 15.8L19 12Z" />
    </svg>
  );
}

// 4. Plus (+)
export function FlaticonPlus({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <line x1="12" y1="4" x2="12" y2="20" />
      <line x1="4" y1="12" x2="20" y2="12" />
    </svg>
  );
}

// 5. Book / Publication
export function FlaticonBook({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M6.5 2H20V22H6.5C5.83696 22 5.20107 21.7366 4.73223 21.2678C4.26339 20.7989 4 20.163 4 19.5V4.5C4 3.83696 4.26339 3.20107 4.73223 2.73223C5.20107 2.26339 5.83696 2 6.5 2Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// 6. Graduation Cap
export function FlaticonGraduation({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M22 10L12 5L2 10L12 15L22 10Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M6 12.5V17C6 17 8.5 19 12 19C15.5 19 18 17 18 17V12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M22 10V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 7. Search
export function FlaticonSearch({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <circle cx="11" cy="11" r="7" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 8. Idea / Lightbulb
export function FlaticonIdea({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M12 2C8.13401 2 5 5.13401 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13401 15.866 2 12 2Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      <path d="M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 9. Mail
export function FlaticonMail({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="3" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 10. Arrow Right
export function FlaticonArrowRight({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M5 12H19M19 12L13 6M19 12L13 18" />
    </svg>
  );
}

// 11. Arrow Left
export function FlaticonArrowLeft({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M19 12H5M5 12L11 6M5 12L11 18" />
    </svg>
  );
}

// 12. Arrow Up
export function FlaticonArrowUp({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M12 19V5M12 5L6 11M12 5L18 11" />
    </svg>
  );
}

// 13. Users
export function FlaticonUsers({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="9" cy="7" r="4" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      <path d="M23 21V19C22.9986 17.1771 21.765 15.5857 20 15.13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 3.13C17.7699 3.58317 19.0078 5.1806 19.0078 7.005C19.0078 8.8294 17.7699 10.4268 16 10.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 14. User
export function FlaticonUser({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="7" r="4" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// 15. Heart
export function FlaticonHeart({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M20.84 4.61C20.3292 4.099 19.7228 3.69364 19.0554 3.41708C18.3879 3.14052 17.6725 2.99817 16.95 2.99817C16.2275 2.99817 15.5121 3.14052 14.8446 3.41708C14.1772 3.69364 13.5708 4.099 13.06 4.61L12 5.67L10.94 4.61C9.9083 3.5783 8.50903 2.9987 7.05 2.9987C5.59097 2.9987 4.1917 3.5783 3.16 4.61C2.1283 5.6417 1.5487 7.04097 1.5487 8.5C1.5487 9.95903 2.1283 11.3583 3.16 12.39L12 21.23L20.84 12.39C21.351 11.8792 21.7564 11.2728 22.0329 10.6053C22.3095 9.93789 22.4518 9.22248 22.4518 8.5C22.4518 7.77752 22.3095 7.06211 22.0329 6.39467C21.7564 5.72723 21.351 5.1208 20.84 4.61Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 16. Heart Handshake
export function FlaticonHeartHandshake({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M19 14C20.5 12.5 21 10.5 20.5 8.5C19.5 5 15.5 4 13 6.5L12 7.5L11 6.5C8.5 4 4.5 5 3.5 8.5C3 10.5 3.5 12.5 5 14L12 21L19 14Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 17. Eye
export function FlaticonEye({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// 18. Shield / Check
export function FlaticonShield({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function FlaticonShieldCheck({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 19. Send
export function FlaticonSend({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 20. Check Circle
export function FlaticonCheckCircle({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// 21. Briefcase
export function FlaticonBriefcase({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="2" y="7" width="20" height="14" rx="2" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      <path d="M16 7V5C16 3.89543 15.1046 3 14 3H10C8.89543 3 8 3.89543 8 5V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 22. Flask / Science
export function FlaticonFlask({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M10 2V6L4.5 16.5C3.8 17.8 4.7 19.5 6.2 19.5H17.8C19.3 19.5 20.2 17.8 19.5 16.5L14 6V2H10Z" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M8.5 2H15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M7 13H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// 23. Dashboard / Layout
export function FlaticonDashboard({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <rect x="3" y="3" width="7" height="9" rx="1.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="3" width="7" height="5" rx="1.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      <rect x="14" y="12" width="7" height="9" rx="1.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
      <rect x="3" y="16" width="7" height="5" rx="1.5" fill="currentColor" fillOpacity="0.15" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

// 24. Settings
export function FlaticonSettings({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <circle cx="12" cy="12" r="3" fill="currentColor" stroke="currentColor" strokeWidth="2" />
      <path d="M19.4 15A1.65 1.65 0 0 0 20 12A1.65 1.65 0 0 0 19.4 9L21 7.4L19 4L16.8 5C16.1 4.5 15.4 4.1 14.6 3.9L14.2 1.5H9.8L9.4 3.9C8.6 4.1 7.9 4.5 7.2 5L5 4L3 7.4L4.6 9A1.65 1.65 0 0 0 4 12A1.65 1.65 0 0 0 4.6 15L3 16.6L5 20L7.2 19C7.9 19.5 8.6 19.9 9.4 20.1L9.8 22.5H14.2L14.6 20.1C15.4 19.9 16.1 19.5 16.8 19L19 20L21 16.6L19.4 15Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

// 25. Chevron Down / Up
export function FlaticonChevronDown({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M6 9L12 15L18 9" />
    </svg>
  );
}

export function FlaticonChevronUp({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M18 15L12 9L6 15" />
    </svg>
  );
}

// 26. Menu (Hamburger) / Close (X)
export function FlaticonMenu({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

export function FlaticonClose({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// 27. Social Media Icons
export function FlaticonTwitter({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function FlaticonLinkedin({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.75a1.45 1.45 0 1 0 1.45 1.45A1.45 1.45 0 0 0 7.86 6.75Z" />
    </svg>
  );
}

export function FlaticonGithub({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

export function FlaticonInstagram({ size = 20, className = "", ...props }: FlaticonProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className} {...props}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2c2.717 0 3.056.01 4.122.06 1.065.048 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 011.153 1.772c.247.637.416 1.363.465 2.428.048 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.048 1.065-.217 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772 4.915 4.915 0 01-1.772 1.153c-.637.247-1.363.416-2.428.465-1.066.048-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.048-1.79-.217-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.247-.637-.416-1.363-.465-2.428C2.01 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.048-1.065.217-1.79.465-2.428a4.88 4.88 0 011.153-1.772A4.897 4.897 0 015.45 2.525c.638-.248 1.362-.417 2.428-.465C8.944 2.01 9.283 2 12 2zm0 1.802c-2.67 0-2.987.01-4.042.059-.976.045-1.505.207-1.858.344-.466.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.373-.058 4.041 0 2.669.01 2.987.058 4.042.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.684.566 1.15.748.353.137.882.3 1.857.344 1.055.048 1.373.058 4.042.058 2.669 0 2.986-.01 4.041-.058.975-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.373.058-4.041 0-2.669-.01-2.987-.058-4.042-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.054-.048-1.372-.058-4.041-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
    </svg>
  );
}
