import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Salah Times — Jamia Bilal Masjid",
    short_name: "Salah Times",
    description: "Official live prayer times, Adhan & Jamaat schedule for Jamia Bilal Masjid & Kashmir Mosques.",
    start_url: "/",
    display: "standalone",
    background_color: "#071712",
    theme_color: "#0a382c",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
