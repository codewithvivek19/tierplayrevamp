import type { Metadata } from "next";
import "./ds/tokens.css";
import "./ds/base.css";
import "./ds/components.css";
import "./ds/interactive.css";
import "./ds/showroom.css";
import "./ds/cabinets.css";
import "./ds/lineup.css";
import "./ds/systems.css";
import "./ds/pages.css";
import "./ds/guide.css";
import "./tierplay-preloader.css";
import localFont from "next/font/local";
import SiteChrome from "@/components/site/SiteChrome";

// Inter 4 variable with the optical-size axis: text cuts at body sizes, Display cuts at headline sizes.
const inter = localFont({ src: "./fonts/InterVariable.woff2", weight: "100 900", variable: "--font-inter", display: "swap", preload: true });
export const metadata: Metadata = {
  title: { default: "Tierplay — Play beyond the screen", template: "%s — Tierplay" },
  description: "Sunscape games, Altitude and Pinnacle cabinets, and connected systems for the gaming floor.",
  applicationName: "Tierplay",
  robots: { index: false, follow: false },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
