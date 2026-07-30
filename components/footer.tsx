import Link from "next/link";
import { TourLogo } from "@/components/tour-logo";

const columns = [
  {
    title: "Platform",
    links: [
      { href: "/questions", label: "Question Hub" },
      { href: "/research", label: "Research Workspace" },
      { href: "/publications", label: "Publications" },
      { href: "/workspace", label: "My Workspace" },
    ],
  },
  {
    title: "Community",
    links: [
      { href: "/community", label: "Community" },
      { href: "/join", label: "Join Tour" },
      { href: "/login", label: "Log In" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "Our Mission" },
      { href: "/questions", label: "Browse Questions" },
      { href: "/publications", label: "Browse Papers" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-navy/10 bg-navy text-ivory">
      <div className="container-tour py-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <TourLogo variant="panel" imageClassName="h-9" />
            <p className="mt-4 max-w-xs text-sm text-ivory/60">
              Where curiosity becomes knowledge. A research ecosystem for the next
              generation of student scientists.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-heading text-sm font-semibold text-ivory/90">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-ivory/60 hover:text-ivory">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col-reverse gap-4 border-t border-ivory/10 pt-8 text-xs text-ivory/50 sm:flex-row sm:items-center sm:justify-between">
          <p>(c) {new Date().getFullYear()} Tour. A student-led nonprofit.</p>
          <p>Every research paper begins with curiosity.</p>
        </div>
      </div>
    </footer>
  );
}
