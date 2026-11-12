"use client";

import { m, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

type StaggerGroupProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "ul";
  delay?: number;
  stagger?: number;
  once?: boolean;
};

/** Parent that reveals its `StaggerItem` children one after another. */
export function StaggerGroup({
  children,
  className,
  as = "div",
  delay = 0,
  stagger = 0.07,
  once = true,
}: StaggerGroupProps) {
  const reduceMotion = useReducedMotion();
  const props = {
    className,
    initial: "hidden" as const,
    whileInView: "show" as const,
    viewport: { once, amount: 0.15 },
    variants: {
      hidden: {},
      show: {
        transition: {
          staggerChildren: reduceMotion ? 0 : stagger,
          delayChildren: reduceMotion ? 0 : delay,
        },
      },
    },
  };

  if (as === "ul") {
    return <m.ul {...props}>{children}</m.ul>;
  }

  return <m.div {...props}>{children}</m.div>;
}

type StaggerItemProps = {
  children: ReactNode;
  className?: string;
  as?: "div" | "li" | "article";
  y?: number;
};

/** Child item for `StaggerGroup`; only animates opacity and transform. */
export function StaggerItem({
  children,
  className,
  as = "div",
  y = 14,
}: StaggerItemProps) {
  const reduceMotion = useReducedMotion();
  const props = {
    className,
    variants: {
      hidden: { opacity: 0, y: reduceMotion ? 0 : y },
      show: {
        opacity: 1,
        y: 0,
        transition: {
          duration: reduceMotion ? 0.01 : 0.45,
          ease: EASE,
        },
      },
    },
  };

  if (as === "li") {
    return <m.li {...props}>{children}</m.li>;
  }

  if (as === "article") {
    return <m.article {...props}>{children}</m.article>;
  }

  return <m.div {...props}>{children}</m.div>;
}
