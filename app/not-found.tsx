import type { Metadata } from "next";
import { Button, Badge } from "@/components/ds/primitives";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return <main id="main" className="ds-page ds-404">
    <div className="ds-404__glow" aria-hidden="true" />
    <div className="ds-container ds-404__copy">
      <Badge>404</Badge>
      <h1>This world doesn’t exist yet.</h1>
      <p>The page you’re looking for has moved or was never here.</p>
      <div className="ds-actions ds-actions--center">
        <Button href="/">Back to home</Button>
        <Button href="/games" variant="ghost">Explore games</Button>
        <Button href="/contact-sales" variant="ghost">Contact sales</Button>
      </div>
    </div>
  </main>;
}
