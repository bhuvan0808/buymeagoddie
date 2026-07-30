"use client";

import { useEffect, useState } from "react";
import { ReactLenis } from "lenis/react";

/**
 * Lenis smooth scrolling for marketing surfaces. Disabled automatically for
 * users who prefer reduced motion.
 */
export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(query.matches);
    const onChange = (event: MediaQueryListEvent) =>
      setReducedMotion(event.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  if (reducedMotion) return <>{children}</>;

  return (
    <ReactLenis root options={{ lerp: 0.12, duration: 1.2 }}>
      {children}
    </ReactLenis>
  );
}
