"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface ImageCarouselProps {
  urls: string[];
  alt: string;
  className?: string;
  aspectRatio?: string;
  /** 填滿父層（父層需 position: relative 且有高度），用於 banner 等全幅輪播 */
  fillParent?: boolean;
}

export function ImageCarousel({ urls, alt, className = "", aspectRatio = "aspect-video", fillParent = false }: ImageCarouselProps) {
  const [current, setCurrent] = useState(0);

  const images = urls.filter(Boolean);
  const len = images.length;

  useEffect(() => {
    if (len <= 1) return;
    const t = setInterval(() => setCurrent((c) => (c + 1) % len), 5000);
    return () => clearInterval(t);
  }, [len]);

  const containerClass = fillParent
    ? `absolute inset-0 overflow-hidden bg-amber-100 ${className}`
    : `relative ${aspectRatio} w-full overflow-hidden bg-amber-100 ${className}`;

  if (len === 0) {
    return (
      <div className={fillParent ? containerClass + " flex items-center justify-center" : `flex ${aspectRatio} w-full items-center justify-center overflow-hidden bg-amber-100 ${className}`}>
        <span className="text-4xl text-amber-600/40">♪</span>
      </div>
    );
  }

  if (len === 1) {
    return (
      <div className={containerClass}>
        <Image
          src={images[0]}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className={containerClass}>
      {images.map((url, i) => (
        <div
          key={url}
          className={`absolute inset-0 transition-opacity duration-300 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={url}
            alt={`${alt} (${i + 1}/${len})`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            unoptimized
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => setCurrent((c) => (c - 1 + len) % len)}
        className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"
        aria-label="上一張"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => setCurrent((c) => (c + 1) % len)}
        className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white transition hover:bg-black/60"
        aria-label="下一張"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
      <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1.5">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrent(i)}
            className={`h-2 w-2 rounded-full transition ${
              i === current ? "bg-white" : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`第 ${i + 1} 張`}
          />
        ))}
      </div>
    </div>
  );
}
