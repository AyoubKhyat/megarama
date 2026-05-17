"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

export default function LoadingScreen() {
  const [isComplete, setIsComplete] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const projectorRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const curtainLeftRef = useRef<HTMLDivElement>(null);
  const curtainRightRef = useRef<HTMLDivElement>(null);
  const lightsRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const flickerRef = useRef<HTMLDivElement>(null);
  const dustRef = useRef<HTMLDivElement>(null);
  const countdownNumberRef = useRef<HTMLDivElement>(null);
  const countdownCircleRef = useRef<SVGSVGElement>(null);
  const lensFlareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => setIsComplete(true),
      });

      // Stage 1: Black screen (0.5s)
      tl.to({}, { duration: 0.5 });

      // Stage 2: Projector start — flickering light + dust particles
      tl.to(projectorRef.current, {
        opacity: 1,
        duration: 0.1,
      });

      tl.to(flickerRef.current, {
        opacity: 0.8,
        duration: 0.05,
        repeat: 8,
        yoyo: true,
        ease: "steps(1)",
      });

      tl.to(dustRef.current, {
        opacity: 0.6,
        duration: 0.3,
      }, "-=0.3");

      tl.to(flickerRef.current, {
        opacity: 1,
        duration: 0.2,
      });

      // Stage 3: Film countdown 5 to 1
      tl.to(projectorRef.current, {
        opacity: 0,
        duration: 0.2,
      });

      tl.to(countdownRef.current, {
        opacity: 1,
        duration: 0.1,
      });

      // Animate each number
      for (let i = 5; i >= 1; i--) {
        tl.call(() => {
          if (countdownNumberRef.current) {
            countdownNumberRef.current.textContent = String(i);
          }
        });
        tl.fromTo(
          countdownNumberRef.current,
          { scale: 1.3, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.08, ease: "steps(2)" }
        );
        tl.to(countdownCircleRef.current, {
          rotation: `+=${72}`,
          duration: 0.38,
          ease: "linear",
          transformOrigin: "center center",
        });
        tl.to(countdownNumberRef.current, {
          opacity: 0,
          duration: 0.06,
        });
      }

      // Stage 4: Curtains open
      tl.to(countdownRef.current, {
        opacity: 0,
        duration: 0.15,
      });

      tl.to(curtainLeftRef.current, {
        opacity: 1,
        duration: 0.01,
      });
      tl.to(curtainRightRef.current, {
        opacity: 1,
        duration: 0.01,
      }, "<");

      tl.to(lightsRef.current, {
        opacity: 1,
        duration: 0.01,
      }, "<");

      tl.to(curtainLeftRef.current, {
        xPercent: -100,
        duration: 1.2,
        ease: "power2.inOut",
      });
      tl.to(curtainRightRef.current, {
        xPercent: 100,
        duration: 1.2,
        ease: "power2.inOut",
      }, "<");

      // Stage 5: Lights dim
      tl.to(lightsRef.current, {
        opacity: 0,
        duration: 0.6,
        ease: "power2.in",
      }, "-=0.4");

      // Stage 6: Screen lights up — logo + lens flare
      tl.to(logoRef.current, {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: "power3.out",
      });

      tl.to(lensFlareRef.current, {
        opacity: 1,
        scale: 1.5,
        duration: 0.4,
        ease: "power2.out",
      }, "-=0.3");

      tl.to(lensFlareRef.current, {
        opacity: 0,
        scale: 2,
        duration: 0.5,
        ease: "power2.in",
      });

      // Hold on logo briefly
      tl.to({}, { duration: 0.6 });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          ref={containerRef}
          className="fixed inset-0 z-[9999] bg-[#0d0d0d] overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.77, 0, 0.175, 1] }}
        >
          {/* Stage 2: Projector flicker + dust */}
          <div
            ref={projectorRef}
            className="absolute inset-0 flex items-center justify-center opacity-0"
          >
            {/* Light beam from projector */}
            <div
              ref={flickerRef}
              className="absolute opacity-0"
              style={{
                width: "300px",
                height: "300px",
                background:
                  "radial-gradient(ellipse at center, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 40%, transparent 70%)",
              }}
            />
            {/* Dust particles */}
            <div ref={dustRef} className="absolute opacity-0">
              {Array.from({ length: 30 }).map((_, i) => {
                const seed = i * 7 + 3;
                const size = ((seed * 13) % 20) / 10 + 1;
                const top = ((seed * 17) % 200) - 100;
                const left = ((seed * 23) % 200) - 100;
                const delay = ((seed * 11) % 20) / 10;
                const duration = ((seed * 19) % 20) / 10 + 1;
                return (
                  <span
                    key={i}
                    className="absolute rounded-full bg-white/40 animate-pulse"
                    style={{
                      width: `${size}px`,
                      height: `${size}px`,
                      top: `${top}px`,
                      left: `${left}px`,
                      animationDelay: `${delay}s`,
                      animationDuration: `${duration}s`,
                    }}
                  />
                );
              })}
            </div>
          </div>

          {/* Stage 3: Film countdown */}
          <div
            ref={countdownRef}
            className="absolute inset-0 flex items-center justify-center opacity-0"
          >
            {/* Vintage film grain overlay */}
            <div
              className="absolute inset-0 pointer-events-none opacity-30"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.4'/%3E%3C/svg%3E")`,
              }}
            />
            {/* Countdown circle SVG */}
            <svg
              ref={countdownCircleRef}
              width="220"
              height="220"
              viewBox="0 0 220 220"
              className="absolute"
            >
              <circle
                cx="110"
                cy="110"
                r="100"
                fill="none"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="2"
              />
              <circle
                cx="110"
                cy="110"
                r="85"
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="1"
              />
              {/* Tick marks */}
              {Array.from({ length: 24 }).map((_, i) => {
                const angle = (i * 15 * Math.PI) / 180;
                const x1 = Math.round((110 + 92 * Math.cos(angle)) * 100) / 100;
                const y1 = Math.round((110 + 92 * Math.sin(angle)) * 100) / 100;
                const x2 = Math.round((110 + 100 * Math.cos(angle)) * 100) / 100;
                const y2 = Math.round((110 + 100 * Math.sin(angle)) * 100) / 100;
                return (
                  <line
                    key={i}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="rgba(255,255,255,0.5)"
                    strokeWidth={i % 6 === 0 ? "2" : "1"}
                  />
                );
              })}
              {/* Sweep hand */}
              <line
                x1="110"
                y1="110"
                x2="110"
                y2="20"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            {/* Number display */}
            <div
              ref={countdownNumberRef}
              className="text-7xl md:text-9xl font-bold text-white font-mono tabular-nums select-none"
              style={{
                textShadow: "0 0 20px rgba(255,255,255,0.3)",
              }}
            >
              5
            </div>
          </div>

          {/* Stage 4: Curtains */}
          <div
            ref={curtainLeftRef}
            className="absolute inset-y-0 left-0 w-1/2 opacity-0"
            style={{
              background: `
                linear-gradient(90deg,
                  #1a0508 0%,
                  #4a0a14 5%,
                  #8b1a2b 10%,
                  #c62035 18%,
                  #e31837 25%,
                  #a81530 35%,
                  #7a0f22 42%,
                  #e31837 50%,
                  #c62035 55%,
                  #8b1a2b 62%,
                  #a81530 70%,
                  #e31837 78%,
                  #c62035 85%,
                  #7a0f22 92%,
                  #4a0a14 97%,
                  #1a0508 100%
                )`,
              boxShadow: "inset 0 0 80px rgba(0,0,0,0.6), 5px 0 30px rgba(0,0,0,0.8)",
            }}
          >
            {/* Velvet folds overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `
                  repeating-linear-gradient(90deg,
                    transparent 0px,
                    rgba(0,0,0,0.15) 2px,
                    transparent 4px,
                    rgba(139,26,43,0.1) 8px,
                    transparent 12px
                  )`,
              }}
            />
            {/* Top drape shadow */}
            <div
              className="absolute top-0 left-0 right-0 h-24"
              style={{
                background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)",
              }}
            />
          </div>

          <div
            ref={curtainRightRef}
            className="absolute inset-y-0 right-0 w-1/2 opacity-0"
            style={{
              background: `
                linear-gradient(270deg,
                  #1a0508 0%,
                  #4a0a14 5%,
                  #8b1a2b 10%,
                  #c62035 18%,
                  #e31837 25%,
                  #a81530 35%,
                  #7a0f22 42%,
                  #e31837 50%,
                  #c62035 55%,
                  #8b1a2b 62%,
                  #a81530 70%,
                  #e31837 78%,
                  #c62035 85%,
                  #7a0f22 92%,
                  #4a0a14 97%,
                  #1a0508 100%
                )`,
              boxShadow: "inset 0 0 80px rgba(0,0,0,0.6), -5px 0 30px rgba(0,0,0,0.8)",
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                background: `
                  repeating-linear-gradient(270deg,
                    transparent 0px,
                    rgba(0,0,0,0.15) 2px,
                    transparent 4px,
                    rgba(139,26,43,0.1) 8px,
                    transparent 12px
                  )`,
              }}
            />
            <div
              className="absolute top-0 left-0 right-0 h-24"
              style={{
                background: "linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 100%)",
              }}
            />
          </div>

          {/* Stage 5: Theater ambient lights */}
          <div ref={lightsRef} className="absolute inset-0 pointer-events-none opacity-0">
            {/* Left side lights */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`l-${i}`}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  left: "20px",
                  top: `${15 + i * 18}%`,
                  background: "radial-gradient(circle, #d4a853 0%, transparent 70%)",
                  boxShadow: "0 0 8px 3px rgba(212,168,83,0.4)",
                }}
              />
            ))}
            {/* Right side lights */}
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={`r-${i}`}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  right: "20px",
                  top: `${15 + i * 18}%`,
                  background: "radial-gradient(circle, #d4a853 0%, transparent 70%)",
                  boxShadow: "0 0 8px 3px rgba(212,168,83,0.4)",
                }}
              />
            ))}
          </div>

          {/* Stage 6: Logo reveal */}
          <div
            ref={logoRef}
            className="absolute inset-0 flex items-center justify-center opacity-0 scale-90"
          >
            <div className="text-center relative">
              <h1
                className="text-5xl md:text-8xl font-bold tracking-[0.3em] text-white"
                style={{
                  textShadow:
                    "0 0 40px rgba(227,24,55,0.5), 0 0 80px rgba(227,24,55,0.2)",
                }}
              >
                MEGA<span className="text-[#e31837]">RAMA</span>
              </h1>
              <div
                className="mt-3 h-[1px] mx-auto"
                style={{
                  width: "60%",
                  background:
                    "linear-gradient(90deg, transparent, #d4a853, transparent)",
                }}
              />
              <p
                className="mt-3 text-sm md:text-base tracking-[0.6em] uppercase"
                style={{ color: "#d4a853" }}
              >
                Marrakech
              </p>
            </div>
            {/* Lens flare */}
            <div
              ref={lensFlareRef}
              className="absolute inset-0 flex items-center justify-center opacity-0 pointer-events-none"
            >
              <div
                className="absolute"
                style={{
                  width: "400px",
                  height: "400px",
                  background: `
                    radial-gradient(ellipse at center,
                      rgba(255,255,255,0.3) 0%,
                      rgba(227,24,55,0.1) 20%,
                      transparent 60%
                    )`,
                }}
              />
              {/* Horizontal flare streak */}
              <div
                className="absolute w-[600px] h-[2px]"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
