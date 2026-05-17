"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function MagneticButton({
  children,
  href,
  className,
}: {
  children: React.ReactNode;
  href: string;
  className: string;
}) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distX = e.clientX - centerX;
      const distY = e.clientY - centerY;
      x.set(distX * 0.3);
      y.set(distY * 0.3);
    },
    [x, y]
  );

  const handleMouseLeave = useCallback(() => {
    x.set(0);
    y.set(0);
  }, [x, y]);

  return (
    <motion.a
      ref={buttonRef}
      href={href}
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </motion.a>
  );
}

export default function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const scrollSpotlightRef = useRef<HTMLDivElement>(null);
  const [, setMounted] = useState(false);

  const titleLetters = "MEGARAMA".split("");
  const subtitleWords = ["Experience", "cinema", "like", "never", "before."];

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  const poster1X = useTransform(smoothMouseX, [-0.5, 0.5], [-40, 40]);
  const poster1Y = useTransform(smoothMouseY, [-0.5, 0.5], [-30, 30]);
  const poster2X = useTransform(smoothMouseX, [-0.5, 0.5], [30, -30]);
  const poster2Y = useTransform(smoothMouseY, [-0.5, 0.5], [20, -20]);
  const poster3X = useTransform(smoothMouseX, [-0.5, 0.5], [-20, 20]);
  const poster3Y = useTransform(smoothMouseY, [-0.5, 0.5], [-25, 25]);
  const poster4X = useTransform(smoothMouseX, [-0.5, 0.5], [25, -25]);
  const poster4Y = useTransform(smoothMouseY, [-0.5, 0.5], [15, -15]);

  useEffect(() => {
    setMounted(true);
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { width, height } = hero.getBoundingClientRect();
      mouseX.set(clientX / width - 0.5);
      mouseY.set(clientY / height - 0.5);

      if (spotlightRef.current) {
        gsap.to(spotlightRef.current, {
          x: clientX - 300,
          y: clientY - 300,
          duration: 1.5,
          ease: "power2.out",
        });
      }
    };

    hero.addEventListener("mousemove", handleMouseMove);

    ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom top",
      onUpdate: (self) => {
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${self.progress})`;
        }
        if (scrollSpotlightRef.current) {
          const yPos = self.progress * 100;
          scrollSpotlightRef.current.style.top = `${yPos}%`;
          scrollSpotlightRef.current.style.opacity = `${1 - self.progress * 0.8}`;
        }
      },
    });

    return () => {
      hero.removeEventListener("mousemove", handleMouseMove);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [mouseX, mouseY]);

  return (
    <section
      ref={heroRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Scroll progress indicator */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-50">
        <div
          ref={progressRef}
          className="h-full bg-gradient-to-r from-mega-red via-mega-gold to-mega-red origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      {/* Animated gradient mesh background */}
      <div className="absolute inset-0 bg-mega-dark overflow-hidden">
        <div
          className="absolute w-[800px] h-[800px] rounded-full opacity-30 blur-[120px]"
          style={{
            background: "radial-gradient(circle, #e31837 0%, transparent 70%)",
            top: "-20%",
            left: "-10%",
            animation: "meshBlob1 15s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-[100px]"
          style={{
            background: "radial-gradient(circle, #1a0a2e 0%, transparent 70%)",
            bottom: "-15%",
            right: "-5%",
            animation: "meshBlob2 18s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[500px] h-[500px] rounded-full opacity-15 blur-[80px]"
          style={{
            background: "radial-gradient(circle, #d4a853 0%, transparent 70%)",
            top: "40%",
            right: "20%",
            animation: "meshBlob3 20s ease-in-out infinite",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 50%, rgba(0,0,0,0.85) 100%)",
          }}
        />
      </div>

      {/* Dynamic scroll-driven spotlight */}
      <div
        ref={scrollSpotlightRef}
        className="absolute left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(227,24,55,0.08) 0%, transparent 70%)",
          top: "0%",
        }}
      />

      {/* Mouse-following spotlight */}
      <div
        ref={spotlightRef}
        className="absolute w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(227,24,55,0.12) 0%, rgba(212,168,83,0.04) 40%, transparent 70%)",
        }}
      />

      {/* Secondary ambient spotlight */}
      <div className="spotlight top-1/4 right-1/4" />

      {/* Animated cinema light beams */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-[20%] w-[1px] h-full"
          style={{
            background:
              "linear-gradient(to bottom, rgba(227,24,55,0.3), rgba(227,24,55,0.05) 50%, transparent)",
          }}
          animate={{ x: [0, 150, -80, 0], opacity: [0.2, 0.5, 0.15, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-0 right-[30%] w-[1px] h-full"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0.03) 40%, transparent)",
          }}
          animate={{ x: [0, -120, 60, 0], opacity: [0.15, 0.4, 0.1, 0.15] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-0 left-[60%] w-[2px] h-full"
          style={{
            background:
              "linear-gradient(to bottom, rgba(212,168,83,0.2), transparent 60%)",
          }}
          animate={{ x: [0, 80, -60, 0], opacity: [0.1, 0.3, 0.08, 0.1] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating 3D movie posters with parallax */}
      <div className="absolute inset-0 pointer-events-none perspective-[1000px]">
        <div
          data-hero-poster
          className="absolute top-[15%] left-[8%] w-32 h-48 md:w-44 md:h-64"
        >
          <motion.div
            className="parallax-poster relative w-full h-full rounded-lg overflow-hidden shadow-2xl"
            style={{ x: poster1X, y: poster1Y, rotateY: -15, transformStyle: "preserve-3d" }}
          >
            <Image src="/images/posters/mandalorian.jpg" alt="The Mandalorian & Grogu" fill sizes="(max-width: 768px) 128px, 176px" className="object-cover" />
          </motion.div>
        </div>

        <div
          data-hero-poster
          className="absolute top-[20%] right-[10%] w-36 h-52 md:w-48 md:h-72"
        >
          <motion.div
            className="parallax-poster relative w-full h-full rounded-lg overflow-hidden shadow-2xl"
            style={{ x: poster2X, y: poster2Y, rotateY: 12, transformStyle: "preserve-3d" }}
          >
            <Image src="/images/posters/toy-story-5.jpg" alt="Toy Story 5" fill sizes="(max-width: 768px) 144px, 192px" className="object-cover" />
          </motion.div>
        </div>

        <div
          data-hero-poster
          className="absolute bottom-[20%] left-[15%] w-28 h-40 md:w-40 md:h-56 hidden md:block"
        >
          <motion.div
            className="parallax-poster relative w-full h-full rounded-lg overflow-hidden shadow-2xl"
            style={{ x: poster3X, y: poster3Y, rotateY: -8, transformStyle: "preserve-3d" }}
          >
            <Image src="/images/posters/spiderman.jpg" alt="Spider-Man" fill sizes="(max-width: 768px) 0px, 160px" className="object-cover" />
          </motion.div>
        </div>

        <div
          data-hero-poster
          className="absolute bottom-[25%] right-[12%] w-32 h-44 md:w-36 md:h-52 hidden md:block"
        >
          <motion.div
            className="parallax-poster relative w-full h-full rounded-lg overflow-hidden shadow-2xl"
            style={{ x: poster4X, y: poster4Y, rotateY: 10, transformStyle: "preserve-3d" }}
          >
            <Image src="/images/posters/hero-4.jpg" alt="Featured Movie" fill sizes="(max-width: 768px) 0px, 144px" className="object-cover" />
          </motion.div>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-4">
        {/* Subtitle above title */}
        <div data-hero-subtitle className="mb-4">
          <span className="text-xs md:text-sm tracking-[0.5em] text-mega-red/80 uppercase">
            Marrakech&apos;s Premier Cinema
          </span>
        </div>

        {/* Letter-by-letter MEGARAMA title */}
        <h1 className="text-6xl md:text-[8rem] lg:text-[10rem] font-bold tracking-tighter leading-none mb-6 neon-glow flex items-center justify-center">
          {titleLetters.map((letter, i) => (
            <span
              key={i}
              data-hero-letter
              className={i < 4 ? "text-white inline-block" : "text-mega-red inline-block"}
              style={{ display: "inline-block" }}
            >
              {letter}
            </span>
          ))}
        </h1>

        {/* Word-by-word subtitle reveal */}
        <p className="text-lg md:text-xl text-white/50 tracking-wide max-w-xl mx-auto mb-10 flex items-center justify-center gap-[0.35em] flex-wrap">
          {subtitleWords.map((word, i) => (
            <span
              key={i}
              data-hero-word
              className="inline-block"
            >
              {word}
            </span>
          ))}
        </p>

        {/* Magnetic CTA buttons */}
        <div
          data-hero-cta
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <MagneticButton
            href="#now-showing"
            className="px-8 py-4 bg-mega-red text-white text-sm tracking-widest uppercase rounded-full hover:bg-mega-red-dark transition-all duration-300 hover:shadow-[0_0_30px_rgba(227,24,55,0.5)] inline-block"
          >
            Now Showing
          </MagneticButton>
          <MagneticButton
            href="#booking"
            className="px-8 py-4 border border-white/20 text-white text-sm tracking-widest uppercase rounded-full hover:border-mega-red hover:text-mega-red transition-all duration-300 hover:shadow-[0_0_20px_rgba(227,24,55,0.2)] inline-block"
          >
            Book Tickets
          </MagneticButton>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        data-hero-scroll
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] text-white/30 uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-[1px] h-8 bg-gradient-to-b from-mega-red to-transparent"
        />
      </div>

      {/* Inline keyframes for gradient mesh animation */}
      <style jsx>{`
        @keyframes meshBlob1 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          25% {
            transform: translate(80px, 40px) scale(1.1);
          }
          50% {
            transform: translate(-40px, 80px) scale(0.95);
          }
          75% {
            transform: translate(60px, -30px) scale(1.05);
          }
        }
        @keyframes meshBlob2 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-60px, -40px) scale(1.15);
          }
          66% {
            transform: translate(40px, -60px) scale(0.9);
          }
        }
        @keyframes meshBlob3 {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          20% {
            transform: translate(-50px, 30px) scale(1.1);
          }
          40% {
            transform: translate(30px, -50px) scale(0.95);
          }
          60% {
            transform: translate(60px, 20px) scale(1.05);
          }
          80% {
            transform: translate(-30px, -40px) scale(1.12);
          }
        }
      `}</style>
    </section>
  );
}
