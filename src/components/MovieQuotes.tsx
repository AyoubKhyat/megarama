"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { quotes } from "@/data/quotes";

gsap.registerPlugin(ScrollTrigger);

export default function MovieQuotes() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quotesRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    quotesRef.current.forEach((quoteEl, i) => {
      if (!quoteEl) return;

      gsap.fromTo(
        quoteEl,
        { y: quotes[i].speed },
        {
          y: -quotes[i].speed,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill();
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[60vh] overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-mega-dark via-black to-mega-dark" />

      {/* Film reel decorative element */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative w-[500px] h-[500px]"
        >
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-white/5" />
          {/* Inner ring */}
          <div className="absolute inset-16 rounded-full border border-white/5" />
          {/* Center */}
          <div className="absolute inset-32 rounded-full border border-white/5" />
          {/* Spokes */}
          {[0, 45, 90, 135].map((deg) => (
            <div
              key={deg}
              className="absolute top-1/2 left-1/2 w-full h-[1px] bg-white/5 origin-left"
              style={{ transform: `rotate(${deg}deg) translateX(-50%)`, marginLeft: "-50%" }}
            />
          ))}
          {/* Sprocket holes */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-4 h-4 rounded-full border border-white/5"
              style={{
                top: `${50 + 45 * Math.sin((i * 30 * Math.PI) / 180)}%`,
                left: `${50 + 45 * Math.cos((i * 30 * Math.PI) / 180)}%`,
                transform: "translate(-50%, -50%)",
              }}
            />
          ))}
        </motion.div>
      </div>

      {/* Floating quotes */}
      {quotes.map((quote, i) => (
        <div
          key={i}
          ref={(el) => { quotesRef.current[i] = el; }}
          className="absolute"
          style={{ left: quote.x, top: quote.y }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.8 }}
            className="max-w-xs md:max-w-md"
          >
            <p className={`${quote.size} ${quote.opacity} italic font-light leading-tight`}>
              &ldquo;{quote.text}&rdquo;
            </p>
            <span className="text-xs text-white/20 tracking-widest uppercase mt-1 block">
              &mdash; {quote.film}
            </span>
          </motion.div>
        </div>
      ))}
    </section>
  );
}
