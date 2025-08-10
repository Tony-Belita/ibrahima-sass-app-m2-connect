"use client";
import { useEffect, useRef, useState } from "react";

// Fonction utilitaire pour combiner les classes CSS
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const beams = [
    {
      initialX: 10,
      translateX: 10,
      duration: 7,
      repeatDelay: 3,
      delay: 2,
    },
    {
      initialX: 600,
      translateX: 600,
      duration: 3,
      repeatDelay: 3,
      delay: 4,
    },
    {
      initialX: 100,
      translateX: 100,
      duration: 7,
      repeatDelay: 7,
      delay: 5,
    },
    {
      initialX: 400,
      translateX: 400,
      duration: 5,
      repeatDelay: 14,
      delay: 8,
    },
    {
      initialX: 800,
      translateX: 800,
      duration: 11,
      repeatDelay: 2,
      delay: 2,
    },
    {
      initialX: 1000,
      translateX: 1000,
      duration: 4,
      repeatDelay: 2,
      delay: 4,
    },
    {
      initialX: 1200,
      translateX: 1200,
      duration: 6,
      repeatDelay: 4,
      delay: 6,
    },
  ];

  return (
    <div
      className={cn(
        "absolute inset-0 h-screen w-full bg-gradient-to-b from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 overflow-hidden",
        className
      )}
    >
      {beams.map((beam, index) => (
        <div
          key={index}
          className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent"
          style={{
            left: `${beam.initialX}px`,
            animationDelay: `${beam.delay}s`,
            animationDuration: `${beam.duration}s`,
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
            transform: `translateX(${beam.translateX}px)`,
          }}
        />
      ))}
    </div>
  );
};
