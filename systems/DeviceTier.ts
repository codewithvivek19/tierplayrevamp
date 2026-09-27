"use client";
import { useEffect, useState } from "react";
type Connection = { saveData?: boolean };
export function useDeviceTier() {
  const [policy, setPolicy] = useState({
    reduced: true,
    tier: "low" as "low" | "medium" | "high",
    dpr: 1,
  });
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const small = matchMedia("(max-width: 767px)");
    const update = () => {
      const nav = navigator as Navigator & {
        deviceMemory?: number;
        connection?: Connection;
      };
      const low =
        motion.matches ||
        !!nav.connection?.saveData ||
        (nav.deviceMemory !== undefined && nav.deviceMemory <= 2);
      setPolicy({
        reduced: motion.matches,
        tier: low ? "low" : small.matches ? "medium" : "high",
        dpr: low ? 1 : small.matches ? 1.25 : 1.75,
      });
    };
    update();
    motion.addEventListener("change", update);
    small.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      small.removeEventListener("change", update);
    };
  }, []);
  return policy;
}
