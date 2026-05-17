"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LiveIndicator from "@/components/LiveIndicator";
import { useBooking } from "@/context/BookingContext";
import { movies, type Movie } from "@/data/movies";
import { useTranslation } from "@/i18n";

gsap.registerPlugin(ScrollTrigger);

function MovieCard({
  movie,
  index,
}: {
  movie: Movie;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const { selectMovie } = useBooking();
  const t = useTranslation();

  const handleBookShowtime = (time: string) => {
    selectMovie({ title: movie.title, poster: movie.poster, showtime: time });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(cardRef.current, {
      rotateY: x * 15,
      rotateX: -y * 15,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (!cardRef.current) return;
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.6,
      ease: "power2.out",
    });
  };

  return (
    <div
      className="movie-card flex-shrink-0 w-[280px] sm:w-[320px] md:w-[360px]"
      style={{ perspective: "1000px" }}
      data-index={index}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative group select-none"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Poster */}
        <div
          className={`relative h-[380px] sm:h-[420px] md:h-[460px] rounded-2xl overflow-hidden bg-gradient-to-br ${movie.color} to-black border border-white/10 transition-all duration-500 ${isHovered ? "border-[#e31837]/50 shadow-[0_0_40px_rgba(227,24,55,0.3)]" : ""}`}
        >
          <Image
            src={movie.poster}
            alt={movie.title}
            fill
            sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, 360px"
            className="object-cover pointer-events-none"
            draggable={false}
          />

          {/* Play button overlay on hover */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black/60 flex items-center justify-center"
            style={{ pointerEvents: isHovered ? "auto" : "none" }}
          >
            <motion.button
              animate={isHovered ? { scale: [0.8, 1] } : { scale: 0.8 }}
              transition={{ duration: 0.3 }}
              className="w-18 h-18 rounded-full bg-[#e31837]/90 flex items-center justify-center backdrop-blur-sm border-2 border-white/20 hover:bg-[#e31837] transition-colors cursor-pointer"
              aria-label={`${t.nowShowing.playTrailer} ${movie.title}`}
            >
              <svg
                className="w-7 h-7 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M6.3 2.8A1.5 1.5 0 004 4.1v11.8a1.5 1.5 0 002.3 1.3l9.3-5.9a1.5 1.5 0 000-2.6L6.3 2.8z" />
              </svg>
            </motion.button>
          </motion.div>

          {/* Rating badge */}
          <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 backdrop-blur-sm border border-white/10">
            <span className="text-mega-gold text-sm font-bold">
              ★ {movie.rating}
            </span>
          </div>

          {/* Bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent">
            <h3 className="text-lg md:text-xl font-bold text-white mb-1">{movie.title}</h3>
            <div className="flex items-center gap-3 text-xs text-white/50">
              <span className="neon-glow">{movie.genre}</span>
              <span className="w-1 h-1 rounded-full bg-mega-red" />
              <span className="neon-glow">{movie.duration}</span>
            </div>
          </div>
        </div>

        {/* Info card below */}
        <div className="mt-4 p-4 glass-card rounded-xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-white/40 tracking-wider uppercase">
              {movie.language}
            </span>
            <span className="text-xs text-mega-red tracking-wider neon-glow">
              {movie.genre.split(" / ")[0]}
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {movie.showtimes.map((time) => (
              <button
                key={time}
                onClick={() => handleBookShowtime(time)}
                className="px-3 py-1.5 text-xs text-white/70 bg-white/5 rounded-lg border border-white/10 hover:border-[#e31837]/50 hover:text-[#e31837] hover:bg-[#e31837]/10 transition-all duration-300 cursor-pointer"
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NowShowing() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, scrollLeft: 0, isDown: false });
  const t = useTranslation();

  const updateScrollState = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) {
      setScrollProgress(0);
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }
    const progress = track.scrollLeft / maxScroll;
    setScrollProgress(progress);
    setCanScrollLeft(track.scrollLeft > 10);
    setCanScrollRight(track.scrollLeft < maxScroll - 10);
  }, []);

  const scrollBy = useCallback((direction: "left" | "right") => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.querySelector(".movie-card")?.clientWidth || 360;
    const scrollAmount = direction === "left" ? -(cardWidth + 32) : cardWidth + 32;
    track.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll(".char");
      gsap.fromTo(
        chars,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.04,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: titleRef.current,
            start: "top 85%",
          },
        }
      );
    }
  }, []);

  // Horizontal wheel scrolling
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handleWheel = (e: WheelEvent) => {
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (maxScroll <= 0) return;

      const atStart = track.scrollLeft <= 0;
      const atEnd = track.scrollLeft >= maxScroll - 1;

      if (e.deltaY !== 0) {
        if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) {
          return;
        }
        e.preventDefault();
        track.scrollLeft += e.deltaY;
      }
    };

    track.addEventListener("wheel", handleWheel, { passive: false });
    track.addEventListener("scroll", updateScrollState, { passive: true });
    updateScrollState();

    return () => {
      track.removeEventListener("wheel", handleWheel);
      track.removeEventListener("scroll", updateScrollState);
    };
  }, [updateScrollState]);

  // Drag/swipe support
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a")) return;

      dragState.current = {
        startX: e.pageX - track.offsetLeft,
        scrollLeft: track.scrollLeft,
        isDown: true,
      };
      setIsDragging(false);
      track.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!dragState.current.isDown) return;
      const x = e.pageX - track.offsetLeft;
      const walk = x - dragState.current.startX;
      if (Math.abs(walk) > 5) {
        setIsDragging(true);
      }
      track.scrollLeft = dragState.current.scrollLeft - walk;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!dragState.current.isDown) return;
      dragState.current.isDown = false;
      track.releasePointerCapture(e.pointerId);
      setTimeout(() => setIsDragging(false), 50);
    };

    track.addEventListener("pointerdown", handlePointerDown);
    track.addEventListener("pointermove", handlePointerMove);
    track.addEventListener("pointerup", handlePointerUp);
    track.addEventListener("pointercancel", handlePointerUp);

    return () => {
      track.removeEventListener("pointerdown", handlePointerDown);
      track.removeEventListener("pointermove", handlePointerMove);
      track.removeEventListener("pointerup", handlePointerUp);
      track.removeEventListener("pointercancel", handlePointerUp);
    };
  }, []);

  return (
    <section id="now-showing" ref={sectionRef} className="relative py-20 md:py-32">
      {/* Section background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#e31837]/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-10">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="w-12 h-[1px] bg-mega-red" />
          <span className="text-xs tracking-[0.3em] text-mega-red uppercase">
            {t.nowShowing.label}
          </span>
        </motion.div>

        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <div ref={titleRef} className="overflow-hidden">
              <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
                {t.nowShowing.title.split("").map((char, i) => (
                  <span
                    key={i}
                    className="char inline-block"
                    style={{ whiteSpace: char === " " ? "pre" : undefined }}
                  >
                    {char === " " ? " " : char}
                  </span>
                ))}
              </h2>
            </div>
            <LiveIndicator />
          </div>

          {/* Navigation arrows - desktop */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => scrollBy("left")}
              disabled={!canScrollLeft}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 hover:border-[#e31837]/50 hover:bg-[#e31837]/10 disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:bg-transparent cursor-pointer"
              aria-label={t.nowShowing.scrollLeft}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => scrollBy("right")}
              disabled={!canScrollRight}
              className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 hover:border-[#e31837]/50 hover:bg-[#e31837]/10 disabled:opacity-30 disabled:hover:border-white/10 disabled:hover:bg-transparent cursor-pointer"
              aria-label={t.nowShowing.scrollRight}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Carousel track */}
      <div
        ref={trackRef}
        className={`carousel-track flex gap-6 md:gap-8 px-6 md:px-12 pb-8 overflow-x-auto scroll-smooth ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {movies.map((movie, i) => (
          <MovieCard key={movie.title} movie={movie} index={i} />
        ))}
        {/* End spacer so last card isn't cut off */}
        <div className="flex-shrink-0 w-6 md:w-12" aria-hidden="true" />
      </div>

      {/* Progress indicator + mobile arrows */}
      <div className="max-w-7xl mx-auto px-6 mt-8 flex items-center gap-4">
        {/* Mobile arrows */}
        <button
          onClick={() => scrollBy("left")}
          disabled={!canScrollLeft}
          className="md:hidden w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 disabled:opacity-30 cursor-pointer"
          aria-label={t.nowShowing.scrollLeft}
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Progress bar */}
        <div className="flex-1 h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#e31837] rounded-full transition-transform duration-150 ease-out origin-left"
            style={{ transform: `scaleX(${Math.max(0.02, scrollProgress)})` }}
          />
        </div>

        {/* Mobile arrows */}
        <button
          onClick={() => scrollBy("right")}
          disabled={!canScrollRight}
          className="md:hidden w-10 h-10 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 disabled:opacity-30 cursor-pointer"
          aria-label={t.nowShowing.scrollRight}
        >
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </section>
  );
}
