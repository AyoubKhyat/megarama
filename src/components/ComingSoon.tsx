"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const upcomingMovies = [
  {
    title: "Avatar: Fire & Ash",
    genre: "Sci-Fi / Adventure",
    releaseDate: "2026-06-20",
    poster: "/images/posters/mandalorian.jpg",
    tagline: "Return to Pandora",
  },
  {
    title: "The Batman II",
    genre: "Action / Crime",
    releaseDate: "2026-07-15",
    poster: "/images/posters/spiderman.jpg",
    tagline: "Fear is a tool",
  },
  {
    title: "Dune: Part Three",
    genre: "Sci-Fi / Drama",
    releaseDate: "2026-08-10",
    poster: "/images/posters/hero-4.jpg",
    tagline: "The saga concludes",
  },
];

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, mins: 0 });

  useEffect(() => {
    const calculate = () => {
      const diff = new Date(targetDate).getTime() - Date.now();
      if (diff <= 0) return { days: 0, hours: 0, mins: 0 };
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        mins: Math.floor((diff / (1000 * 60)) % 60),
      };
    };

    setTimeLeft(calculate());
    const interval = setInterval(() => setTimeLeft(calculate()), 60000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="flex gap-3">
      {[
        { value: timeLeft.days, label: "Days" },
        { value: timeLeft.hours, label: "Hrs" },
        { value: timeLeft.mins, label: "Min" },
      ].map((unit) => (
        <div key={unit.label} className="text-center">
          <div className="w-12 h-12 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
            <span className="text-lg font-bold text-white">{unit.value}</span>
          </div>
          <span className="text-[9px] text-white/40 uppercase tracking-wider mt-1 block">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function ComingSoon() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} className="relative py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-mega-red/[0.02] to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-mega-gold" />
            <span className="text-xs tracking-[0.3em] text-mega-gold uppercase">
              Upcoming
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
            COMING <span className="text-mega-gold">SOON</span>
          </h2>
        </motion.div>

        {/* Movie cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {upcomingMovies.map((movie, i) => (
            <motion.div
              key={movie.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group relative"
            >
              <div className="relative h-[320px] md:h-[380px] rounded-2xl overflow-hidden border border-white/10 hover:border-mega-gold/30 transition-all duration-500">
                <Image
                  src={movie.poster}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                {/* Coming soon badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-mega-gold/20 border border-mega-gold/40 backdrop-blur-sm">
                  <span className="text-mega-gold text-[10px] font-bold tracking-wider uppercase">
                    Coming Soon
                  </span>
                </div>

                {/* Bottom content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <p className="text-[10px] text-mega-gold/80 uppercase tracking-wider mb-1">
                    {movie.tagline}
                  </p>
                  <h3 className="text-lg font-bold text-white mb-1">
                    {movie.title}
                  </h3>
                  <p className="text-xs text-white/50 mb-4">{movie.genre}</p>
                  <CountdownTimer targetDate={movie.releaseDate} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
