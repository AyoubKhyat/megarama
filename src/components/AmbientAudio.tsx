"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SectionType = "hero" | "imax" | "snacks" | "default";

interface AudioParams {
  frequency: number;
  modRate: number;
  modDepth: number;
  gain: number;
}

const SECTION_PARAMS: Record<SectionType, AudioParams> = {
  hero: { frequency: 50, modRate: 0.3, modDepth: 5, gain: 0.12 },
  imax: { frequency: 40, modRate: 0.15, modDepth: 8, gain: 0.18 },
  snacks: { frequency: 72, modRate: 0.5, modDepth: 3, gain: 0.08 },
  default: { frequency: 55, modRate: 0.25, modDepth: 4, gain: 0.1 },
};

const FADE_DURATION = 0.8; // seconds

export default function AmbientAudio() {
  const [isMuted, setIsMuted] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const lfoRef = useRef<OscillatorNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const currentSectionRef = useRef<SectionType>("hero");
  const targetGainRef = useRef(0.12);
  const scrollGainRef = useRef<GainNode | null>(null);
  const lastScrollYRef = useRef(0);
  const scrollRafRef = useRef<number | null>(null);

  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;

    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    // Main oscillator (drone)
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = SECTION_PARAMS.hero.frequency;
    oscillatorRef.current = osc;

    // LFO for frequency modulation
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = SECTION_PARAMS.hero.modRate;
    lfoRef.current = lfo;

    const lfoGain = ctx.createGain();
    lfoGain.gain.value = SECTION_PARAMS.hero.modDepth;
    lfoGainRef.current = lfoGain;

    // Section gain node
    const gainNode = ctx.createGain();
    gainNode.gain.value = SECTION_PARAMS.hero.gain;
    gainNodeRef.current = gainNode;

    // Scroll-speed gain node
    const scrollGain = ctx.createGain();
    scrollGain.gain.value = 1.0;
    scrollGainRef.current = scrollGain;

    // Master gain (for mute/unmute fade)
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0; // starts silent
    masterGainRef.current = masterGain;

    // Connect: LFO -> lfoGain -> osc.frequency
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);

    // Connect: osc -> gainNode -> scrollGain -> masterGain -> destination
    osc.connect(gainNode);
    gainNode.connect(scrollGain);
    scrollGain.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Start oscillators
    osc.start();
    lfo.start();

    setIsInitialized(true);
  }, []);

  const fadeIn = useCallback(() => {
    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(1.0, ctx.currentTime + FADE_DURATION);
  }, []);

  const fadeOut = useCallback(() => {
    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (!ctx || !masterGain) return;

    masterGain.gain.cancelScheduledValues(ctx.currentTime);
    masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + FADE_DURATION);
  }, []);

  const transitionToSection = useCallback((section: SectionType) => {
    const ctx = audioCtxRef.current;
    const osc = oscillatorRef.current;
    const lfo = lfoRef.current;
    const lfoGain = lfoGainRef.current;
    const gainNode = gainNodeRef.current;
    if (!ctx || !osc || !lfo || !lfoGain || !gainNode) return;

    const params = SECTION_PARAMS[section];
    const now = ctx.currentTime;
    const transitionTime = 1.5;

    osc.frequency.cancelScheduledValues(now);
    osc.frequency.setValueAtTime(osc.frequency.value, now);
    osc.frequency.linearRampToValueAtTime(params.frequency, now + transitionTime);

    lfo.frequency.cancelScheduledValues(now);
    lfo.frequency.setValueAtTime(lfo.frequency.value, now);
    lfo.frequency.linearRampToValueAtTime(params.modRate, now + transitionTime);

    lfoGain.gain.cancelScheduledValues(now);
    lfoGain.gain.setValueAtTime(lfoGain.gain.value, now);
    lfoGain.gain.linearRampToValueAtTime(params.modDepth, now + transitionTime);

    gainNode.gain.cancelScheduledValues(now);
    gainNode.gain.setValueAtTime(gainNode.gain.value, now);
    gainNode.gain.linearRampToValueAtTime(params.gain, now + transitionTime);

    targetGainRef.current = params.gain;
    currentSectionRef.current = section;
  }, []);

  const handleToggle = useCallback(() => {
    if (!isInitialized) {
      initAudio();
      setIsMuted(false);
      // Small delay to ensure audio context is ready
      setTimeout(() => {
        fadeIn();
      }, 50);
      return;
    }

    if (isMuted) {
      if (audioCtxRef.current?.state === "suspended") {
        audioCtxRef.current.resume();
      }
      fadeIn();
    } else {
      fadeOut();
    }
    setIsMuted(!isMuted);
  }, [isMuted, isInitialized, initAudio, fadeIn, fadeOut]);

  // IntersectionObserver for section detection
  useEffect(() => {
    const sectionMap: { selector: string; type: SectionType }[] = [
      { selector: "[data-section='hero'], #hero, section:first-of-type", type: "hero" },
      { selector: "[data-section='imax'], #imax", type: "imax" },
      { selector: "[data-section='snacks'], #snacks", type: "snacks" },
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
            const el = entry.target;
            for (const mapping of sectionMap) {
              if (el.matches(mapping.selector)) {
                if (currentSectionRef.current !== mapping.type) {
                  transitionToSection(mapping.type);
                }
                return;
              }
            }
            // Default if no specific match
            if (currentSectionRef.current !== "default") {
              transitionToSection("default");
            }
          }
        });
      },
      { threshold: [0.3, 0.6] }
    );

    // Observe all main sections
    const timer = setTimeout(() => {
      const sections = document.querySelectorAll("main > section, main > div > section");
      sections.forEach((section) => observer.observe(section));
    }, 1000);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [transitionToSection]);

  // Scroll speed -> volume modulation
  useEffect(() => {
    let lastTime = performance.now();

    const handleScroll = () => {
      if (scrollRafRef.current) return;

      scrollRafRef.current = requestAnimationFrame(() => {
        const now = performance.now();
        const dt = (now - lastTime) / 1000;
        lastTime = now;

        const currentY = window.scrollY;
        const dy = Math.abs(currentY - lastScrollYRef.current);
        lastScrollYRef.current = currentY;

        // Calculate scroll speed (pixels/second)
        const speed = dt > 0 ? dy / dt : 0;

        // Map speed to gain multiplier (1.0 at rest, up to 1.4 at fast scroll)
        const scrollMultiplier = Math.min(1.0 + speed / 3000, 1.4);

        const ctx = audioCtxRef.current;
        const scrollGain = scrollGainRef.current;
        if (ctx && scrollGain) {
          scrollGain.gain.cancelScheduledValues(ctx.currentTime);
          scrollGain.gain.setValueAtTime(scrollGain.gain.value, ctx.currentTime);
          scrollGain.gain.linearRampToValueAtTime(scrollMultiplier, ctx.currentTime + 0.1);
        }

        scrollRafRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollRafRef.current) {
        cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      const ctx = audioCtxRef.current;
      if (ctx) {
        ctx.close();
        audioCtxRef.current = null;
      }
    };
  }, []);

  return (
    <motion.button
      onClick={handleToggle}
      className="fixed bottom-6 right-6 z-[9997] flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-xl transition-colors hover:bg-white/20"
      aria-label={isMuted ? "Unmute ambient audio" : "Mute ambient audio"}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Pulse ring when unmuted */}
      <AnimatePresence>
        {!isMuted && isInitialized && (
          <motion.span
            className="absolute inset-0 rounded-full border border-white/30"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 1.6, opacity: 0 }}
            exit={{ scale: 1, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </AnimatePresence>

      {/* Speaker icon */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-white"
      >
        {/* Speaker body */}
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />

        {/* Sound waves or mute line */}
        <AnimatePresence mode="wait">
          {isMuted ? (
            <motion.line
              key="mute-line"
              x1="23"
              y1="9"
              x2="17"
              y2="15"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              exit={{ pathLength: 0 }}
              transition={{ duration: 0.3 }}
            />
          ) : (
            <motion.g
              key="sound-waves"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
    </motion.button>
  );
}
