/**
 * ============================================================
 *  BRAND — the single place to change the site's identity.
 * ============================================================
 *
 *  Colours: edit the hex values below. They are injected as CSS variables
 *  (`--brand-*`) by <BrandStyle /> in app/layout.tsx, and every Tailwind token
 *  (bg-bg-primary, text-accent-primary, text-signal, …) in app/globals.css
 *  points at them. Nothing else in the codebase hard-codes a brand colour.
 *
 *  Logo: replace the image file below (keep a transparent background).
 *  Favicons: replace app/icon.png, app/apple-icon.png and app/favicon.ico.
 *  Share image: replace app/opengraph-image.png.
 *
 *  Fonts: change the loaders at the bottom of this file.
 */
import { Archivo, JetBrains_Mono } from "next/font/google";
import logo from "@/public/images/vrTechBro-bg-remove.webp";

export const BRAND = {
  name: "VRTechBro",

  logo: {
    src: logo,
    alt: "VRTechBro logo",
  },

  colors: {
    /* Surfaces, darkest to lightest */
    canvas: "#07070B", // page background
    surface: "#0E0E15", // cards, panels
    raised: "#16161F", // hovered / elevated panels
    line: "#23232E", // hairlines and subtle borders
    lineStrong: "#363645", // emphasised borders

    /* Text */
    text: "#EEEEF3",
    textSecondary: "#A9A9B8",
    textMuted: "#7C7C8E",

    /* Primary accent: buttons, links, focus rings */
    primary: "#7B6CF6",
    primaryHover: "#9384FF",
    onPrimary: "#FFFFFF",

    /* Signal accent: taken from the logo's lightning bolt.
       Use sparingly — live status, step numbers, small highlights. */
    signal: "#F6B31B",
    signalHover: "#FFC64A",
    onSignal: "#0E0E15",

    /* Tertiary: only for gradients and illustrations */
    tertiary: "#D97BD0",

    /* Feedback */
    success: "#3DD68C",
    warning: "#F5A524",
    error: "#F2555A",
  },

  /** Display font width (Archivo's wdth axis: 62–125). 100 = normal. */
  displayStretch: "106%",
} as const;

export type BrandColor = keyof typeof BRAND.colors;

/** Builds the `:root { --brand-…: … }` block injected into <head>. */
export function brandCssVariables(): string {
  const toKebab = (s: string) =>
    s.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
  const vars = Object.entries(BRAND.colors)
    .map(([key, value]) => `--brand-${toKebab(key)}:${value};`)
    .join("");
  return `:root{${vars}--brand-display-stretch:${BRAND.displayStretch};}`;
}

/* ---------------------------- Fonts ---------------------------- */

/** One family for display and body; headlines use the wider cut via font-stretch. */
export const fontSans = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-sans-brand",
  display: "swap",
});

export const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-brand",
  display: "swap",
});
