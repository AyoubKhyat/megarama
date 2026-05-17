"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

gsap.registerPlugin(ScrollTrigger);

interface Chapter {
  number: string;
  text: string;
  background: string;
}

const chapters: Chapter[] = [
  {
    number: "I",
    text: "The evening begins. Marrakech glows behind you as you step through the doors.",
    background: "radial-gradient(ellipse at center, #4a2800 0%, #1a0a00 50%, #0d0d0d 100%)",
  },
  {
    number: "II",
    text: "The screen fills with possibilities. Tonight, it's something extraordinary.",
    background: "radial-gradient(ellipse at center, #1a1a2e 0%, #0d0d1a 50%, #0d0d0d 100%)",
  },
  {
    number: "III",
    text: "Your seat reclines. The armrest is cool. The room goes dark.",
    background: "radial-gradient(ellipse at center, #0a0a0a 0%, #050505 50%, #000000 100%)",
  },
  {
    number: "IV",
    text: "Light floods the room. Sound wraps around you. The story begins.",
    background: "radial-gradient(ellipse at center, #e31837 0%, #4a0a12 40%, #0d0d0d 100%)",
  },
  {
    number: "V",
    text: "For two hours, you're somewhere else entirely.",
    background: "radial-gradient(ellipse at center, #1a0a12 0%, #0d0d0d 60%, #0d0d0d 100%)",
  },
];

function Particles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
            y: [0, -100 - Math.random() * 200],
            x: [0, (Math.random() - 0.5) * 100],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

function PosterGrid() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="grid grid-cols-4 gap-3 opacity-20">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-16 h-24 md:w-20 md:h-30 rounded bg-gradient-to-b from-[#d4a853]/30 to-[#0d0d0d]/50 border border-[#d4a853]/10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          />
        ))}
      </div>
    </div>
  );
}

export default function StorytellingSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chaptersRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const progressFillRef = useRef<HTMLDivElement>(null);
  const indicatorsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      // Pin the entire section
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=300%",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      });

      // Progress bar animation
      tl.to(
        progressFillRef.current,
        { scaleY: 1, ease: "none" },
        0
      );

      // Chapter transitions
      chapters.forEach((_, index) => {
        const chapterEl = chaptersRef.current[index];
        if (!chapterEl) return;

        const startTime = index / chapters.length;
        const endTime = (index + 1) / chapters.length;
        const duration = endTime - startTime;

        // Fade in
        if (index > 0) {
          tl.fromTo(
            chapterEl,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: duration * 0.3, ease: "power2.out" },
            startTime
          );
        }

        // Highlight chapter indicator
        const indicator = indicatorsRef.current[index];
        if (indicator) {
          tl.to(
            indicator,
            { color: "#d4a853", scale: 1.3, duration: duration * 0.1 },
            startTime
          );
          if (index > 0) {
            const prevIndicator = indicatorsRef.current[index - 1];
            if (prevIndicator) {
              tl.to(
                prevIndicator,
                { color: "#ffffff40", scale: 1, duration: duration * 0.1 },
                startTime
              );
            }
          }
        }

        // Fade out (except last chapter)
        if (index < chapters.length - 1) {
          tl.to(
            chapterEl,
            { opacity: 0, y: -30, duration: duration * 0.3, ease: "power2.in" },
            endTime - duration * 0.3
          );
        }
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative w-full h-screen overflow-hidden"
      style={{ background: "#0d0d0d" }}
    >
      {/* Progress indicator on the left */}
      <div
        ref={progressRef}
        className="absolute left-8 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-6"
      >
        {/* Progress line container */}
        <div className="relative w-px h-48 bg-white/10 rounded-full overflow-hidden">
          <div
            ref={progressFillRef}
            className="absolute top-0 left-0 w-full h-full origin-top bg-gradient-to-b from-[#d4a853] to-[#e31837]"
            style={{ transform: "scaleY(0)" }}
          />
        </div>
        {/* Chapter numbers */}
        <div className="flex flex-col items-center gap-4">
          {chapters.map((chapter, i) => (
            <span
              key={i}
              ref={(el) => { indicatorsRef.current[i] = el; }}
              className="text-xs font-light tracking-widest transition-all duration-300"
              style={{ color: i === 0 ? "#d4a853" : "#ffffff40" }}
            >
              {chapter.number}
            </span>
          ))}
        </div>
      </div>

      {/* Title */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 z-20">
        <span className="text-xs uppercase tracking-[0.3em] text-[#d4a853]/60 font-light">
          Your Night at Megarama
        </span>
      </div>

      {/* Chapters */}
      {chapters.map((chapter, index) => (
        <div
          key={index}
          ref={(el) => { chaptersRef.current[index] = el; }}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: index === 0 ? 1 : 0,
            background: chapter.background,
          }}
        >
          {/* Chapter 2: Poster grid */}
          {index === 1 && <PosterGrid />}

          {/* Chapter 4: Particles */}
          {index === 3 && <Particles />}

          {/* Chapter 4: Flash overlay */}
          {index === 3 && (
            <div className="absolute inset-0 bg-white/5 animate-pulse pointer-events-none" />
          )}

          {/* Text content */}
          <div className="relative z-10 max-w-3xl px-8 text-center">
            <p
              className={`font-light leading-relaxed ${
                index === 4
                  ? "text-3xl md:text-5xl animate-[breathe_4s_ease-in-out_infinite]"
                  : "text-3xl md:text-5xl lg:text-6xl"
              } text-white/90`}
            >
              {chapter.text}
            </p>
          </div>
        </div>
      ))}

      {/* Breathing animation keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes breathe {
          0%, 100% { opacity: 0.85; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.02); }
        }
      `}} />
    </section>
  );
}
