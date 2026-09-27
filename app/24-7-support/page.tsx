import type { Metadata } from "next";
import UtilityPage from "@/components/site/UtilityPage";
export const metadata: Metadata = { title: "24/7 Support" };
export default function SupportPage() { return <UtilityPage eyebrow="Support" title="24/7 support." intro="A preserved Tierplay service route awaiting confirmed operational contact details." note="Support without the guesswork." actionLabel="Contact Tierplay" />; }
