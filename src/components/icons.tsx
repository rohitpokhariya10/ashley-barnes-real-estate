import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
  focusable: false,
} as const;

export const ArrowRight = (props: IconProps) => (
  <svg viewBox="0 0 20 10" width="20" height="10" {...base} {...props}>
    <path d="M0 5h19M15 1l4 4-4 4" />
  </svg>
);

export const Check = (props: IconProps) => (
  <svg viewBox="0 0 16 16" width="16" height="16" {...base} strokeWidth={1.5} {...props}>
    <path d="M3 8.5l3.2 3.2L13 4.8" />
  </svg>
);

export const Phone = (props: IconProps) => (
  <svg viewBox="0 0 16 16" width="14" height="14" {...base} {...props}>
    <path d="M3.2 1.5h2.3l1.1 3-1.5 1.1a8.3 8.3 0 0 0 5.3 5.3l1.1-1.5 3 1.1v2.3a1.2 1.2 0 0 1-1.3 1.2A12.4 12.4 0 0 1 2 2.8a1.2 1.2 0 0 1 1.2-1.3z" />
  </svg>
);

/** Market knowledge — map pin */
export const Compass = (props: IconProps) => (
  <svg viewBox="0 0 32 32" width="32" height="32" {...base} {...props}>
    <path d="M16 28.5s9-8.2 9-15.3a9 9 0 1 0-18 0c0 7.1 9 15.3 9 15.3z" />
    <circle cx="16" cy="13" r="3.25" />
  </svg>
);

/** Real estate services — house */
export const House = (props: IconProps) => (
  <svg viewBox="0 0 32 32" width="32" height="32" {...base} {...props}>
    <path d="M4 15.5L16 5l12 10.5" />
    <path d="M7.5 13v13.5h17V13" />
    <path d="M13 26.5v-8h6v8" />
  </svg>
);

/** Personal approach — key */
export const Key = (props: IconProps) => (
  <svg viewBox="0 0 32 32" width="32" height="32" {...base} {...props}>
    <circle cx="11" cy="21" r="5.5" />
    <path d="M15 17L27 5M22.5 9.500l3.5 3.500M19.5 12.500l2.5 2.5" />
  </svg>
);

export const Bed = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
    <path d="M3 18v3M21 18v3M3 13V5h18v8M3 18h18v-5H3zM6 13V9h5v4M13 13V9h5v4" />
  </svg>
);

export const Bath = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
    <path d="M3 12h18M4 12v3a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-3M7 19l-1 2M17 19l1 2M6 12V5a2 2 0 0 1 4 0v1M8 6h4" />
  </svg>
);

export const SquareFeet = (props: IconProps) => (
  <svg viewBox="0 0 24 24" width="24" height="24" {...base} {...props}>
    <path d="M9 3H3v6M15 3h6v6M21 15v6h-6M9 21H3v-6" />
  </svg>
);
