"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface PastelLightbulbAccentProps {
  className?: string;
  variant?: "hero" | "compact" | "wide";
  opacity?: string;
}

export function PastelLightbulbAccent({
  className,
  variant = "hero",
  opacity = "opacity-40 sm:opacity-80 md:opacity-90",
}: PastelLightbulbAccentProps) {
  const [hasError, setHasError] = useState(false);

  // Variant dimension presets - oversized visual anchored to the right
  const variantStyles = {
    hero: "w-[280px] sm:w-[440px] md:w-[580px] lg:w-[720px] xl:w-[820px] h-[300px] sm:h-[420px] md:h-[500px] lg:h-[560px]",
    compact: "w-[240px] sm:w-[360px] md:w-[460px] h-[260px] sm:h-[360px] md:h-[420px]",
    wide: "w-full max-w-[860px] h-[320px] sm:h-[440px] md:h-[520px]",
  };

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none select-none absolute right-0 top-0 -z-0 overflow-hidden",
        variantStyles[variant],
        opacity,
        className
      )}
    >
      {!hasError ? (
        <div
          className="relative h-full w-full"
          style={{
            WebkitMaskImage:
              "radial-gradient(ellipse 85% 80% at 85% 20%, black 25%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.3) 65%, transparent 80%)",
            maskImage:
              "radial-gradient(ellipse 85% 80% at 85% 20%, black 25%, rgba(0,0,0,0.85) 45%, rgba(0,0,0,0.3) 65%, transparent 80%)",
          }}
        >
          <Image
            src="/pastel-lightbulb-bg.jpg"
            alt=""
            fill
            sizes="(max-width: 640px) 280px, (max-width: 1024px) 580px, 820px"
            className="object-contain object-right-top transition-opacity duration-700"
            priority={variant === "hero"}
            onError={() => setHasError(true)}
          />
        </div>
      ) : (
        /* Graceful fallback: ambient glowing radiant pastel orb if image fails to load */
        <div className="relative h-full w-full">
          <div className="absolute -top-10 right-10 h-72 w-72 rounded-full bg-gradient-to-br from-amber-200/30 via-rose-200/25 to-sky-200/25 blur-3xl" />
          <div className="absolute top-16 right-20 h-48 w-48 rounded-full bg-sapphire/15 blur-2xl" />
        </div>
      )}
    </div>
  );
}
