"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const upcomingSessions = [
  { movie: "The Dark Horizon", minutesUntil: 47 },
  { movie: "Crimson Veil", minutesUntil: 82 },
  { movie: "Golden Empire", minutesUntil: 115 },
];

export default function LiveIndicator() {
  const [currentSessionIndex, setCurrentSessionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(upcomingSessions[0].minutesUntil * 60);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentSessionIndex]);

  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setCurrentSessionIndex((prev) => {
        const next = (prev + 1) % upcomingSessions.length;
        setTimeLeft(upcomingSessions[next].minutesUntil * 60);
        return next;
      });
    }, 12000);
    return () => clearInterval(rotateInterval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins} min ${secs.toString().padStart(2, "0")} sec`;
    }
    return `${secs} sec`;
  };

  const currentSession = upcomingSessions[currentSessionIndex];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 60 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mt-6 inline-flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6 px-5 py-3.5 rounded-2xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
        >
          {/* Live status */}
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
            </span>
            <span className="text-xs font-bold tracking-widest text-red-500 uppercase">
              LIVE
            </span>
            <span className="text-xs text-white/50">
              3 movies playing right now
            </span>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-[1px] h-5 bg-white/10" />

          {/* Countdown */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSessionIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <span className="text-xs text-white/40">
                {currentSession.movie} starts in
              </span>
              <span className="text-xs font-mono font-bold text-[#e31837]">
                {formatTime(timeLeft)}
              </span>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
