"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const notifications = [
  {
    name: "Ahmed",
    message: "just booked 2 seats for The Dark Horizon",
    color: "bg-blue-500",
  },
  {
    name: "Fatima",
    message: "rated Golden Empire ★★★★★",
    color: "bg-pink-500",
  },
  {
    name: "12 people",
    message: "viewing Crimson Veil right now",
    color: "bg-purple-500",
    isGroup: true,
  },
  {
    name: "Youssef",
    message: "booked IMAX seats for tonight",
    color: "bg-emerald-500",
  },
  {
    name: "Nadia",
    message: "added Mega Combo to her order",
    color: "bg-amber-500",
  },
  {
    name: "Khalid",
    message: "just checked in at Salle 4",
    color: "bg-cyan-500",
  },
  {
    name: "Sara",
    message: "booked 4 seats for Whispers of Atlas",
    color: "bg-rose-500",
  },
];

export default function SocialProof() {
  const [currentNotification, setCurrentNotification] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const showNext = useCallback(() => {
    const next = Math.floor(Math.random() * notifications.length);
    setCurrentNotification(next);
    setIsVisible(true);

    // Hide after 4 seconds
    setTimeout(() => {
      setIsVisible(false);
    }, 4000);
  }, []);

  useEffect(() => {
    if (isDismissed) return;

    // Initial delay of 10 seconds before first notification
    const initialDelay = setTimeout(() => {
      showNext();
    }, 10000);

    return () => clearTimeout(initialDelay);
  }, [isDismissed, showNext]);

  useEffect(() => {
    if (isDismissed) return;

    // Show new notification every 8-10 seconds after the first one
    const interval = setInterval(() => {
      showNext();
    }, 8000 + Math.random() * 2000);

    return () => clearInterval(interval);
  }, [isDismissed, showNext]);

  if (isDismissed) return null;

  const notification = currentNotification !== null ? notifications[currentNotification] : null;

  return (
    <div className="fixed bottom-20 left-6 z-[9996]">
      <AnimatePresence>
        {isVisible && notification && (
          <motion.div
            initial={{ opacity: 0, y: 40, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="relative flex items-center gap-3 px-4 py-3 pr-9 rounded-2xl bg-white/[0.06] backdrop-blur-xl border border-white/[0.1] shadow-[0_8px_32px_rgba(0,0,0,0.5)] max-w-[340px]"
          >
            {/* Avatar */}
            <div
              className={`flex-shrink-0 w-9 h-9 rounded-full ${notification.color} flex items-center justify-center`}
            >
              <span className="text-white text-sm font-bold">
                {notification.isGroup ? "👥" : notification.name[0]}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-white/80 leading-relaxed">
                <span className="font-semibold text-white">
                  {notification.name}
                </span>{" "}
                {notification.message}
              </p>
              <p className="text-[10px] text-white/30 mt-0.5">Just now</p>
            </div>

            {/* Dismiss button */}
            <button
              onClick={() => setIsDismissed(true)}
              className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center rounded-full text-white/30 hover:text-white/70 hover:bg-white/10 transition-colors"
              aria-label="Dismiss notifications"
            >
              <svg
                className="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
