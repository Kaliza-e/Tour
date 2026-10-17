"use client";

import React, { useState } from "react";
import Image from "next/image";

export function BackgroundParticles() {
  const [loadError, setLoadError] = useState(false);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none" aria-hidden="true">
      {/* 1. Soft, clean, static square grid lines */}
      <div 
        className="absolute inset-0 opacity-25" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(17, 34, 80, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(17, 34, 80, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

      {/* 2. Delicate ambient warmth nodes matching the lightbulb filaments & rays */}
      <div className="absolute -top-16 right-1/4 h-80 w-80 rounded-full bg-amber-200/15 blur-[120px]" />
      <div className="absolute top-[35%] -left-16 h-[26rem] w-[26rem] rounded-full bg-sky-200/20 blur-[130px]" />
      <div className="absolute bottom-[28%] -right-16 h-80 w-80 rounded-full bg-rose-200/15 blur-[110px]" />
      <div className="absolute -bottom-10 left-1/4 h-72 w-72 rounded-full bg-amber-100/15 blur-[100px]" />

      {!loadError && (
        <>
          {/* 3. Subtle ambient hanging lightbulbs for top-right background whitespace */}
          <div 
            className="absolute -top-6 right-0 w-[380px] sm:w-[520px] md:w-[680px] lg:w-[820px] h-[440px] sm:h-[500px] opacity-[0.14] sm:opacity-[0.16] lg:opacity-[0.18]"
            style={{
              WebkitMaskImage: "radial-gradient(ellipse 80% 75% at 85% 20%, black 25%, rgba(0,0,0,0.65) 45%, transparent 75%)",
              maskImage: "radial-gradient(ellipse 80% 75% at 85% 20%, black 25%, rgba(0,0,0,0.65) 45%, transparent 75%)",
            }}
          >
            <Image
              src="/pastel-lightbulb-bg.jpg"
              alt=""
              fill
              sizes="(max-width: 640px) 380px, (max-width: 1024px) 680px, 820px"
              className="object-contain object-right-top"
              onError={() => setLoadError(true)}
            />
          </div>

          {/* 4. Mid-page left subtle mirrored hanging lightbulbs for left-margin whitespace */}
          <div 
            className="absolute top-[38%] -left-12 sm:-left-8 w-[320px] sm:w-[440px] md:w-[560px] lg:w-[680px] h-[380px] sm:h-[440px] opacity-[0.10] sm:opacity-[0.12] lg:opacity-[0.15] -scale-x-100"
            style={{
              WebkitMaskImage: "radial-gradient(ellipse 80% 75% at 85% 25%, black 20%, rgba(0,0,0,0.55) 45%, transparent 75%)",
              maskImage: "radial-gradient(ellipse 80% 75% at 85% 25%, black 20%, rgba(0,0,0,0.55) 45%, transparent 75%)",
            }}
          >
            <Image
              src="/pastel-lightbulb-bg.jpg"
              alt=""
              fill
              sizes="(max-width: 640px) 320px, (max-width: 1024px) 560px, 680px"
              className="object-contain object-right-top"
              onError={() => setLoadError(true)}
            />
          </div>

          {/* 5. Lower-page right subtle ambient lightbulb watermark for bottom whitespace */}
          <div 
            className="absolute bottom-10 -right-12 sm:-right-8 w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] h-[360px] sm:h-[420px] opacity-[0.09] sm:opacity-[0.11] lg:opacity-[0.13]"
            style={{
              WebkitMaskImage: "radial-gradient(ellipse 75% 70% at 82% 35%, black 20%, rgba(0,0,0,0.5) 40%, transparent 70%)",
              maskImage: "radial-gradient(ellipse 75% 70% at 82% 35%, black 20%, rgba(0,0,0,0.5) 40%, transparent 70%)",
            }}
          >
            <Image
              src="/pastel-lightbulb-bg.jpg"
              alt=""
              fill
              sizes="(max-width: 640px) 300px, (max-width: 1024px) 500px, 600px"
              className="object-contain object-right-top"
              onError={() => setLoadError(true)}
            />
          </div>
        </>
      )}
    </div>
  );
}
