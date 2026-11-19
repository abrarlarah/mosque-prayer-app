import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-background py-6 text-center text-xs text-muted-foreground">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>
          © {currentYear} {APP_NAME} — Jamia Bilal Masjid, Sherwani Colony, Khawajabagh, Baramulla.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/mosques" className="hover:text-foreground transition-colors">
            All Mosques
          </Link>
          <span>•</span>
          <Link href="/login" className="hover:text-primary transition-colors font-semibold">
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
