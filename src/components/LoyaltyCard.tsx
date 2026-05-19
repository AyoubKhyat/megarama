"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const tiers = [
  { name: "Bronze", color: "#cd7f32", progress: 100 },
  { name: "Silver", color: "#c0c0c0", progress: 100 },
  { name: "Gold", color: "#d4a853", progress: 65 },
];

function ProgressRing({
  progress,
  color,
  animated,
}: {
  progress: number;
  color: string;
  animated: boolean;
}) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (circumference * (animated ? progress : 0)) / 100;

  return (
    <svg width="88" height="88" className="transform -rotate-90">
      <circle
        cx="44"
        cy="44"
        r={radius}
        fill="none"
        stroke="rgba(255,255,255,0.1)"
        strokeWidth="4"
      />
      <circle
        cx="44"
        cy="44"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{ transition: animated ? "stroke-dashoffset 1.5s ease-out" : "none" }}
      />
    </svg>
  );
}

function QRCodePlaceholder() {
  const grid = Array.from({ length: 7 }, () =>
    Array.from({ length: 7 }, () => Math.random() > 0.4)
  );

  return (
    <div className="grid grid-cols-7 gap-[2px] w-16 h-16">
      {grid.flat().map((filled, i) => (
        <div
          key={i}
          className={`w-full h-full ${filled ? "bg-white" : "bg-transparent"}`}
        />
      ))}
    </div>
  );
}

export default function LoyaltyCard() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sheenPos, setSheenPos] = useState({ x: 50, y: 50 });
  const [ringsAnimated, setRingsAnimated] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Animate tiers on scroll
    ScrollTrigger.create({
      trigger: section,
      start: "top 60%",
      onEnter: () => setRingsAnimated(true),
    });

    // Entrance animation for the card
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 60, opacity: 0, rotateY: -15 },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
          },
        }
      );
    }

    return () => {
      if (cardRef.current) gsap.killTweensOf(cardRef.current);
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section || t.trigger === cardRef.current) t.kill();
      });
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setSheenPos({ x, y });
  };

  return (
    <section id="loyalty" ref={sectionRef} className="relative py-32 overflow-hidden">
      {/* Megacarte promotional background */}
      <div className="absolute inset-0">
        <Image
          src="/images/branding/megacarte.jpg"
          alt="Megacarte Loyalty Program"
          fill
          sizes="100vw"
          className="object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-mega-dark via-black/90 to-mega-dark" />
      </div>
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-mega-gold/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-mega-red/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-mega-gold" />
            <span className="text-xs tracking-[0.3em] text-mega-gold uppercase">
              Loyalty Program
            </span>
            <div className="w-12 h-[1px] bg-mega-gold" />
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight">
            MEGARAMA <span className="text-mega-gold">CLUB</span>
          </h2>
          <p className="text-lg text-white/40 mt-4">Your cinema rewards</p>
        </motion.div>

        {/* 3D Flipping Card */}
        <div className="flex justify-center mb-20">
          <div
            ref={cardRef}
            className="relative w-[380px] h-[240px] cursor-pointer"
            style={{ perspective: "1200px" }}
            onClick={() => setIsFlipped(!isFlipped)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setSheenPos({ x: 50, y: 50 })}
          >
            <motion.div
              className="relative w-full h-full"
              style={{ transformStyle: "preserve-3d" }}
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              {/* Front */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* Card background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
                {/* Metallic sheen */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at ${sheenPos.x}% ${sheenPos.y}%, rgba(212,168,83,0.2) 0%, transparent 50%)`,
                  }}
                />
                {/* Red accent stripe at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-mega-red via-mega-red to-transparent" />

                {/* Content */}
                <div className="relative h-full p-6 flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold tracking-[0.2em] text-white">
                      MEGARAMA
                    </span>
                    <div className="w-8 h-8 rounded-full bg-mega-gold/20 border border-mega-gold/40" />
                  </div>

                  <div>
                    <p className="text-mega-gold text-sm tracking-[0.3em] font-semibold mb-1">
                      GOLD MEMBER
                    </p>
                    <p className="text-white/80 text-base tracking-wide">
                      AHMED BENALI
                    </p>
                  </div>

                  <div className="flex items-end justify-between">
                    <span className="text-white/50 text-sm tracking-wider font-mono">
                      &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4829
                    </span>
                    <span className="text-xs text-white/30">MEMBER SINCE 2023</span>
                  </div>
                </div>
              </div>

              {/* Back */}
              <div
                className="absolute inset-0 rounded-2xl overflow-hidden"
                style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              >
                {/* Card background */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black" />
                {/* Metallic sheen */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at ${100 - sheenPos.x}% ${sheenPos.y}%, rgba(212,168,83,0.15) 0%, transparent 50%)`,
                  }}
                />

                {/* Content */}
                <div className="relative h-full p-6 flex gap-4">
                  {/* Benefits */}
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="text-xs tracking-[0.2em] text-mega-gold uppercase mb-3">
                      Benefits
                    </p>
                    <ul className="space-y-2">
                      {[
                        "10% off all tickets",
                        "Free popcorn upgrade",
                        "Priority booking",
                        "Exclusive premieres",
                      ].map((benefit) => (
                        <li
                          key={benefit}
                          className="text-sm text-white/70 flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-mega-gold inline-block" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* QR Code */}
                  <div className="flex flex-col items-center justify-center">
                    <QRCodePlaceholder />
                    <span className="text-[10px] text-white/30 mt-2 tracking-wider">
                      SCAN TO VERIFY
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Tap hint */}
            <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-white/30 tracking-wider">
              Click to flip
            </p>
          </div>
        </div>

        {/* Tier Levels */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-12 mb-16"
        >
          {tiers.map((tier) => (
            <div key={tier.name} className="flex flex-col items-center">
              <div className="relative">
                <ProgressRing
                  progress={tier.progress}
                  color={tier.color}
                  animated={ringsAnimated}
                />
                <span
                  className="absolute inset-0 flex items-center justify-center text-sm font-bold"
                  style={{ color: tier.color }}
                >
                  {tier.progress}%
                </span>
              </div>
              <span
                className="mt-3 text-sm font-semibold tracking-wider uppercase"
                style={{ color: tier.color }}
              >
                {tier.name}
              </span>
              {tier.name === "Gold" && (
                <span className="text-[10px] text-white/30 mt-1">Current Tier</span>
              )}
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <button className="px-10 py-4 bg-mega-gold text-mega-dark font-bold text-sm tracking-[0.2em] uppercase rounded-full hover:scale-105 hover:shadow-[0_0_40px_rgba(212,168,83,0.3)] transition-all duration-300">
            Join the Club
          </button>
        </motion.div>
      </div>
    </section>
  );
}
