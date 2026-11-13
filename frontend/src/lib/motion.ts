export type Ease = [number, number, number, number];

export const EASE: Ease = [0.4, 0, 0.2, 1];

export const MOTION = {
  tooltip: { duration: 0.1, ease: EASE },
  hover: { duration: 0.12, ease: EASE },
  tab: { duration: 0.15, ease: EASE },
  panel: { duration: 0.18, ease: EASE },
  modal: { duration: 0.2, ease: EASE },
} as const;

export const REVEAL = { duration: MOTION.panel.duration, ease: EASE };
