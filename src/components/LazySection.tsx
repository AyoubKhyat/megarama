"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { motion } from "framer-motion";

function SectionSkeleton() {
  return (
    <div className="py-20 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="h-3 w-24 rounded-full bg-white/5 mb-4 animate-shimmer" />
        <div className="h-10 w-64 rounded-full bg-white/5 mb-12 animate-shimmer" style={{ animationDelay: "0.2s" }} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-2xl bg-white/[0.02] border border-white/5 h-48 animate-shimmer" style={{ animationDelay: `${0.1 * i}s` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

interface LazySectionProps {
  children: ReactNode;
  rootMargin?: string;
  fallback?: ReactNode;
}

export default function LazySection({
  children,
  rootMargin = "200px",
  fallback = <SectionSkeleton />,
}: LazySectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref}>
      {isVisible ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      ) : (
        fallback
      )}
    </div>
  );
}
