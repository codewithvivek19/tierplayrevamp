import type { Metadata } from "next";
import DesignSystem from "@/prototype/DesignSystem";
export const metadata: Metadata = { title: "Tierplay — Interface system", robots: { index: false, follow: false } };
export default function DesignSystemPage() { return <DesignSystem />; }
