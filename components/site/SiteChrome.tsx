"use client";

import { ViewTransition } from "react";
import { usePathname } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import TierplayPreloader from "@/components/site/TierplayPreloader";
import ScrollRefresh from "@/components/motion/ScrollRefresh";
import SmoothScroll from "@/components/motion/SmoothScroll";
import TierplayGuide from "@/components/site/TierplayGuide";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudy = pathname === "/prototype-01" || pathname === "/design-system";
  if (isStudy) return children;
  // Keyed by route: navigations (React transitions) play the page exit and enter in app/ds/motion.css,
  // while the header, footer and guide stay put.
  return <>
    <TierplayPreloader /><SmoothScroll /><ScrollRefresh /><SiteHeader />
    <ViewTransition key={pathname} enter="page-enter" exit="page-exit" default="none">
      <div className="page-shell">{children}</div>
    </ViewTransition>
    <SiteFooter /><TierplayGuide />
  </>;
}
