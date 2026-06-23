"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

export function AmbientGradient() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        backgroundPosition: "100% 50%",
        duration: 18,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed inset-0 -z-10 opacity-70"
      style={{
        background:
          "linear-gradient(115deg, rgba(34,211,238,0.14), rgba(245,158,11,0.08), rgba(251,113,133,0.12), rgba(52,211,153,0.10))",
        backgroundSize: "240% 240%"
      }}
      aria-hidden
    />
  );
}
