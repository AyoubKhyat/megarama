"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-mega-dark flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      {/* Background ambient glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(227, 24, 55, 0.06) 0%, transparent 70%)",
        }}
      />

      {/* Film strip decorative borders */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-mega-red opacity-60" />
      <div className="absolute bottom-0 left-0 right-0 h-2 bg-mega-red opacity-60" />

      {/* Main content */}
      <div className="relative z-10 max-w-lg">
        {/* Broken film icon */}
        <div
          className="mx-auto mb-6 w-20 h-20 rounded-full border-2 border-mega-red/40 flex items-center justify-center"
          style={{
            boxShadow: "0 0 30px rgba(227, 24, 55, 0.15)",
            animation: "errorIconPulse 2.5s ease-in-out infinite",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-mega-red"
          >
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2" />
          </svg>
        </div>

        {/* Heading */}
        <h1
          className="text-4xl sm:text-5xl font-black text-mega-red tracking-tight mb-3"
          style={{
            textShadow:
              "0 0 30px rgba(227, 24, 55, 0.3), 0 0 60px rgba(227, 24, 55, 0.15)",
          }}
        >
          Technical Difficulties
        </h1>

        <p className="text-mega-gold text-lg sm:text-xl font-semibold tracking-wide uppercase mb-3">
          The Projector Hit a Snag
        </p>

        <p className="text-white/50 text-base leading-relaxed mb-4">
          Something went wrong while loading this scene.
          <br />
          Our crew is working to get the show back on track.
        </p>

        {/* Error details (collapsed) */}
        {error?.message && (
          <div className="mb-8 mx-auto max-w-md">
            <details className="group">
              <summary className="text-white/30 text-xs uppercase tracking-widest cursor-pointer hover:text-white/50 transition-colors duration-200 select-none">
                Error Details
              </summary>
              <div className="mt-3 p-4 rounded-lg bg-white/[0.03] border border-white/[0.06] text-left">
                <p className="text-white/40 text-xs font-mono break-all leading-relaxed">
                  {error.message}
                </p>
                {error.digest && (
                  <p className="text-white/25 text-xs font-mono mt-2">
                    Digest: {error.digest}
                  </p>
                )}
              </div>
            </details>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {/* Try Again button */}
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-8 py-4 bg-mega-red hover:bg-mega-red-dark text-white font-bold text-sm uppercase tracking-widest rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer"
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
              <polyline points="23 4 23 10 17 10" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            Try Again
          </button>

          {/* Back to Home link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-transparent border border-white/15 hover:border-mega-gold/40 text-white/70 hover:text-mega-gold font-bold text-sm uppercase tracking-widest rounded-lg transition-all duration-300 hover:scale-105"
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
        </div>

        {/* Decorative film reel */}
        <div className="mt-16 flex justify-center opacity-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
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
        @keyframes errorIconPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(227, 24, 55, 0.15); }
          50% { box-shadow: 0 0 50px rgba(227, 24, 55, 0.3); }
        }
        @keyframes filmReelSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
