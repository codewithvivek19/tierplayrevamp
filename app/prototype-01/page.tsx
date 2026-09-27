import type { Metadata } from "next";
import PrototypeExperience from "@/prototype/PrototypeExperience";
export const metadata: Metadata = { title: "Tierplay — Prototype 01", robots: { index: false, follow: false } };
export default function PrototypePage() { return <PrototypeExperience />; }
