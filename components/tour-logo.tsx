import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type TourLogoProps = {
  className?: string;
  imageClassName?: string;
  href?: string;
  priority?: boolean;
  variant?: "plain" | "panel";
};

export function TourLogo({
  className,
  imageClassName,
  href = "/",
  priority = false,
  variant = "plain",
}: TourLogoProps) {
  const logo = (
    <span
      className={cn(
        "inline-flex items-center justify-center leading-none",
        variant === "panel" && "rounded-md bg-white px-3 py-2 shadow-card",
        className
      )}
    >
      <Image
        src="/logo.png"
        alt="Tour"
        width={156}
        height={50}
        priority={priority}
        className={cn("h-10 w-auto object-contain", imageClassName)}
      />
    </span>
  );

  if (!href) {
    return logo;
  }

  return (
    <Link href={href} aria-label="Tour home" className="inline-flex items-center">
      {logo}
    </Link>
  );
}
