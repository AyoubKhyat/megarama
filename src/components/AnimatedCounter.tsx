"use client";

import { useState, useEffect, useRef } from "react";

interface AnimatedCounterProps {
  target: number;
  decimals?: number;
  suffix?: string;
  inView: boolean;
}

export default function AnimatedCounter({
  target,
  decimals,
  suffix = "",
  inView,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  const isDecimal = decimals !== undefined ? decimals > 0 : target % 1 !== 0;
  const decimalPlaces = decimals !== undefined ? decimals : (target % 1 !== 0 ? 1 : 0);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const duration = 2000;
    const steps = 60;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      if (step >= steps) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(isDecimal ? parseFloat(current.toFixed(decimalPlaces)) : Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [inView, target, isDecimal, decimalPlaces]);

  const display = isDecimal ? count.toFixed(decimalPlaces) : count.toLocaleString();

  return (
    <span className="text-3xl md:text-4xl font-bold text-white">
      {display}{suffix}
    </span>
  );
}
