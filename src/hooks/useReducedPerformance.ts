"use client";

import { useState, useEffect } from "react";

interface PerformanceInfo {
  isLowEnd: boolean;
  prefersReducedMotion: boolean;
}

const defaultValue: PerformanceInfo = {
  isLowEnd: false,
  prefersReducedMotion: false,
};

let cachedResult: PerformanceInfo | null = null;

export default function useReducedPerformance(): PerformanceInfo {
  const [result, setResult] = useState<PerformanceInfo>(
    () => cachedResult ?? defaultValue
  );

  useEffect(() => {
    if (cachedResult) {
      setResult(cachedResult);
      return;
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const hardwareConcurrency = navigator.hardwareConcurrency ?? 8;
    const deviceMemory =
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
    const isMobileViewport = window.innerWidth < 768;

    const isLowEnd =
      hardwareConcurrency < 4 ||
      deviceMemory < 4 ||
      isMobileViewport ||
      prefersReducedMotion;

    cachedResult = { isLowEnd, prefersReducedMotion };
    setResult(cachedResult);
  }, []);

  return result;
}
