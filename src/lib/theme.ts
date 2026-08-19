import themeJson from '../data/theme.json';

/**
 * Curated design options. She picks from these in the CMS, so the site can be
 * restyled without a code change and without any combination looking broken.
 *
 * To add an option: add it here, then add the same value to the matching
 * `options` list in public/admin/config.yml.
 */

export const PALETTES = {
  clay: {
    label: 'Warm clay',
    bg: '#fdfcfa', surface: '#ffffff', text: '#1f1d1a',
    muted: '#6b6660', accent: '#8a5a3b', accentHover: '#6e4530',
    border: '#e6e1da', tint: '#f6f1ea',
  },
  sage: {
    label: 'Sage',
    bg: '#fbfcfa', surface: '#ffffff', text: '#1c211c',
    muted: '#636a61', accent: '#4f6f52', accentHover: '#3d5740',
    border: '#e2e7e0', tint: '#eef2ec',
  },
  ink: {
    label: 'Ink and cream',
    bg: '#fcfaf6', surface: '#ffffff', text: '#14161a',
    muted: '#5f646d', accent: '#25303f', accentHover: '#141c27',
    border: '#e4e2dc', tint: '#f1efe8',
  },
  rose: {
    label: 'Dusty rose',
    bg: '#fdfbfb', surface: '#ffffff', text: '#231b1e',
    muted: '#6d6165', accent: '#9c5b6b', accentHover: '#7d4553',
    border: '#ece2e4', tint: '#f8eef0',
  },
  slate: {
    label: 'Slate and sky',
    bg: '#fafbfc', surface: '#ffffff', text: '#18202b',
    muted: '#5d6773', accent: '#376b91', accentHover: '#295271',
    border: '#e1e6ea', tint: '#edf2f6',
  },
} as const;

export const FONTS = {
  serif: {
    label: 'Serif',
    stack: 'ui-serif, Georgia, Cambria, "Times New Roman", serif',
  },
  sans: {
    label: 'Sans serif',
    stack: 'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
  },
  rounded: {
    label: 'Rounded',
    stack: 'ui-rounded, "SF Pro Rounded", "Hiragino Maru Gothic ProN", Quicksand, system-ui, sans-serif',
  },
  mono: {
    label: 'Typewriter',
    stack: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  },
} as const;

export const CORNERS = {
  square: { label: 'Square', radius: '0px' },
  soft: { label: 'Softly rounded', radius: '10px' },
  round: { label: 'Very rounded', radius: '20px' },
} as const;

export const HEADING_WEIGHTS = {
  regular: { label: 'Regular', value: '600' },
  light: { label: 'Light', value: '400' },
  bold: { label: 'Bold', value: '700' },
} as const;

interface Theme {
  palette: keyof typeof PALETTES;
  headingFont: keyof typeof FONTS;
  bodyFont: keyof typeof FONTS;
  corners: keyof typeof CORNERS;
  headingWeight: keyof typeof HEADING_WEIGHTS;
}

const theme = themeJson as Theme;

/** Falls back to a sensible default if the CMS ever holds an unknown value. */
const pick = <T extends Record<string, unknown>>(map: T, key: unknown, fallback: keyof T) =>
  map[(key as keyof T) in map ? (key as keyof T) : fallback];

/** The `:root` custom properties that style the whole site. */
export function themeVariables(): string {
  const p = pick(PALETTES, theme.palette, 'clay');
  const heading = pick(FONTS, theme.headingFont, 'serif');
  const body = pick(FONTS, theme.bodyFont, 'sans');
  const corners = pick(CORNERS, theme.corners, 'soft');
  const weight = pick(HEADING_WEIGHTS, theme.headingWeight, 'regular');

  return [
    `--color-bg:${p.bg}`,
    `--color-surface:${p.surface}`,
    `--color-text:${p.text}`,
    `--color-muted:${p.muted}`,
    `--color-accent:${p.accent}`,
    `--color-accent-hover:${p.accentHover}`,
    `--color-border:${p.border}`,
    `--color-tint:${p.tint}`,
    `--font-heading:${heading.stack}`,
    `--font-body:${body.stack}`,
    `--radius:${corners.radius}`,
    `--heading-weight:${weight.value}`,
  ].join(';');
}
