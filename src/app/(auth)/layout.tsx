import React from "react";
import Link from "next/link";
import { Mosque, ArrowLeft } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/40 flex flex-col justify-between p-4 sm:p-6 md:p-8">
      {/* Top Bar with back link */}
      <header className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
          <Mosque className="w-5 h-5" />
          <span>{APP_NAME}</span>
        </Link>
      </header>

      {/* Main Form Center */}
      <main className="my-auto py-10 flex items-center justify-center">
        {children}
      </main>

      {/* Footer info */}
      <footer className="text-center text-xs text-muted-foreground py-4">
        &copy; {new Date().getFullYear()} {APP_NAME}. Protected Administrative Portal.
      </footer>
    </div>
  );
}
