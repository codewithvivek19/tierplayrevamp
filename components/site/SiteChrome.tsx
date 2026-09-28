"use client";

import { usePathname } from "next/navigation";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import TierplayPreloader from "@/components/site/TierplayPreloader";

export default function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudy = pathname === "/prototype-01" || pathname === "/design-system";
  if (isStudy) return children;
  return <><TierplayPreloader /><SiteHeader />{children}<SiteFooter /></>;
}
