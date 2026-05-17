"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const snacks = [
  {
    name: "Mega Popcorn",
    description: "Freshly popped, buttery perfection in every bucket.",
    price: "35 MAD",
    emoji: "🍿",
    size: "Large Bucket",
  },
  {
    name: "Cinema Combo",
    description: "Large popcorn + drink + candy. The ultimate combo.",
    price: "65 MAD",
    emoji: "🎬",
    size: "Full Combo",
  },
  {
    name: "Ice Cold Drinks",
    description: "Refreshing beverages from classic cola to fresh juice.",
    price: "25 MAD",
    emoji: "🥤",
    size: "500ml",
  },
  {
    name: "Nachos Supreme",
    description: "Crispy nachos with warm cheese sauce and jalapeños.",
    price: "40 MAD",
    emoji: "🧀",
    size: "Sharing Size",
  },
  {
    name: "Candy Selection",
    description: "Premium imported chocolates and gummy treats.",
    price: "20 MAD",
    emoji: "🍫",
    size: "Premium Pack",
  },
  {
    name: "Hot Dog Deluxe",
    description: "All-beef hot dog with your choice of toppings.",
    price: "45 MAD",
    emoji: "🌭",
    size: "King Size",
  },
];

export default function SnacksSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cards = sectionRef.current?.querySelectorAll(".snack-card");
    if (!cards) return;

    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { y: 60, opacity: 0, rotateX: 10 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          duration: 0.7,
          delay: i * 0.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          },
        }
      );
    });
  }, []);

  return (
    <section id="snacks" ref={sectionRef} className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-mega-dark via-black to-mega-dark" />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-amber-900/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-mega-red/5 rounded-full blur-[100px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-12 items-end mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-[1px] bg-mega-red" />
              <span className="text-xs tracking-[0.3em] text-mega-red uppercase">
                Food &amp; Drinks
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
              SNACKS &<br />
              <span className="text-mega-red">TREATS</span>
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:text-right"
          >
            <p className="text-lg text-white/40 max-w-md lg:ml-auto">
              Elevate your cinema experience with our premium selection of snacks,
              crafted to make every movie even better.
            </p>
          </motion.div>
        </div>

        {/* Floating hero snack */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mb-16 p-8 md:p-12 glass-card overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-mega-red/5 via-transparent to-amber-900/5" />
          <div className="relative flex flex-col md:flex-row items-center gap-8">
            <motion.div
              animate={{ y: [-10, 10, -10], rotate: [-2, 2, -2] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="text-8xl md:text-[120px]"
            >
              🍿
            </motion.div>
            <div className="text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-bold mb-3">
                The Mega <span className="text-mega-red">Bucket</span>
              </h3>
              <p className="text-white/50 mb-4 max-w-md">
                Our signature oversized popcorn bucket — perfect for sharing
                (or not). Freshly popped with real butter.
              </p>
              <div className="flex items-center gap-4 justify-center md:justify-start">
                <span className="text-2xl font-bold text-mega-gold">55 MAD</span>
                <button className="px-6 py-2 bg-mega-red text-white text-xs tracking-widest uppercase rounded-full hover:bg-mega-red-dark transition-all">
                  Add to Order
                </button>
              </div>
            </div>
            <motion.div
              animate={{ y: [5, -5, 5], rotate: [3, -3, 3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="text-6xl md:text-8xl hidden md:block"
            >
              🥤
            </motion.div>
          </div>
        </motion.div>

        {/* Snack grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {snacks.map((snack) => (
            <div
              key={snack.name}
              className="snack-card glass-card p-6 group hover:scale-[1.02] transition-all duration-300 hover:border-mega-gold/20"
              style={{ perspective: "1000px" }}
            >
              <div className="flex items-start justify-between mb-4">
                <motion.span
                  className="text-4xl"
                  whileHover={{ scale: 1.3, rotate: 10 }}
                  transition={{ type: "spring" }}
                >
                  {snack.emoji}
                </motion.span>
                <span className="text-mega-gold font-bold">{snack.price}</span>
              </div>
              <h3 className="text-lg font-bold mb-1 group-hover:text-mega-red transition-colors">
                {snack.name}
              </h3>
              <p className="text-sm text-white/40 mb-3">{snack.description}</p>
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <span className="text-xs text-white/30 tracking-wider">
                  {snack.size}
                </span>
                <button className="text-xs text-mega-red hover:text-white tracking-wider transition-all hover:bg-mega-red/20 px-3 py-1 rounded-full">
                  ADD +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
