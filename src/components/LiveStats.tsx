"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { label: "Tickets Sold Today", target: 2847, prefix: "", suffix: "+" },
  { label: "Happy Visitors This Week", target: 18420, prefix: "", suffix: "" },
  { label: "Average Rating", target: 4.6, prefix: "", suffix: "/5" },
  { label: "Movies Showing", target: 12, prefix: "", suffix: "" },
];

function AnimatedCounter({
  target,
  prefix,
  suffix,
  inView,
}: {
  target: number;
  prefix: string;
  suffix: string;
  inView: boolean;
}) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const isDecimal = target % 1 !== 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      current = target * eased;

      if (step >= steps) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(isDecimal ? parseFloat(current.toFixed(1)) : Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, target]);

  const display = target % 1 !== 0 ? count.toFixed(1) : count.toLocaleString();

  return (
    <span className="text-3xl md:text-4xl font-bold text-white">
      {prefix}{display}{suffix}
    </span>
  );
}

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
                prefix={stat.prefix}
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
