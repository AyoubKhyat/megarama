"use client";

import { useState } from "react";
import Image, { type ImageProps } from "next/image";

interface ImageWithFallbackProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
}

export default function ImageWithFallback({
  fallbackSrc,
  alt,
  ...props
}: ImageWithFallbackProps) {
  const [error, setError] = useState(false);

  if (error && !fallbackSrc) {
    return (
      <div
        className="flex items-center justify-center bg-white/5 text-white/20"
        style={{
          position: props.fill ? "absolute" : "relative",
          inset: props.fill ? 0 : undefined,
          width: props.fill ? undefined : props.width,
          height: props.fill ? undefined : props.height,
        }}
      >
        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.41a2.25 2.25 0 013.182 0l2.909 2.91m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
        </svg>
      </div>
    );
  }

  return (
    <Image
      {...props}
      alt={alt}
      src={error && fallbackSrc ? fallbackSrc : props.src}
      onError={() => setError(true)}
    />
  );
}
