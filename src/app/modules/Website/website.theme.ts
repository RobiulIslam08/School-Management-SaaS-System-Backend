const PRESET_PRIMARY = {
  heritage: "#14532d",
  royal: "#0b3d6e",
  crimson: "#9f1239",
  azure: "#0e7490",
} as const;

export type ThemePreset = keyof typeof PRESET_PRIMARY | "custom";

export interface ThemeTokens {
  preset: ThemePreset;
  primary: string;
  onPrimary: "#111111" | "#ffffff";
  accent: string;
  surface: string;
  ink: string;
  radius: string;
}

export function normalizeHex(input: string, fallback = "#14532d"): string {
  const value = input.trim();
  return /^#[0-9a-fA-F]{6}$/.test(value) ? value.toLowerCase() : fallback;
}

function channel(hex: string, index: number): number {
  return Number.parseInt(hex.slice(1 + index * 2, 3 + index * 2), 16) / 255;
}

function linearize(value: number): number {
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string): number {
  const safe = normalizeHex(hex);
  const r = linearize(channel(safe, 0));
  const g = linearize(channel(safe, 1));
  const b = linearize(channel(safe, 2));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground: string, background: string): number {
  const lighter = luminance(foreground);
  const darker = luminance(background);
  const [hi, lo] = lighter > darker ? [lighter, darker] : [darker, lighter];
  return (hi + 0.05) / (lo + 0.05);
}

export function readableOn(background: string): "#111111" | "#ffffff" {
  const white = contrastRatio("#ffffff", background);
  const ink = contrastRatio("#111111", background);
  if (white >= 4.5 && white >= ink) return "#ffffff";
  if (ink >= 4.5) return "#111111";
  return white >= ink ? "#ffffff" : "#111111";
}

export function themeTokens(preset: string, customPrimary: string): ThemeTokens {
  const known = preset === "royal" || preset === "crimson" || preset === "azure" || preset === "custom" ? preset : "heritage";
  const primary = known === "custom" ? normalizeHex(customPrimary) : PRESET_PRIMARY[known];
  return {
    preset: known,
    primary,
    onPrimary: readableOn(primary),
    accent: "#8a6a32",
    surface: "#f6f3ec",
    ink: "#1c1917",
    radius: "0.75rem",
  };
}
