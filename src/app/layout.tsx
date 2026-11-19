import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0a382c",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Salah Times — Prayer Times for Mosques Near You",
    template: "%s | Salah Times",
  },
  description:
    "Find accurate prayer times for mosques near you. View daily prayer schedules, Jummah timings, and announcements from multiple mosques.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Salah Times",
  },
  keywords: [
    "prayer times",
    "salah times",
    "mosque prayer schedule",
    "namaz timing",
    "jummah",
    "islamic prayer",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
