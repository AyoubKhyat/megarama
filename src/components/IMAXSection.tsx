"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useReducedPerformance from "@/hooks/useReducedPerformance";
import { useTranslation } from "@/i18n";

gsap.registerPlugin(ScrollTrigger);

function AnimatedNumber({
  value,
  suffix = "",
  inView,
}: {
  value: number;
  suffix?: string;
  inView: boolean;
}) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const start = performance.now();
    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, value]);

  return (
    <span>
      {display}
      {suffix}
    </span>
  );
}

export default function IMAXSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const clipRef = useRef<SVGCircleElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-100px" });
  const { isLowEnd, prefersReducedMotion } = useReducedPerformance();
  const t = useTranslation();

  const particleCount = isLowEnd || prefersReducedMotion ? 15 : 60;

  const [particles] = useState(() => {
    // Seeded PRNG to avoid hydration mismatch
    let seed = 42;
    const seededRandom = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    // Generate max count; we slice at render time based on device capability
    return Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: seededRandom() * 100,
      top: seededRandom() * 100,
      size: 1 + seededRandom() * 4,
      duration: 3 + seededRandom() * 5,
      delay: seededRandom() * 5,
      yTravel: -(80 + seededRandom() * 120),
      xTravel: seededRandom() * 60 - 30,
    }));
  });

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    const content = contentRef.current;
    if (!section || !text || !content) return;

    // SVG clip-path reveal: expanding circle on scroll
    gsap.fromTo(
      clipRef.current,
      { attr: { r: 0 } },
      {
        attr: { r: 1200 },
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 20%",
          scrub: 1,
        },
      }
    );

    // Subtle camera shake on scroll entry (skip for reduced motion)
    if (!prefersReducedMotion) {
      gsap.fromTo(
        section,
        { x: 0 },
        {
          x: 0,
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
            onEnter: () => {
              gsap.to(section, {
                x: "random(-2, 2)",
                y: "random(-1, 1)",
                duration: 0.04,
                repeat: 10,
                yoyo: true,
                ease: "none",
                onComplete: () => {
                  gsap.to(section, { x: 0, y: 0, duration: 0.2 });
                },
              });
            },
          },
        }
      );
    }

    // Wave/ripple text animation
    const words = text.querySelectorAll(".imax-word");
    words.forEach((word, i) => {
      gsap.fromTo(
        word,
        {
          y: 80,
          opacity: 0,
          rotateX: 90,
          scale: 0.7,
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: 1,
          delay: i * 0.1,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: text,
            start: "top 75%",
          },
        }
      );
    });

    // Pulsing energy lines between stats
    const lines = section.querySelectorAll(".energy-line");
    lines.forEach((line) => {
      gsap.to(line, {
        scaleX: 1,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: statsRef.current,
          start: "top 80%",
        },
      });
      gsap.to(line, {
        opacity: 0.3,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });
    });

    // Animated gradient band pulse
    gsap.to(".gradient-band", {
      backgroundPosition: "200% center",
      duration: 3,
      repeat: -1,
      ease: "none",
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [prefersReducedMotion]);

  const stats = [
    { value: 12, suffix: "K", label: t.imax.resolution },
    { value: 120, suffix: "", label: t.imax.fps },
    { value: 40, suffix: "m", label: t.imax.screen },
    { value: 360, suffix: "°", label: t.imax.sound },
  ];

  return (
    <section
      id="imax"
      ref={sectionRef}
      className="relative py-40 overflow-hidden"
    >
      {/* Multi-layer background */}
      <div className="absolute inset-0">
        <div className="imax-bg-layer absolute inset-0 bg-gradient-to-b from-black via-mega-dark to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(227,24,55,0.1)_0%,transparent_70%)]" />
      </div>

      {/* Pulsing gradient band */}
      <div
        className="gradient-band absolute top-0 left-0 w-full h-1"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #e31837 25%, #fff 50%, #e31837 75%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
      />
      <div
        className="gradient-band absolute bottom-0 left-0 w-full h-1"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #e31837 25%, #fff 50%, #e31837 75%, transparent 100%)",
          backgroundSize: "200% 100%",
        }}
      />

      {/* Intense particle system - dynamically scaled for device capability */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.slice(0, particleCount).map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: p.size,
              height: p.size,
              background:
                p.id % 3 === 0
                  ? "rgba(227,24,55,0.6)"
                  : p.id % 3 === 1
                  ? "rgba(255,255,255,0.4)"
                  : "rgba(227,24,55,0.3)",
            }}
            animate={{
              y: [0, p.yTravel, 0],
              x: [0, p.xTravel, 0],
              opacity: [0, 0.9, 0],
              scale: [0, 1 + p.size * 0.3, 0],
            }}
            transition={{
              duration: p.duration,
              repeat: Infinity,
              delay: p.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Animated light beams (hidden on low-end devices) */}
      {!isLowEnd && !prefersReducedMotion && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-0 left-1/4 w-[2px] h-full bg-gradient-to-b from-mega-red/40 via-mega-red/10 to-transparent"
            animate={{ opacity: [0, 0.7, 0], x: [-80, 80, -80] }}
            transition={{ duration: 5, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-0 right-1/3 w-[2px] h-full bg-gradient-to-b from-white/30 via-white/5 to-transparent"
            animate={{ opacity: [0, 0.5, 0], x: [40, -40, 40] }}
            transition={{ duration: 7, repeat: Infinity, delay: 1.5 }}
          />
          <motion.div
            className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-mega-red/20 via-transparent to-mega-red/20"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 4, repeat: Infinity, delay: 3 }}
          />
        </div>
      )}

      {/* SVG Clip-path reveal */}
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 5 }}>
        <defs>
          <clipPath id="imax-reveal-clip">
            <circle ref={clipRef} cx="50%" cy="50%" r="0" />
          </clipPath>
        </defs>
      </svg>

      {/* Content revealed through clip-path */}
      <div
        ref={contentRef}
        className="relative"
        style={{ clipPath: "url(#imax-reveal-clip)", zIndex: 10 }}
      >
        <div className="max-w-5xl mx-auto px-6 text-center">
          {/* IMAX Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
            className="mb-12"
          >
            <div className="inline-block px-8 py-4 border-2 border-mega-red rounded-lg relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-mega-red/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
              />
              <span className="relative text-3xl md:text-5xl font-black tracking-[0.2em] text-mega-red neon-glow">
                IMAX
              </span>
            </div>
            <div className="mt-4 flex items-center justify-center gap-4">
              <motion.div
                className="w-20 h-[2px] bg-gradient-to-r from-transparent to-mega-red/70"
                animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-xs tracking-[0.4em] text-white/50 uppercase">
                {t.imax.subtitle}
              </span>
              <motion.div
                className="w-20 h-[2px] bg-gradient-to-l from-transparent to-mega-red/70"
                animate={{ scaleX: [0.5, 1, 0.5], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Main text with wave/ripple animation */}
          <div ref={textRef} className="mb-16" style={{ perspective: "1000px" }}>
            <h2 className="text-4xl md:text-6xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
              <span className="imax-word inline-block mr-4 origin-bottom">
                {t.imax.line1}
              </span>
              <span className="imax-word inline-block mr-4 text-mega-red origin-bottom">
                {t.imax.line1Accent}
              </span>
              <span className="imax-word inline-block origin-bottom">
                {t.imax.line1End}
              </span>
              <br />
              <span className="imax-word inline-block mr-4 origin-bottom">
                {t.imax.line2}
              </span>
              <span className="imax-word inline-block mr-4 text-mega-red origin-bottom">
                {t.imax.line2Accent}
              </span>
              <span className="imax-word inline-block origin-bottom">
                {t.imax.line2End}
              </span>
              <br />
              <span className="imax-word inline-block mr-4 origin-bottom">
                {t.imax.line3}
              </span>
              <span className="imax-word inline-block mr-4 text-mega-red origin-bottom">
                {t.imax.line3Accent}
              </span>
              <span className="imax-word inline-block origin-bottom">
                {t.imax.line3End}
              </span>
            </h2>
          </div>

          {/* Stats with animated counters and energy lines */}
          <div ref={statsRef} className="relative">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 relative"
            >
              {stats.map((stat, i) => (
                <div key={stat.label} className="relative">
                  <div className="glass-card p-6 text-center group hover:border-mega-red/40 transition-all duration-500 relative overflow-hidden">
                    {/* Glow effect on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-mega-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <motion.span
                      className="relative block text-3xl md:text-4xl font-bold text-mega-red mb-1"
                      initial={{ scale: 0.5, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.15, type: "spring", stiffness: 200 }}
                    >
                      <AnimatedNumber
                        value={stat.value}
                        suffix={stat.suffix}
                        inView={statsInView}
                      />
                    </motion.span>
                    <span className="relative text-xs text-white/40 tracking-widest uppercase">
                      {stat.label}
                    </span>
                  </div>
                  {/* Energy line connecting to next stat */}
                  {i < stats.length - 1 && (
                    <div className="energy-line hidden md:block absolute top-1/2 -right-3 w-6 h-[2px] bg-gradient-to-r from-mega-red/60 to-mega-red/20 origin-left scale-x-0 opacity-0" />
                  )}
                </div>
              ))}
            </motion.div>

            {/* Pulsing connector lines for mobile */}
            <div className="hidden md:flex absolute inset-0 items-center justify-between px-[12.5%] pointer-events-none">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-[2px] h-8 bg-mega-red/30 rounded-full"
                  animate={{
                    opacity: [0.2, 0.8, 0.2],
                    scaleY: [0.5, 1.2, 0.5],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-16"
          >
            <a
              href="#booking"
              className="group relative inline-block px-10 py-5 bg-mega-red text-white text-sm tracking-[0.3em] uppercase rounded-full hover:bg-mega-red-dark transition-all duration-300 hover:shadow-[0_0_40px_rgba(227,24,55,0.5)] hover:scale-105 overflow-hidden"
            >
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              />
              <span className="relative">{t.imax.cta}</span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
