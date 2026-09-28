import type { Metadata } from "next";
import "./globals.css";
import "./battlez.css";
import "./brain-theme.css";
import "./content-experience.css";
import "./editorial-refinement.css";
import "./tierplay-preloader.css";
import SiteChrome from "@/components/site/SiteChrome";
export const metadata: Metadata = {
  title: { default: "Tierplay — The next tier of play", template: "%s — Tierplay" },
  description:
    "Games, cabinets and connected technology. Enter the Tierplay ecosystem.",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/fonts/inter-regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
