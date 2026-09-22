"use client";

import { useId } from "react";

interface ScallopedDividerProps {
  className?: string;
  direction?: "down" | "up";
  height?: number;
  strokeWidth?: number;
  variant?: "line" | "fill";
  fillColor?: string;
}

export function ScallopedDivider({
  className = "",
  direction = "down",
  height = 14,
  strokeWidth = 1.5,
  variant = "line",
  fillColor = "currentColor",
}: ScallopedDividerProps) {
  const rawId = useId();
  const patternId = `scallop-pattern-${rawId.replace(/:/g, "")}`;

  // Tile dimensions: 24px wide per scallop pair (12px per scallop)
  const tileWidth = 24;
  const radius = tileWidth / 4; // 6px radius for 12px wide scallop arc
  const yBase = direction === "down" ? strokeWidth + 1 : height - strokeWidth - 1;

  // Semicircle scallop arc path
  // Sweep flag: 0 for down, 1 for up
  const sweep = direction === "down" ? 0 : 1;

  const pathD = `M 0 ${yBase} A ${radius} ${radius} 0 0 ${sweep} ${tileWidth / 2} ${yBase} A ${radius} ${radius} 0 0 ${sweep} ${tileWidth} ${yBase}`;

  if (variant === "fill") {
    // Fill variant creates a continuous solid scalloped edge transition
    const fillPathD = direction === "down" 
      ? `M 0 0 L 0 ${yBase} A ${radius} ${radius} 0 0 0 ${tileWidth / 2} ${yBase} A ${radius} ${radius} 0 0 0 ${tileWidth} ${yBase} L ${tileWidth} 0 Z`
      : `M 0 ${height} L 0 ${yBase} A ${radius} ${radius} 0 0 1 ${tileWidth / 2} ${yBase} A ${radius} ${radius} 0 0 1 ${tileWidth} ${yBase} L ${tileWidth} ${height} Z`;

    return (
      <div className={`w-full overflow-hidden leading-none select-none ${className}`} aria-hidden="true">
        <svg
          className="w-full block"
          style={{ height: `${height}px` }}
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id={patternId}
              x="0"
              y="0"
              width={tileWidth}
              height={height}
              patternUnits="userSpaceOnUse"
            >
              <path d={fillPathD} fill={fillColor} />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#${patternId})`} />
        </svg>
      </div>
    );
  }

  return (
    <div className={`w-full overflow-hidden leading-none select-none ${className}`} aria-hidden="true">
      <svg
        className="w-full block"
        style={{ height: `${height}px` }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id={patternId}
            x="0"
            y="0"
            width={tileWidth}
            height={height}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={pathD}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
    </div>
  );
}
