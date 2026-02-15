export const COLORS = {
  bg: {
    primary: "#1a1a2e",
    surface: "#16213e",
    elevated: "#0f3460",
  },
  text: {
    primary: "#ffffff",
    secondary: "#b0b0b0",
    muted: "#808080",
  },
  pain: {
    low: "#22c55e",
    mid: "#eab308",
    high: "#ef4444",
  },
  nav: {
    active: "#e8913a",
    inactive: "#808080",
  },
} as const;

export function getPainColor(level: number): string {
  if (level <= 3) return COLORS.pain.low;
  if (level <= 6) return COLORS.pain.mid;
  return COLORS.pain.high;
}
