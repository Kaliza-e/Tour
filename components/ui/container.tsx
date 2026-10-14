import React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  as?: React.ElementType;
}

/**
 * Standardized Site Container
 * Centers itself, max-w-6xl (72rem / 1152px), with responsive padding (px-4 sm:px-6 lg:px-8).
 * Ensures identical left and right alignment across the navbar, every page section, and the footer.
 */
export function Container({
  children,
  className,
  as: Component = "div",
  ...props
}: ContainerProps) {
  return (
    <Component
      className={cn("container-tour", className)}
      {...props}
    >
      {children}
    </Component>
  );
}
