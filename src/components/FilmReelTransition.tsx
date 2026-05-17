"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FilmReelTransitionProps {
  position: "top" | "bottom";
}

export default function FilmReelTransition({ position }: FilmReelTransitionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const strip = stripRef.current;
    if (!container || !strip) return;

    // Direction based on position prop
    const fromX = position === "top" ? "80vw" : "-80vw";
    const toX = position === "top" ? "-80vw" : "80vw";
    const fromY = position === "top" ? "60vh" : "-60vh";
    const toY = position === "top" ? "-60vh" : "60vh";

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top bottom",
        end: "bottom top",
        scrub: 1.2,
      },
    });

    tl.fromTo(
      strip,
      {
        x: fromX,
        y: fromY,
        rotateZ: -25,
        rotateY: 8,
        opacity: 0.9,
      },
      {
        x: toX,
        y: toY,
        rotateZ: -25,
        rotateY: 8,
        opacity: 0.3,
        ease: "none",
      }
    );

    // Animate sprocket holes wobble
    const sprockets = container.querySelectorAll(".sprocket-hole");
    sprockets.forEach((hole, i) => {
      gsap.to(hole, {
        scaleY: 0.85,
        scaleX: 1.1,
        duration: 0.4 + i * 0.05,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.08,
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.trigger === container) st.kill();
      });
      gsap.killTweensOf(sprockets);
    };
  }, [position]);

  // Generate sprocket holes for both sides
  const sprocketCount = 12;
  const sprockets = Array.from({ length: sprocketCount }, (_, i) => i);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-40 overflow-hidden pointer-events-none z-10"
      style={{ perspective: "1200px" }}
    >
      {/* Film strip */}
      <div
        ref={stripRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "200vw",
          height: "120px",
          transformStyle: "preserve-3d",
        }}
      >
        {/* Film strip body */}
        <div className="relative w-full h-full bg-mega-dark/85 border-y-2 border-mega-charcoal/60 shadow-2xl">
          {/* Film grain overlay */}
          <div
            className="absolute inset-0 opacity-30 mix-blend-overlay"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)' opacity='0.4'/%3E%3C/svg%3E")`,
              backgroundSize: "150px 150px",
            }}
          />

          {/* Vignette edges */}
          <div
            className="absolute inset-0"
            style={{
              boxShadow: "inset 0 0 40px 15px rgba(0,0,0,0.7)",
            }}
          />

          {/* Top sprocket holes */}
          <div className="absolute top-1.5 left-0 w-full flex justify-around px-8">
            {sprockets.map((i) => (
              <div
                key={`top-${i}`}
                className="sprocket-hole w-[15px] h-[20px] rounded-sm bg-transparent border-2 border-mega-charcoal/50"
                style={{
                  boxShadow: "inset 0 0 4px rgba(0,0,0,0.8)",
                  background: "rgba(0,0,0,0.6)",
                }}
              />
            ))}
          </div>

          {/* Bottom sprocket holes */}
          <div className="absolute bottom-1.5 left-0 w-full flex justify-around px-8">
            {sprockets.map((i) => (
              <div
                key={`bottom-${i}`}
                className="sprocket-hole w-[15px] h-[20px] rounded-sm bg-transparent border-2 border-mega-charcoal/50"
                style={{
                  boxShadow: "inset 0 0 4px rgba(0,0,0,0.8)",
                  background: "rgba(0,0,0,0.6)",
                }}
              />
            ))}
          </div>

          {/* Film frames (content area between sprockets) */}
          <div className="absolute top-[28px] bottom-[28px] left-8 right-8 flex gap-2">
            {Array.from({ length: 8 }, (_, i) => (
              <div
                key={`frame-${i}`}
                className="flex-1 border border-mega-charcoal/30 rounded-xs bg-mega-dark/40"
              />
            ))}
          </div>

          {/* Subtle red accent line (Megarama branding) */}
          <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-mega-red/40 to-transparent" />
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-mega-red/40 to-transparent" />
        </div>
      </div>
    </div>
  );
}
