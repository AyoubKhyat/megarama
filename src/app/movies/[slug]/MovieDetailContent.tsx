"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import TrailerModal from "@/components/TrailerModal";
import { useBooking } from "@/context/BookingContext";
import { useTranslation } from "@/i18n";
import type { Movie } from "@/data/movies";

export default function MovieDetailContent({ movie }: { movie: Movie }) {
  const [trailerOpen, setTrailerOpen] = useState(false);
  const { selectMovie } = useBooking();
  const t = useTranslation();

  const handleBookShowtime = (time: string) => {
    selectMovie({ title: movie.title, poster: movie.poster, showtime: time });
  };

  return (
    <>
      <Navbar />

      {/* Back link */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="fixed top-24 left-6 z-40"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-white/70 hover:text-white hover:border-white/30 transition-all duration-300 text-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          {t.movieDetail.backToHome}
        </Link>
      </motion.div>

      {/* Full-bleed hero */}
      <section className="relative h-[70vh] min-h-[500px] max-h-[800px] w-full overflow-hidden">
        <Image
          src={movie.poster}
          alt={movie.title}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {/* Dark gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-mega-dark via-mega-dark/60 to-transparent" />
        <div className={`absolute inset-0 bg-gradient-to-br ${movie.color} to-transparent opacity-40`} />

        {/* Movie info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full bg-[#e31837]/20 border border-[#e31837]/40 text-[#e31837] text-xs font-semibold tracking-wider uppercase">
                  {movie.genre}
                </span>
                <span className="px-3 py-1 rounded-full bg-mega-gold/20 border border-mega-gold/40 text-mega-gold text-sm font-bold">
                  ★ {movie.rating}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 tracking-tight">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm">
                <span>{movie.duration}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{movie.language}</span>
                <span className="w-1 h-1 rounded-full bg-white/40" />
                <span>{movie.genre}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content section */}
      <section className="relative bg-mega-dark pb-20">
        <div className="max-w-5xl mx-auto px-6 md:px-12 -mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content - Synopsis + Trailer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Synopsis */}
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                  <div className="w-1 h-6 bg-[#e31837] rounded-full" />
                  {t.movieDetail.synopsis}
                </h2>
                <p className="text-white/70 leading-relaxed text-base md:text-lg">
                  {movie.synopsis}
                </p>
              </div>

              {/* Watch Trailer button */}
              {movie.trailerUrl && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTrailerOpen(true)}
                  className="w-full glass-card rounded-2xl p-6 flex items-center justify-center gap-4 border border-white/10 hover:border-[#e31837]/50 hover:bg-[#e31837]/5 transition-all duration-300 cursor-pointer group"
                >
                  <div className="w-14 h-14 rounded-full bg-[#e31837]/20 flex items-center justify-center group-hover:bg-[#e31837]/30 transition-colors">
                    <svg className="w-6 h-6 text-[#e31837] ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.8A1.5 1.5 0 004 4.1v11.8a1.5 1.5 0 002.3 1.3l9.3-5.9a1.5 1.5 0 000-2.6L6.3 2.8z" />
                    </svg>
                  </div>
                  <span className="text-lg font-semibold text-white group-hover:text-[#e31837] transition-colors">
                    {t.movieDetail.watchTrailer}
                  </span>
                </motion.button>
              )}

              {/* Showtimes */}
              <div className="glass-card rounded-2xl p-6 md:p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                  <div className="w-1 h-6 bg-[#e31837] rounded-full" />
                  {t.movieDetail.showtimes}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {movie.showtimes.map((time) => (
                    <Link
                      key={time}
                      href="/#booking"
                      onClick={() => handleBookShowtime(time)}
                      className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-white hover:border-[#e31837]/50 hover:bg-[#e31837]/10 hover:text-[#e31837] transition-all duration-300 text-base font-medium"
                    >
                      {time}
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Sidebar - Movie details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="space-y-6"
            >
              <div className="glass-card rounded-2xl p-6">
                <div className="space-y-5">
                  <div>
                    <span className="text-xs text-white/40 uppercase tracking-wider">
                      {t.movieDetail.duration}
                    </span>
                    <p className="text-white font-medium mt-1">{movie.duration}</p>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div>
                    <span className="text-xs text-white/40 uppercase tracking-wider">
                      {t.movieDetail.language}
                    </span>
                    <p className="text-white font-medium mt-1">{movie.language}</p>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div>
                    <span className="text-xs text-white/40 uppercase tracking-wider">
                      {t.movieDetail.genre}
                    </span>
                    <p className="text-white font-medium mt-1">{movie.genre}</p>
                  </div>
                  <div className="h-px bg-white/5" />
                  <div>
                    <span className="text-xs text-white/40 uppercase tracking-wider">
                      {t.movieDetail.rating}
                    </span>
                    <p className="text-mega-gold font-bold text-lg mt-1">★ {movie.rating}</p>
                  </div>
                </div>
              </div>

              {/* Book Now CTA */}
              <Link
                href="/#booking"
                onClick={() => handleBookShowtime(movie.showtimes[0])}
                className="block w-full text-center px-6 py-4 rounded-2xl bg-[#e31837] hover:bg-[#c41530] text-white font-bold text-lg transition-all duration-300 shadow-lg shadow-[#e31837]/20 hover:shadow-[#e31837]/40"
              >
                {t.movieDetail.bookNow}
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerUrl={movie.trailerUrl}
        movieTitle={movie.title}
      />
    </>
  );
}
