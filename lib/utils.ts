import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function readingTime(wordCount: number) {
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return `${minutes} min read`;
}
