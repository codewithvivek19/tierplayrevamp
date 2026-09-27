import type { Metadata } from "next";
import UtilityPage from "@/components/site/UtilityPage";
export const metadata: Metadata = { title: "Up to Date" };
export default function UpdatePage() { return <UtilityPage eyebrow="Up to date" title="The latest from Tierplay." intro="This published route currently has no verified article body in the recovered source." note="News and updates are being prepared." />; }
