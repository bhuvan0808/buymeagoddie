"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

type Direction = "up" | "down" | "left" | "right" | "none";

const offsets: Record<Direction, { x: number; y: number }> = {
  up: { x: 0, y: 32 },
  down: { x: 0, y: -32 },
  left: { x: 32, y: 0 },
  right: { x: -32, y: 0 },
  none: { x: 0, y: 0 },
};

/**
 * Scroll-reveal wrapper: fades + slides children in the first time they
 * enter the viewport. Falls back to instant visibility for reduced motion.
 */
export function Reveal({
  children,
  className,
  direction = "up",
  delay = 0,
  duration = 0.7,
  once = true,
  amount = 0.25,
}: {
  children: React.ReactNode;
  className?: string;
  direction?: Direction;
  delay?: number;
  duration?: number;
  once?: boolean;
  amount?: number;
}) {
  const reducedMotion = useReducedMotion();
  const offset = offsets[direction];

  const variants: Variants = {
    hidden: reducedMotion
      ? { opacity: 0 }
      : { opacity: 0, x: offset.x, y: offset.y },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

/** Staggers direct children reveals. Use with <RevealItem>. */
export function RevealGroup({
  children,
  className,
  stagger = 0.12,
  amount = 0.2,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
  amount?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      transition={{ staggerChildren: stagger }}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  const variants: Variants = {
    hidden: reducedMotion ? { opacity: 0 } : { opacity: 0, y: 28 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.21, 0.47, 0.32, 0.98] },
    },
  };

  return (
    <motion.div className={className} variants={variants}>
      {children}
    </motion.div>
  );
}
