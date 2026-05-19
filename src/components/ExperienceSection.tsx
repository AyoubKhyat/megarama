"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Inline SVG icons for cinema experiences
function ScreenIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
      <rect
        x="4"
        y="10"
        width="40"
        height="24"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M4 14C4 14 24 20 44 14"
        stroke="currentColor"
        strokeWidth="1.5"
        opacity="0.5"
      />
      <line x1="18" y1="34" x2="18" y2="40" stroke="currentColor" strokeWidth="2" />
      <line x1="30" y1="34" x2="30" y2="40" stroke="currentColor" strokeWidth="2" />
      <line x1="14" y1="40" x2="34" y2="40" stroke="currentColor" strokeWidth="2" />
      <motion.rect
        x="10"
        y="14"
        width="28"
        height="16"
        rx="1"
        fill="currentColor"
        opacity="0.1"
        animate={{ opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
}

function SoundIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
      <path
        d="M12 18H8a2 2 0 00-2 2v8a2 2 0 002 2h4l8 6V12l-8 6z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <motion.path
        d="M28 16c2.5 2 4 5 4 8s-1.5 6-4 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ opacity: [0.3, 1, 0.3], pathLength: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      <motion.path
        d="M33 12c4 3.5 6 8 6 12s-2 8.5-6 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ opacity: [0.2, 0.8, 0.2], pathLength: [0.2, 1, 0.2] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
      />
      <motion.path
        d="M38 8c5.5 5 8.5 11 8.5 16s-3 11-8.5 16"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        animate={{ opacity: [0.1, 0.6, 0.1], pathLength: [0.1, 1, 0.1] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
      />
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
      <motion.path
        d="M24 4L44 20L24 44L4 20L24 4Z"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        animate={{ rotate: [0, 2, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <path d="M4 20H44" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <path d="M24 4L18 20L24 44" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M24 4L30 20L24 44" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <motion.path
        d="M24 4L44 20L24 44L4 20L24 4Z"
        fill="currentColor"
        opacity="0.05"
        animate={{ opacity: [0.03, 0.1, 0.03] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </svg>
  );
}

function FamilyIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" className="w-12 h-12">
      <circle cx="16" cy="14" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="32" cy="14" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="24" cy="26" r="3" stroke="currentColor" strokeWidth="2" />
      <path
        d="M8 34c0-4 4-7 8-7s8 3 8 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M24 34c0-4 4-7 8-7s8 3 8 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <motion.path
        d="M17 38c0-3.5 3.5-6 7-6s7 2.5 7 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        animate={{ y: [0, -1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </svg>
  );
}

const experiences = [
  {
    title: "Giant Screen",
    description: "30-meter curved screens for total immersion in every frame.",
    Icon: ScreenIcon,
    stat: "30m",
    statLabel: "Screen Width",
  },
  {
    title: "Dolby Atmos",
    description: "360° surround sound that puts you inside the movie.",
    Icon: SoundIcon,
    stat: "64",
    statLabel: "Speakers",
  },
  {
    title: "Premium Comfort",
    description: "Heated reclining seats with personal armrests and space.",
    Icon: DiamondIcon,
    stat: "VIP",
    statLabel: "Experience",
  },
  {
    title: "Family Zone",
    description: "Dedicated family screenings with kid-friendly snack bars.",
    Icon: FamilyIcon,
    stat: "4+",
    statLabel: "Screens",
  },
];

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([
    false,
    false,
    false,
    false,
  ]);

  // Scroll progress for section indicator
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // Parallax transforms
  const textY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const cardsY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // 3D card flip animation on scroll
    const cards = section.querySelectorAll(".exp-card-wrapper");
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        {
          rotateY: -90,
          opacity: 0,
          scale: 0.8,
          z: -200,
        },
        {
          rotateY: 0,
          opacity: 1,
          scale: 1,
          z: 0,
          duration: 1.2,
          delay: i * 0.2,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        }
      );
    });

    // Scanline animation
    const scanlineTween = gsap.to(".scanline", {
      y: "100%",
      duration: 3,
      repeat: -1,
      ease: "none",
    });

    return () => {
      scanlineTween.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative py-32 overflow-hidden"
    >
      {/* Scroll-driven progress indicator */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-mega-red to-mega-gold z-50"
        style={{
          scaleX: smoothProgress,
          transformOrigin: "left",
          width: "100%",
        }}
      />

      {/* Background ambient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-mega-red/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-900/5 rounded-full blur-[120px]" />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(227,24,55,0.03) 0%, transparent 70%)",
          }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Top section: text + video mockup with parallax */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
          {/* Left text - moves at different parallax speed */}
          <motion.div style={{ y: textY }}>
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  className="w-12 h-[2px] bg-mega-red"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  style={{ transformOrigin: "left" }}
                />
                <span className="text-xs tracking-[0.3em] text-mega-red uppercase">
                  The Experience
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-6">
                <motion.span
                  className="block"
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  MORE THAN
                </motion.span>
                <motion.span
                  className="block text-mega-red"
                  initial={{ y: 40, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                >
                  CINEMA
                </motion.span>
              </h2>
              <motion.p
                className="text-lg text-white/50 leading-relaxed max-w-lg"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7 }}
              >
                Megarama Marrakech redefines what it means to watch a film. Every
                detail — from our giant screens to immersive sound — is crafted to
                transport you into the story.
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Right: Cinema visual with animated scanlines and pulsing play button */}
          <motion.div style={{ y: cardsY }}>
            <motion.div
              initial={{ opacity: 0, scale: 0.85, rotateY: 15 }}
              whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative"
              style={{ perspective: "1000px" }}
            >
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/10 neon-glow-box">
                <div className="absolute inset-0">
                  {/* Cinema venue background image */}
                  <Image
                    src="/images/branding/cinema-hall.jpg"
                    alt="Megarama Marrakech Cinema"
                    fill
                    sizes="(max-width: 768px) 100vw, 60vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {/* Pulsing play button */}
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 rounded-full bg-mega-red/20"
                      animate={{
                        scale: [1, 1.8, 1],
                        opacity: [0.4, 0, 0.4],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-full bg-mega-red/10"
                      animate={{
                        scale: [1, 2.5, 1],
                        opacity: [0.3, 0, 0.3],
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                    />
                    <motion.div
                      animate={{
                        boxShadow: [
                          "0 0 20px rgba(227,24,55,0.3)",
                          "0 0 60px rgba(227,24,55,0.6)",
                          "0 0 20px rgba(227,24,55,0.3)",
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="relative w-24 h-24 rounded-full bg-mega-red/20 flex items-center justify-center backdrop-blur-sm border border-mega-red/30"
                    >
                      <svg
                        className="w-10 h-10 text-mega-red ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M6.3 2.8A1.5 1.5 0 004 4.1v11.8a1.5 1.5 0 002.3 1.3l9.3-5.9a1.5 1.5 0 000-2.6L6.3 2.8z" />
                      </svg>
                    </motion.div>
                  </div>
                </div>

                {/* Animated scanlines */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  {Array.from({ length: 40 }, (_, i) => (
                    <div
                      key={i}
                      className="w-full h-[1px] bg-white/5"
                      style={{ marginTop: `${i * 2.5}%` }}
                    />
                  ))}
                  {/* Moving scanline */}
                  <motion.div
                    className="scanline absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-mega-red/30 to-transparent"
                    style={{ top: 0 }}
                  />
                </div>

                {/* Corner decorations */}
                <div className="absolute top-3 left-3 w-6 h-6 border-l-2 border-t-2 border-mega-red/40" />
                <div className="absolute top-3 right-3 w-6 h-6 border-r-2 border-t-2 border-mega-red/40" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-l-2 border-b-2 border-mega-red/40" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r-2 border-b-2 border-mega-red/40" />
              </div>

              {/* Floating element */}
              <motion.div
                animate={{ y: [-8, 8, -8], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-4 w-20 h-20 rounded-xl bg-mega-red/10 border border-mega-red/20 flex items-center justify-center backdrop-blur-sm"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-8 h-8 text-mega-red"
                >
                  <rect
                    x="2"
                    y="4"
                    width="20"
                    height="16"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path
                    d="M2 8H22"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    opacity="0.5"
                  />
                  <circle cx="5" cy="6" r="0.5" fill="currentColor" />
                  <circle cx="7" cy="6" r="0.5" fill="currentColor" />
                  <circle cx="9" cy="6" r="0.5" fill="currentColor" />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Experience cards with 3D rotation */}
        <div
          ref={cardsContainerRef}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          style={{ perspective: "1200px" }}
        >
          {experiences.map((exp, i) => (
            <div
              key={exp.title}
              className="exp-card-wrapper"
              style={{ transformStyle: "preserve-3d" }}
            >
              <motion.div
                className="glass-card p-6 group cursor-pointer relative overflow-hidden"
                whileHover={{
                  scale: 1.05,
                  rotateY: 5,
                  rotateX: -3,
                  z: 30,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onHoverStart={() => {
                  const newFlipped = [...flippedCards];
                  newFlipped[i] = true;
                  setFlippedCards(newFlipped);
                }}
                onHoverEnd={() => {
                  const newFlipped = [...flippedCards];
                  newFlipped[i] = false;
                  setFlippedCards(newFlipped);
                }}
              >
                {/* Hover glow background */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-mega-red/10 to-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: flippedCards[i] ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />

                {/* Animated SVG icon */}
                <div className="text-mega-red mb-4 relative">
                  <exp.Icon />
                  <motion.div
                    className="absolute -inset-2 rounded-full bg-mega-red/5"
                    animate={
                      flippedCards[i]
                        ? { scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }
                        : { scale: 1, opacity: 0 }
                    }
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                </div>

                <h3 className="relative text-lg font-bold mb-2 group-hover:text-mega-red transition-colors duration-300">
                  {exp.title}
                </h3>
                <p className="relative text-sm text-white/40 mb-4 leading-relaxed">
                  {exp.description}
                </p>
                <div className="relative pt-4 border-t border-white/5 group-hover:border-mega-red/20 transition-colors duration-300">
                  <motion.span
                    className="text-2xl font-bold text-mega-red inline-block"
                    animate={
                      flippedCards[i]
                        ? { scale: [1, 1.1, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.6, repeat: Infinity }}
                  >
                    {exp.stat}
                  </motion.span>
                  <span className="text-xs text-white/30 ml-2 tracking-wider uppercase">
                    {exp.statLabel}
                  </span>
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
