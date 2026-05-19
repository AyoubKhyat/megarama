"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useBooking } from "@/context/BookingContext";
import { useTranslation } from "@/i18n";

function CinemaHall3DLoading() {
  const t = useTranslation();
  return (
    <div className="w-full h-[500px] md:h-[600px] rounded-2xl border border-white/10 bg-black flex items-center justify-center">
      <div className="text-white/40 text-sm tracking-wider animate-pulse">{t.booking.loading3D}</div>
    </div>
  );
}

const CinemaHall3D = dynamic(() => import("@/components/CinemaHall3D"), {
  ssr: false,
  loading: () => <CinemaHall3DLoading />,
});

function generateDates(): { day: string; date: string }[] {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return Array.from({ length: 5 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      day: i === 0 ? "Today" : days[d.getDay()],
      date: `${d.getDate()} ${months[d.getMonth()]}`,
    };
  });
}

const baseDates = generateDates();

const sessions = ["14:30", "17:00", "19:30", "21:00", "23:30"];

const seatRows = [
  { row: "A", seats: 8 },
  { row: "B", seats: 10 },
  { row: "C", seats: 12 },
  { row: "D", seats: 12 },
  { row: "E", seats: 14 },
  { row: "F", seats: 14 },
  { row: "G", seats: 12 },
  { row: "H", seats: 10 },
];

const takenSeats = ["A3", "A4", "B5", "B6", "C8", "D2", "D3", "E7", "E8", "E9", "F1", "G10", "H5"];

