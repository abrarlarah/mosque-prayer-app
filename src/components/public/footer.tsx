import Link from "next/link";
import { Mail, Phone, MapPin, Clock, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME, APP_DESCRIPTION } from "@/lib/constants";

interface FooterProps {
  className?: string;
}

export default function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Find Mosques", href: "/mosques" },
    { label: "Jummah Timings", href: "/mosques#jummah" },
    { label: "Announcements", href: "/announcements" },
    { label: "Admin Portal", href: "/admin" },
  ];

  return (
    <footer
      className={cn(
        "bg-primary text-primary-foreground selection:bg-accent selection:text-accent-foreground",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 pt-12 pb-8 sm:px-6 lg:px-8">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          {/* About & Branding Section */}
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-primary-foreground transition-opacity hover:opacity-90"
            >
              {/* Islamic Dome / Crescent Emblem */}
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/20 text-accent ring-1 ring-accent/30">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M12 3c-4.97 0-9 4.03-9 9 0 3.31 1.79 6.2 4.47 7.74" />
                  <path d="M12 3a9 9 0 0 1 9 9c0 3.31-1.79 6.2-4.47 7.74" />
                  <path d="M12 3v5" />
                  <circle cx="12" cy="15" r="2" />
                  <path d="M8 21h8" />
                </svg>
              </span>
              <span>
                {APP_NAME}
                <span className="text-accent">.</span>
              </span>
            </Link>

            <p className="text-sm leading-relaxed text-primary-foreground/80">
              {APP_DESCRIPTION}
            </p>

            <div className="inline-flex items-center gap-2 rounded-md bg-primary-foreground/5 px-3 py-1.5 text-xs text-primary-foreground/75 ring-1 ring-primary-foreground/10">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              <span>Real-time Adhan &amp; Jama&apos;at schedules</span>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4 md:pl-4 lg:pl-8">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="group inline-flex items-center gap-1.5 text-primary-foreground/80 transition-colors hover:text-accent"
                  >
                    <span className="h-1 w-1 rounded-full bg-accent/50 transition-all group-hover:w-2 group-hover:bg-accent" />
                    <span>{link.label}</span>
                    {link.href.startsWith("/admin") && (
                      <ExternalLink className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
              Contact &amp; Support
            </h3>
            <ul className="space-y-3 text-sm text-primary-foreground/80">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span>Centralized timings for community mosques across the region</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-accent" />
                <a
                  href="mailto:support@salahtimes.com"
                  className="transition-colors hover:text-accent"
                >
                  support@salahtimes.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-accent" />
                <a
                  href="tel:+18005557729"
                  className="transition-colors hover:text-accent"
                >
                  +1 (800) 555-PRAY (7729)
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-4 w-4 shrink-0 text-accent" />
                <span>Synchronized daily with mosque management</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Islamic Separator Decoration */}
        <div className="relative my-8 flex items-center justify-center">
          <div className="h-px w-full bg-primary-foreground/15" />
          <div className="absolute flex items-center justify-center gap-2.5 bg-primary px-4 text-accent">
            <span className="h-1 w-1 rotate-45 bg-accent/60" />
            <span className="h-1.5 w-1.5 rotate-45 bg-accent/80" />
            {/* Islamic 8-pointed star (Rub el Hizb) */}
            <svg
              className="h-5 w-5 text-accent"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="5" y="5" width="14" height="14" rx="1" />
              <rect
                x="5"
                y="5"
                width="14"
                height="14"
                rx="1"
                transform="rotate(45 12 12)"
              />
              <circle cx="12" cy="12" r="1.5" fill="currentColor" />
            </svg>
            <span className="h-1.5 w-1.5 rotate-45 bg-accent/80" />
            <span className="h-1 w-1 rotate-45 bg-accent/60" />
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="flex flex-col items-center justify-between gap-4 text-center text-xs text-primary-foreground/70 sm:flex-row sm:text-left">
          <p>© {currentYear} {APP_NAME}. All rights reserved.</p>
          <div className="flex items-center gap-4 text-primary-foreground/60">
            <span>Daily Prayers &amp; Jummah Schedule</span>
            <span className="text-accent/50">•</span>
            <span>Serving the Community</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
