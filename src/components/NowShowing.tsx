"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import LiveIndicator from "@/components/LiveIndicator";

gsap.registerPlugin(ScrollTrigger);

const movies = [
  {
    title: "The Mandalorian & Grogu",
    genre: "Sci-Fi / Adventure",
    duration: "2h 05min",
    language: "EN / AR",
    rating: "8.2",
    showtimes: ["14:30", "17:00", "20:30", "23:00"],
    color: "from-blue-900/40",
    poster: "https://marrakech.megarama.ma/public/films/affiches/342_456/0757p10250016523bb35.jpg",
  },
  {
    title: "Toy Story 5",
    genre: "Animation / Family",
    duration: "1h 40min",
    language: "FR / AR",
    rating: "8.5",
    showtimes: ["13:00", "15:30", "18:00"],
    color: "from-amber-900/40",
    poster: "https://marrakech.megarama.ma/public/films/affiches/342_456/0757p1025001607c278e.jpg",
  },
  {
    title: "Spider-Man: Brand New Day",
    genre: "Action / Superhero",
    duration: "2h 20min",
    language: "EN / FR",
    rating: "8.7",
    showtimes: ["14:00", "17:30", "20:00", "22:30"],
    color: "from-red-900/40",
    poster: "https://marrakech.megarama.ma/public/films/affiches/342_456/0757p102500161368854.jpg",
  },
  {
    title: "Scary Movie",
    genre: "Comedy / Horror",
    duration: "1h 52min",
    language: "EN / AR",
    rating: "7.4",
    showtimes: ["16:00", "19:00", "22:00"],
    color: "from-purple-900/40",
    poster: "https://marrakech.megarama.ma/public/films/affiches/342_456/0757p10260017326124f.jpg",
  },
  {
    title: "Le Virtuose",
    genre: "Drama / Music",
    duration: "2h 10min",
    language: "FR / AR",
    rating: "8.0",
    showtimes: ["15:00", "18:30", "21:00"],
    color: "from-emerald-900/40",
    poster: "https://marrakech.megarama.ma/public/films/affiches/342_456/0757p1026001726e9455.jpg",
  },
  {
    title: "Evil Dead Burn",
    genre: "Horror / Thriller",
    duration: "1h 48min",
    language: "EN",
    rating: "7.8",
    showtimes: ["20:30", "23:00"],
    color: "from-orange-900/40",
    poster: "https://marrakech.megarama.ma/public/films/affiches/342_456/0757p1026001729c5d12.jpg",
  },
];

function MovieCard({
  movie,
  index,
}: {
  movie: (typeof movies)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    gsap.to(cardRef.current, {
      rotateY: x * 20,
      rotateX: -y * 20,
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
      className="movie-card flex-shrink-0 w-[320px] md:w-[380px]"
      style={{ perspective: "1000px" }}
      data-speed={1 + index * 0.05}
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        className="relative group"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Poster */}
        <div
          className={`relative h-[420px] md:h-[480px] rounded-2xl overflow-hidden bg-gradient-to-br ${movie.color} to-black border border-white/10 transition-all duration-500 ${isHovered ? "border-[#e31837]/50 shadow-[0_0_40px_rgba(227,24,55,0.3)]" : ""}`}
        >
          {/* Movie poster */}
          <img
            src={movie.poster}
            alt={movie.title}
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Trailer play button overlay on hover */}
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
              aria-label={`Play trailer for ${movie.title}`}
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
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
            <h3 className="text-xl font-bold text-white mb-1">{movie.title}</h3>
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
              <span
                key={time}
                className="px-3 py-1.5 text-xs text-white/70 bg-white/5 rounded-lg border border-white/10 hover:border-[#e31837]/50 hover:text-[#e31837] transition-all duration-300 cursor-pointer"
              >
                {time}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NowShowing() {
  const sectionRef = useRef<HTMLElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Letter-by-letter staggered animation for the title
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

    // Horizontal scroll with pin
    const track = trackRef.current;
    const trigger = triggerRef.current;
    if (!track || !trigger) return;

    const cards = track.querySelectorAll<HTMLElement>(".movie-card");
    const totalScrollWidth = track.scrollWidth - track.clientWidth;

    // Main horizontal scroll animation
    const horizontalTween = gsap.to(track, {
      x: -totalScrollWidth,
      ease: "none",
      scrollTrigger: {
        trigger: trigger,
        start: "top top",
        end: () => `+=${totalScrollWidth}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        onUpdate: (self) => {
          // Update progress bar
          if (progressRef.current) {
            gsap.set(progressRef.current, {
              scaleX: self.progress,
            });
          }
        },
      },
    });

    // Parallax offset for each card during scroll
    cards.forEach((card, i) => {
      const speed = parseFloat(card.dataset.speed || "1");
      gsap.to(card, {
        y: (i % 2 === 0 ? -1 : 1) * 20 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          end: () => `+=${totalScrollWidth}`,
          scrub: 1,
        },
      });
    });

    return () => {
      horizontalTween.scrollTrigger?.kill();
      ScrollTrigger.getAll().forEach((st) => st.kill());
    };
  }, []);

  return (
    <section id="now-showing" ref={sectionRef} className="relative">
      {/* Pinned container for horizontal scroll */}
      <div ref={triggerRef} className="relative overflow-hidden">
        {/* Section background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#e31837]/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Header content */}
        <div className="max-w-7xl mx-auto px-6 pt-32 pb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-12 h-[1px] bg-mega-red" />
            <span className="text-xs tracking-[0.3em] text-mega-red uppercase">
              What&apos;s Playing
            </span>
          </motion.div>

          <div ref={titleRef} className="overflow-hidden">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tight">
              {"NOW SHOWING".split("").map((char, i) => (
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

        {/* Horizontal scrolling track */}
        <div
          ref={trackRef}
          className="flex gap-8 px-12 pb-32 pt-8 will-change-transform"
          style={{ width: "max-content" }}
        >
          {movies.map((movie, i) => (
            <MovieCard key={movie.title} movie={movie} index={i} />
          ))}
        </div>

        {/* Progress bar at the bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-[200px] h-[2px] bg-white/10 rounded-full overflow-hidden">
          <div
            ref={progressRef}
            className="h-full w-full bg-[#e31837] rounded-full origin-left"
            style={{ transform: "scaleX(0)" }}
          />
        </div>

        {/* Scroll hint text */}
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2">
          <span className="text-[10px] tracking-[0.3em] text-white/30 uppercase">
            Scroll to explore
          </span>
        </div>
      </div>
    </section>
  );
}