/* Jagged tear SVG path for clip-path */
function TornEdgeSVG() {
  return (
    <svg width="0" height="0" className="absolute">
      <defs>
        <clipPath id="torn-edge-clip" clipPathUnits="objectBoundingBox">
          <path d="M0,0.02 L0.03,0 L0.06,0.025 L0.09,0.005 L0.12,0.03 L0.15,0.008 L0.18,0.028 L0.21,0.003 L0.24,0.022 L0.27,0.007 L0.30,0.032 L0.33,0.01 L0.36,0.027 L0.39,0.004 L0.42,0.025 L0.45,0.009 L0.48,0.03 L0.51,0.006 L0.54,0.028 L0.57,0.012 L0.60,0.032 L0.63,0.005 L0.66,0.024 L0.69,0.008 L0.72,0.03 L0.75,0.004 L0.78,0.026 L0.81,0.01 L0.84,0.028 L0.87,0.006 L0.90,0.025 L0.93,0.012 L0.96,0.03 L1,0.008 L1,1 L0,1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

/* Barcode component */
function Barcode() {
  const pattern = [2,1,1,2,1,2,2,1,1,1,2,1,2,1,1,2,2,1,2,1,1,2,1,1,2,1,2,2,1,1,2,1,1,2,1,2,1,1,2,1];
  return (
    <div className="flex items-center justify-center h-12 mt-2">
      {pattern.map((w, i) => (
        <div
          key={i}
          className="bg-mega-dark"
          style={{ width: `${w}px`, height: "100%", marginRight: "1px" }}
        />
      ))}
    </div>
  );
}

export default function BookingSection() {
  const { selectedMovie, clearMovie } = useBooking();
  const t = useTranslation();
  const dates = baseDates.map((d) =>
    d.day === "Today" ? { ...d, day: t.booking.today } : d
  );
  const [selectedDate, setSelectedDate] = useState(0);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [step, setStep] = useState(0);
  const [is3DView, setIs3DView] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [tearComplete, setTearComplete] = useState(false);

  const ticketRef = useRef<HTMLDivElement>(null);
  const rollRef = useRef<HTMLDivElement>(null);
  const checkRef = useRef<HTMLDivElement>(null);
  const shadowRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (selectedMovie) {
      setStep(1);
      if (selectedMovie.showtime) {
        setSelectedSession(selectedMovie.showtime);
        setStep(2);
      }
    }
  }, [selectedMovie]);

  const toggleSeat = (seatId: string) => {
    if (takenSeats.includes(seatId)) return;
    setSelectedSeats((prev) =>
      prev.includes(seatId)
        ? prev.filter((s) => s !== seatId)
        : [...prev, seatId]
    );
  };

  const handleConfirm = () => {
    if (selectedSeats.length === 0) return;
    setShowTicket(true);
    setTearComplete(false);
  };

  const handleClose = () => {
    setShowTicket(false);
    setTearComplete(false);
    setSelectedSeats([]);
    setSelectedSession(null);
    setStep(0);
    clearMovie();
  };

  const runTearAnimation = useCallback(() => {
    if (!ticketRef.current || !rollRef.current || !shadowRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => setTearComplete(true),
    });
    tlRef.current = tl;

    // Initial state: ticket attached to roll
    gsap.set(ticketRef.current, {
      y: -20,
      rotation: 0,
      opacity: 1,
      scale: 0.95,
    });
    gsap.set(rollRef.current, { opacity: 1, scaleX: 1 });
    gsap.set(shadowRef.current, { opacity: 0, scale: 0.9 });

    // Phase 1: Slight pull down - ticket starts tearing
    tl.to(ticketRef.current, {
      y: 10,
      rotation: -1.5,
      duration: 0.3,
      ease: "power2.out",
    });

    // Phase 2: Tear happens - quick downward motion with rotation
    tl.to(ticketRef.current, {
      y: 40,
      rotation: 2,
      scale: 1,
      duration: 0.4,
      ease: "power3.out",
    });

    // Roll recoils
    tl.to(
      rollRef.current,
      {
        scaleX: 0.9,
        opacity: 0.5,
        duration: 0.3,
        ease: "elastic.out(1, 0.5)",
      },
      "-=0.3"
    );

    // Shadow grows as ticket separates
    tl.to(
      shadowRef.current,
      {
        opacity: 0.4,
        scale: 1.05,
        duration: 0.5,
        ease: "power2.out",
      },
      "-=0.3"
    );

    // Phase 3: Ticket bounces and settles
    tl.to(ticketRef.current, {
      y: 20,
      rotation: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.4)",
    });

    // Roll fades away
    tl.to(
      rollRef.current,
      {
        opacity: 0,
        y: -30,
        duration: 0.4,
        ease: "power2.in",
      },
      "-=0.6"
    );

    // Phase 4: Gentle float/wobble
    tl.to(ticketRef.current, {
      y: 25,
      rotation: 0.5,
      duration: 1.5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: 1,
    });
  }, []);

  useEffect(() => {
    if (showTicket) {
      // Small delay to let the DOM render
      const timeout = setTimeout(runTearAnimation, 200);
      return () => clearTimeout(timeout);
    } else {
      if (tlRef.current) {
        tlRef.current.kill();
        tlRef.current = null;
      }
    }
  }, [showTicket, runTearAnimation]);

  return (
    <section id="booking" className="relative py-32 overflow-hidden">
      <TornEdgeSVG />
      <div className="absolute inset-0 bg-gradient-to-b from-mega-dark via-black to-mega-dark" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-mega-red/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-12 h-[1px] bg-mega-red" />
            <span className="text-xs tracking-[0.3em] text-mega-red uppercase">
              {t.booking.label}
            </span>
            <div className="w-12 h-[1px] bg-mega-red" />
          </div>
          <h2 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tight">
            {t.booking.title} <span className="text-mega-red">{t.booking.titleAccent}</span>
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Left: Seat map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-8"
          >
            {/* Selected movie banner */}
            <AnimatePresence>
              {selectedMovie && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  className="mb-6 p-4 rounded-xl bg-[#e31837]/10 border border-[#e31837]/30 flex items-center gap-4"
                >
                  <Image
                    src={selectedMovie.poster}
                    alt={selectedMovie.title}
                    width={48}
                    height={64}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-white">{selectedMovie.title}</p>
                    {selectedMovie.showtime && (
                      <p className="text-xs text-[#e31837] mt-0.5">{t.booking.session}: {selectedMovie.showtime}</p>
                    )}
                  </div>
                  <button
                    onClick={() => { clearMovie(); setStep(0); setSelectedSession(null); }}
                    className="text-white/40 hover:text-white transition-colors text-lg cursor-pointer"
                    aria-label={t.booking.clearSelection}
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Date selector */}
            <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
              {dates.map((d, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedDate(i); setStep(1); }}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl text-center transition-all duration-300 ${
                    selectedDate === i
                      ? "bg-mega-red text-white shadow-[0_0_20px_rgba(227,24,55,0.3)]"
                      : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}
                >
                  <div className="text-[10px] tracking-wider uppercase">{d.day}</div>
                  <div className="text-sm font-bold">{d.date}</div>
                </button>
              ))}
            </div>

            {/* Session selector */}
            <AnimatePresence>
              {step >= 1 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex gap-2 mb-8 flex-wrap"
                >
                  {[...new Set([...sessions, ...(selectedMovie?.showtime ? [selectedMovie.showtime] : [])])].sort().map((s) => (
                    <button
                      key={s}
                      onClick={() => { setSelectedSession(s); setStep(2); }}
                      className={`px-4 py-2 rounded-lg text-sm transition-all duration-300 ${
                        selectedSession === s
                          ? "bg-mega-red text-white neon-glow-box"
                          : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/10"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* View Toggle + Seat Map */}
            <AnimatePresence>
              {step >= 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  {/* 3D/2D Toggle Button */}
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={() => setIs3DView(!is3DView)}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs tracking-wider uppercase transition-all duration-300 bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        {is3DView ? (
                          <>
                            <rect x="3" y="3" width="18" height="18" rx="2" />
                            <line x1="3" y1="9" x2="21" y2="9" />
                            <line x1="9" y1="21" x2="9" y2="9" />
                          </>
                        ) : (
                          <>
                            <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9L12 3z" />
                            <path d="M12 12l8-4.5" />
                            <path d="M12 12v9" />
                            <path d="M12 12L4 7.5" />
                          </>
                        )}
                      </svg>
                      {is3DView ? t.booking.switchTo2D : t.booking.switchTo3D}
                    </button>
                  </div>

                  {is3DView ? (
                    /* 3D Cinema Hall */
                    <CinemaHall3D
                      selectedSeats={selectedSeats}
                      onSeatToggle={toggleSeat}
                      takenSeats={takenSeats}
                    />
                  ) : (
                    /* 2D Seat Map */
                    <>
                      <div className="relative mb-10">
                        <div className="w-3/4 mx-auto h-2 bg-gradient-to-r from-transparent via-mega-red/60 to-transparent rounded-full mb-2" />
                        <p className="text-center text-[10px] text-white/30 tracking-widest uppercase">
                          {t.booking.screen}
                        </p>
                      </div>

                      {/* Seats */}
                      <div className="flex flex-col items-center gap-2">
                        {seatRows.map((row) => (
                          <div key={row.row} className="flex items-center gap-2">
                            <span className="w-6 text-xs text-white/30 text-right">
                              {row.row}
                            </span>
                            <div className="flex gap-1.5">
                              {Array.from({ length: row.seats }, (_, i) => {
                                const seatId = `${row.row}${i + 1}`;
                                const isTaken = takenSeats.includes(seatId);
                                const isSelected = selectedSeats.includes(seatId);
                                return (
                                  <button
                                    key={seatId}
                                    onClick={() => toggleSeat(seatId)}
                                    disabled={isTaken}
                                    aria-label={`Seat ${seatId}${isTaken ? ", taken" : isSelected ? ", selected" : ""}`}
                                    className={`seat ${
                                      isTaken
                                        ? "seat-taken"
                                        : isSelected
                                          ? "seat-selected"
                                          : "seat-available"
                                    }`}
                                  />
                                );
                              })}
                            </div>
                            <span className="w-6 text-xs text-white/30">
                              {row.row}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Legend */}
                      <div className="flex items-center justify-center gap-6 mt-6">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded seat-available" />
                          <span className="text-xs text-white/40">{t.booking.available}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded seat-selected" />
                          <span className="text-xs text-white/40">{t.booking.selected}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded seat-taken" />
                          <span className="text-xs text-white/40">{t.booking.taken}</span>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Right: Checkout card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass-card p-6 h-fit sticky top-24"
          >
            <h3 className="text-lg font-bold mb-6 tracking-wider">
              {t.booking.yourBooking}
            </h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-xs text-white/40 uppercase tracking-wider">{t.booking.movie}</span>
                <span className="text-sm">{selectedMovie?.title || t.booking.selectMovie}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-xs text-white/40 uppercase tracking-wider">{t.booking.date}</span>
                <span className="text-sm">{dates[selectedDate].date}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-xs text-white/40 uppercase tracking-wider">{t.booking.session}</span>
                <span className="text-sm">{selectedSession || "—"}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/5">
                <span className="text-xs text-white/40 uppercase tracking-wider">{t.booking.seats}</span>
                <span className="text-sm">
                  {selectedSeats.length > 0
                    ? selectedSeats.join(", ")
                    : "—"}
                </span>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-xl mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/60">{t.booking.total}</span>
                <span className="text-2xl font-bold text-mega-red">
                  {selectedSeats.length * 70} MAD
                </span>
              </div>
              <p className="text-[10px] text-white/30 mt-1">
                {selectedSeats.length} × 70 MAD {t.booking.perSeat}
              </p>
            </div>

            <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
              {selectedSeats.length > 0
                ? `${selectedSeats.length} seat${selectedSeats.length > 1 ? "s" : ""} selected: ${selectedSeats.join(", ")}`
                : "No seats selected"}
            </div>

            <button
              onClick={handleConfirm}
              disabled={selectedSeats.length === 0}
              className={`w-full py-4 rounded-xl text-sm tracking-widest uppercase font-bold transition-all duration-300 ${
                selectedSeats.length > 0
                  ? "bg-mega-red text-white hover:bg-mega-red-dark hover:shadow-[0_0_30px_rgba(227,24,55,0.4)]"
                  : "bg-white/5 text-white/30 cursor-not-allowed"
              }`}
            >
              {t.booking.confirmBooking}
            </button>
          </motion.div>
        </div>
      </div>

      {/* Ticket Confirmation Overlay */}
      <AnimatePresence>
        {showTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            onClick={(e) => {
              if (e.target === e.currentTarget && tearComplete) handleClose();
            }}
          >
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-black/85 backdrop-blur-sm" />

            {/* Content container */}
            <div className="relative flex flex-col items-center">
              {/* Ticket Roll (top) */}
              <div
                ref={rollRef}
                className="relative w-[280px] h-10 mb-0"
                style={{ opacity: 0 }}
              >
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-white/5 rounded-t-[50%] border border-white/10" />
                <div className="absolute bottom-0 left-0 right-0 h-3 bg-gradient-to-b from-white/10 to-transparent" />
                {/* Roll curve */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-[260px] h-6 border-t-2 border-white/20 rounded-t-[50%]" />
              </div>

              {/* Shadow beneath ticket */}
              <div
                ref={shadowRef}
                className="absolute top-[60%] left-1/2 -translate-x-1/2 w-[240px] h-[60px] bg-black/60 rounded-[50%] blur-xl"
                style={{ opacity: 0 }}
              />

              {/* The Ticket */}
              <div
                ref={ticketRef}
                className="relative w-[280px]"
                style={{
                  clipPath: "url(#torn-edge-clip)",
                  opacity: 0,
                }}
              >
                {/* Ticket body */}
                <div className="bg-gradient-to-b from-[#faf8f5] to-[#f0ece6] text-mega-dark rounded-b-xl overflow-hidden shadow-2xl">
                  {/* Top torn edge decoration */}
                  <div className="h-3 bg-gradient-to-b from-[#e8e4de] to-transparent" />

                  {/* Red header band */}
                  <div className="bg-mega-red px-5 py-4 text-center">
                    <h4 className="text-white text-sm font-bold tracking-[0.25em] uppercase">
                      Megarama Marrakech
                    </h4>
                    <div className="w-16 h-[1px] bg-white/40 mx-auto mt-2" />
                  </div>

                  {/* Ticket content */}
                  <div className="px-5 py-5 space-y-4">
                    {/* Movie name */}
                    <div className="text-center pb-4 border-b border-dashed border-mega-dark/20">
                      <p className="text-[10px] text-mega-dark/50 uppercase tracking-wider mb-1">
                        {t.booking.film}
                      </p>
                      <h5 className="text-lg font-bold text-mega-dark tracking-wide">
                        {selectedMovie?.title || "Movie"}
                      </h5>
                    </div>

                    {/* Details grid */}
                    <div className="grid grid-cols-2 gap-4 py-2">
                      <div>
                        <p className="text-[9px] text-mega-dark/40 uppercase tracking-wider">
                          {t.booking.date}
                        </p>
                        <p className="text-sm font-semibold mt-0.5">
                          {dates[selectedDate].date}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-mega-dark/40 uppercase tracking-wider">
                          {t.booking.time}
                        </p>
                        <p className="text-sm font-semibold mt-0.5">
                          {selectedSession}
                        </p>
                      </div>
                    </div>

                    <div className="py-2 border-t border-dashed border-mega-dark/20">
                      <p className="text-[9px] text-mega-dark/40 uppercase tracking-wider">
                        {t.booking.seats}
                      </p>
                      <p className="text-sm font-semibold mt-0.5">
                        {selectedSeats.join(", ")}
                      </p>
                    </div>

                    {/* Perforated line */}
                    <div className="flex items-center gap-1 py-2">
                      {Array.from({ length: 28 }, (_, i) => (
                        <div
                          key={i}
                          className="w-[6px] h-[1px] bg-mega-dark/20"
                        />
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-mega-dark/50 uppercase tracking-wider">
                        {t.booking.total}
                      </span>
                      <span className="text-xl font-bold text-mega-red">
                        {selectedSeats.length * 70} MAD
                      </span>
                    </div>

                    {/* Barcode */}
                    <div className="pt-3 border-t border-mega-dark/10">
                      <Barcode />
                      <p className="text-center text-[8px] text-mega-dark/30 mt-1 tracking-[0.2em]">
                        MGR-2026-{dates[selectedDate].date.replace(" ", "")}-
                        {selectedSession?.replace(":", "")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Success checkmark + Done button */}
              <AnimatePresence>
                {tearComplete && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="mt-8 flex flex-col items-center gap-4"
                    ref={checkRef}
                  >
                    {/* Checkmark circle */}
                    <div className="w-14 h-14 rounded-full border-2 border-mega-gold flex items-center justify-center">
                      <motion.svg
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#d4a853"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <motion.path
                          d="M5 13l4 4L19 7"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.6, delay: 0.2 }}
                        />
                      </motion.svg>
                    </div>

                    <p className="text-white/70 text-sm tracking-wider">
                      {t.booking.bookingConfirmed}
                    </p>

                    <button
                      onClick={handleClose}
                      className="mt-2 px-8 py-3 bg-mega-red text-white rounded-xl text-sm tracking-widest uppercase font-bold hover:bg-mega-red-dark hover:shadow-[0_0_30px_rgba(227,24,55,0.4)] transition-all duration-300"
                    >
                      {t.booking.done}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
