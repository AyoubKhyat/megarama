"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  strength?: number;
  radius?: number;
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.35,
  radius = 100,
}: MagneticButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const childRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const child = childRef.current;
    if (!container || !child) return;

    // Skip on mobile
    if (window.innerWidth < 768) return;

    let animationId: number | null = null;
    let isInside = false;

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      const distance = Math.sqrt(distX * distX + distY * distY);

      if (distance < radius) {
        if (!isInside) {
          isInside = true;
        }

        // Cancel any pending spring-back
        if (animationId !== null) {
          cancelAnimationFrame(animationId);
          animationId = null;
        }

        // Calculate magnetic pull - stronger when closer
        const pull = 1 - distance / radius;
        const moveX = distX * strength * pull;
        const moveY = distY * strength * pull;

        gsap.to(child, {
          x: moveX,
          y: moveY,
          duration: 0.3,
          ease: "power2.out",
          overwrite: true,
        });
      } else if (isInside) {
        isInside = false;
        // Spring back
        gsap.to(child, {
          x: 0,
          y: 0,
          duration: 0.7,
          ease: "elastic.out(1, 0.3)",
          overwrite: true,
        });
      }
    };

    const onMouseLeave = () => {
      isInside = false;
      gsap.to(child, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)",
        overwrite: true,
      });
    };

    // Listen on window for mouse move (to detect approach)
    window.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      if (animationId !== null) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [strength, radius]);

  return (
    <div ref={containerRef} className={`magnetic-button-wrapper ${className}`}>
      <div ref={childRef} className="magnetic-button-inner">
        {children}
      </div>
    </div>
  );
}
