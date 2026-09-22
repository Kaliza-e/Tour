"use client";

import React from "react";

export function BackgroundParticles() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Soft, clean, static square grid lines */}
      <div 
        className="absolute inset-0 opacity-30" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(17, 34, 80, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(17, 34, 80, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />
    </div>
  );
}
