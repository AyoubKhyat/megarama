"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import AnimatedCounter from "@/components/AnimatedCounter";

const stats = [
  { label: "Tickets Sold Today", target: 2847, suffix: "+" },
  { label: "Happy Visitors This Week", target: 18420, suffix: "" },
  { label: "Average Rating", target: 4.6, suffix: "/5" },
  { label: "Movies Showing", target: 12, suffix: "" },
];

export default function LiveStats() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="relative py-16 md:py-20">
      <div className="absolute inset-0 bg-gradient-to-r from-mega-red/5 via-transparent to-mega-red/5 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <AnimatedCounter
                target={stat.target}
                suffix={stat.suffix}
                inView={inView}
              />
              <p className="text-xs text-white/40 mt-2 tracking-wider uppercase">
                {stat.label}
              </p>
              {stat.label === "Tickets Sold Today" && (
                <div className="flex items-center justify-center gap-1 mt-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] text-green-400/80">Live</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
