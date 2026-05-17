"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import useReducedPerformance from "@/hooks/useReducedPerformance";

export default function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const trailRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const isHoveringRef = useRef(false);
  const mousePos = useRef({ x: -100, y: -100 });
  const isVisible = useRef(false);
  const { isLowEnd } = useReducedPerformance();
  const trailCount = isLowEnd ? 1 : 4;
  const trailIndices = useMemo(
    () => Array.from({ length: trailCount }, (_, i) => i),
    [trailCount]
  );

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const outer = outerRef.current;
    const dot = dotRef.current;
    const trails = trailRefs.current.filter(Boolean) as HTMLDivElement[];
    const textEl = textRef.current;
    if (!outer || !dot || !textEl) return;

    // GSAP quickSetter for performance
    const setOuterX = gsap.quickSetter(outer, "x", "px");
    const setOuterY = gsap.quickSetter(outer, "y", "px");
    const setDotX = gsap.quickSetter(dot, "x", "px");
    const setDotY = gsap.quickSetter(dot, "y", "px");

    const trailSetters = trails.map((trail) => ({
      x: gsap.quickSetter(trail, "x", "px"),
      y: gsap.quickSetter(trail, "y", "px"),
    }));

    // Trail positions with delay
    const trailPositions = trails.map(() => ({ x: -100, y: -100 }));

    const onMouseMove = (e: MouseEvent) => {
      mousePos.current.x = e.clientX;
      mousePos.current.y = e.clientY;

      if (!isVisible.current) {
        isVisible.current = true;
        gsap.to(outer, { opacity: 1, duration: 0.3 });
        gsap.to(dot, { opacity: 1, duration: 0.3 });
        trails.forEach((trail) => {
          gsap.to(trail, { opacity: 1, duration: 0.3 });
        });
      }
    };

    const onMouseLeave = () => {
      isVisible.current = false;
      gsap.to(outer, { opacity: 0, duration: 0.3 });
      gsap.to(dot, { opacity: 0, duration: 0.3 });
      trails.forEach((trail) => {
        gsap.to(trail, { opacity: 0, duration: 0.3 });
      });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor]") ||
        target.dataset.cursor;

      if (isInteractive) {
        isHoveringRef.current = true;
        const cursorText =
          target.dataset.cursor ||
          target.closest("[data-cursor]")?.getAttribute("data-cursor") ||
          "";

        gsap.to(outer, {
          width: 80,
          height: 80,
          borderColor: "rgba(227, 24, 55, 0.6)",
          backgroundColor: "rgba(227, 24, 55, 0.08)",
          duration: 0.4,
          ease: "power3.out",
        });

        gsap.to(dot, {
          scale: 0.5,
          opacity: 0.5,
          duration: 0.3,
          ease: "power2.out",
        });

        if (cursorText) {
          textEl.textContent = cursorText;
          gsap.to(textEl, { opacity: 1, scale: 1, duration: 0.3 });
        } else {
          const label =
            target.tagName === "A" || target.closest("a") ? "View" : "Click";
          textEl.textContent = label;
          gsap.to(textEl, { opacity: 1, scale: 1, duration: 0.3 });
        }
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.closest("a") ||
        target.closest("button") ||
        target.closest("[data-cursor]") ||
        target.dataset.cursor;

      if (isInteractive) {
        isHoveringRef.current = false;
        gsap.to(outer, {
          width: 40,
          height: 40,
          borderColor: "#e31837",
          backgroundColor: "transparent",
          duration: 0.4,
          ease: "power3.out",
        });

        gsap.to(dot, {
          scale: 1,
          opacity: 1,
          duration: 0.3,
          ease: "power2.out",
        });

        gsap.to(textEl, { opacity: 0, scale: 0.5, duration: 0.2 });
      }
    };

    // Animation loop using GSAP ticker for smooth interpolation
    const speed = 0.15;
    const trailSpeeds = [0.1, 0.07, 0.05, 0.03];
    let outerX = -100;
    let outerY = -100;
    let dotX = -100;
    let dotY = -100;

    const tick = () => {
      const { x, y } = mousePos.current;

      // Dot follows mouse closely
      dotX += (x - dotX) * 0.35;
      dotY += (y - dotY) * 0.35;
      setDotX(dotX - 3);
      setDotY(dotY - 3);

      // Outer ring with lerp
      const hovering = isHoveringRef.current;
      outerX += (x - outerX) * speed;
      outerY += (y - outerY) * speed;
      setOuterX(outerX - (hovering ? 40 : 20));
      setOuterY(outerY - (hovering ? 40 : 20));

      // Trail particles
      trails.forEach((_, i) => {
        const prevPos =
          i === 0 ? { x: outerX, y: outerY } : trailPositions[i - 1];
        trailPositions[i].x += (prevPos.x - trailPositions[i].x) * trailSpeeds[i];
        trailPositions[i].y += (prevPos.y - trailPositions[i].y) * trailSpeeds[i];
        trailSetters[i].x(trailPositions[i].x - 8);
        trailSetters[i].y(trailPositions[i].y - 8);
      });
    };

    gsap.ticker.add(tick);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);

    return () => {
      gsap.ticker.remove(tick);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      {/* Trailing ghost circles (reduced on low-end devices) */}
      {trailIndices.map((i) => (
        <div
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el;
          }}
          className="cursor-trail"
          style={{
            opacity: 0,
            width: 16 - i * 2,
            height: 16 - i * 2,
          }}
        />
      ))}

      {/* Outer ring */}
      <div ref={outerRef} className="cursor-outer" style={{ opacity: 0 }}>
        <span ref={textRef} className="cursor-text">
          View
        </span>
      </div>

      {/* Inner dot */}
      <div ref={dotRef} className="cursor-dot" style={{ opacity: 0 }} />
    </>
  );
}
