"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  { id: "hero", label: "Hero" },
  { id: "now-showing", label: "Now Showing" },
  { id: "booking", label: "Booking" },
  { id: "experience", label: "Experience" },
  { id: "story", label: "Story" },
  { id: "imax", label: "IMAX" },
  { id: "snacks", label: "Snacks" },
  { id: "loyalty", label: "Loyalty" },
  { id: "contact", label: "Contact" },
];

export default function SectionDots() {
  const [activeSection, setActiveSection] = useState("hero");
  const [hoveredDot, setHoveredDot] = useState<string | null>(null);
  const [visible, setVisible] = useState(false);

  // Show after 6 seconds (after cinema intro)
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 6000);
    return () => clearTimeout(timer);
  }, []);

  // IntersectionObserver to detect active section
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id || "hero";
          setActiveSection(id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, {
      threshold: 0.3,
    });

    sections.forEach(({ id }) => {
      if (id === "hero") {
        // For hero, observe the first section or the main/hero element
        const heroEl =
          document.getElementById("hero") ||
          document.querySelector("main > section:first-child") ||
          document.querySelector("[data-section='hero']");
        if (heroEl) observer.observe(heroEl);
      } else {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = useCallback((id: string) => {
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  if (!visible) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[9995] hidden md:flex flex-col items-center gap-3"
      aria-label="Section navigation"
    >
      {/* Connecting line */}
      <div className="absolute top-0 bottom-0 w-px bg-white/10 left-1/2 -translate-x-1/2 pointer-events-none" />

      {sections.map(({ id, label }) => {
        const isActive = activeSection === id;

        return (
          <div
            key={id}
            className="relative flex items-center"
            onMouseEnter={() => setHoveredDot(id)}
            onMouseLeave={() => setHoveredDot(null)}
          >
            {/* Tooltip */}
            <AnimatePresence>
              {hoveredDot === id && (
                <motion.span
                  initial={{ opacity: 0, x: 8, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 8, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-full mr-3 whitespace-nowrap text-xs font-medium text-white/80 bg-black/60 backdrop-blur-sm px-2 py-1 rounded pointer-events-none"
                >
                  {label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Dot */}
            <button
              onClick={() => scrollToSection(id)}
              aria-label={`Scroll to ${label}`}
              className="relative flex items-center justify-center w-5 h-5 cursor-pointer group"
            >
              <motion.span
                animate={{
                  width: isActive ? 10 : 6,
                  height: isActive ? 10 : 6,
                  backgroundColor: isActive
                    ? "var(--mega-red, #e50914)"
                    : "rgba(255, 255, 255, 0.2)",
                  boxShadow: isActive
                    ? "0 0 8px 2px rgba(229, 9, 20, 0.5)"
                    : "none",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="block rounded-full"
              />
              {/* Active pulse ring */}
              {isActive && (
                <motion.span
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeOut",
                  }}
                  className="absolute w-[10px] h-[10px] rounded-full bg-[var(--mega-red,#e50914)]"
                />
              )}
            </button>
          </div>
        );
      })}
    </motion.nav>
  );
}
