import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | MEGARAMA Marrakech",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-mega-dark flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Background spotlight effect */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(227, 24, 55, 0.08) 0%, transparent 70%)",
        }}
      />

      {/* Film strip decorative borders */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-mega-red opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-mega-red opacity-60" />

      {/* Sprocket holes - top */}
      <div className="absolute top-4 left-0 right-0 flex justify-center gap-12 opacity-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full border border-white/30"
          />
        ))}
      </div>

      {/* Sprocket holes - bottom */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-12 opacity-10">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full border border-white/30"
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-lg">
        {/* 404 number */}
        <h1
          className="text-[10rem] sm:text-[14rem] font-black leading-none tracking-tighter text-mega-red select-none"
          style={{
            textShadow:
              "0 0 40px rgba(227, 24, 55, 0.4), 0 0 80px rgba(227, 24, 55, 0.2)",
            animation: "notFoundPulse 3s ease-in-out infinite",
          }}
        >
          404
        </h1>

        {/* Cinema-themed message */}
        <p className="text-mega-gold text-xl sm:text-2xl font-semibold tracking-wide uppercase mt-2 mb-3">
          Scene Not Found
        </p>
        <p className="text-white/50 text-base sm:text-lg leading-relaxed mb-10">
          This scene was left on the cutting room floor.
          <br />
          The film you&apos;re looking for doesn&apos;t exist in our reel.
        </p>

        {/* Back to Home CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-8 py-4 bg-mega-red hover:bg-mega-red-dark text-white font-bold text-sm uppercase tracking-widest rounded-lg transition-all duration-300 hover:scale-105"
          style={{
            boxShadow:
              "0 0 20px rgba(227, 24, 55, 0.3), 0 4px 20px rgba(0, 0, 0, 0.4)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Back to Lobby
        </Link>

        {/* Decorative film reel icon */}
        <div className="mt-16 flex justify-center opacity-15">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-mega-gold"
            style={{ animation: "filmReelSpin 12s linear infinite" }}
          >
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
            <circle cx="12" cy="5" r="1" />
            <circle cx="5" cy="12" r="1" />
            <circle cx="19" cy="12" r="1" />
            <circle cx="12" cy="19" r="1" />
          </svg>
        </div>
      </div>

      {/* CSS animations */}
      <style>{`
        @keyframes notFoundPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes filmReelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
