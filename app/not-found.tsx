import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="rounded-full bg-navy/10 p-4 w-fit mx-auto">
          <svg className="h-12 w-12 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="font-heading text-2xl font-semibold text-navy">404</h2>
        <p className="text-navy/60 text-lg">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/" className="inline-flex h-12 items-center justify-center gap-2 rounded-pill bg-navy px-7 font-heading text-[15px] font-semibold text-ivory transition-colors hover:bg-sapphire">
            <Home className="h-4 w-4" /> Back to Home
          </Link>
          <Link href="/research" className="inline-flex h-12 items-center justify-center gap-2 rounded-pill border border-navy/20 px-7 font-heading text-[15px] font-semibold text-navy transition-colors hover:border-navy hover:bg-white">
            <Search className="h-4 w-4" /> Explore Research
          </Link>
        </div>
      </div>
    </div>
  );
}