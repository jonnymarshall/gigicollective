import themeJson from '../data/theme.json';

/**
 * Curated design options. She picks from these in the CMS, so the site can be
 * restyled without a code change and without any combination looking wrong.
 *
 * Every palette is built from the same recipe: a deep warm dark for full-width
 * bands, a soft neutral page background, one tinted band a shade deeper, and a
 * single muted accent. That shared structure is why they all hold together.
 *
 * To add an option: add it here, then add the same value to the matching
 * `options` list in public/admin/config.yml.
 */

export const PALETTES = {
  clay: {
    label: 'Clay and bone',
    dark: '#2F2822', darkSoft: '#3A322B',
    bg: '#F7F3EC', band: '#EBE3D7', surface: '#FFFDFA',
    text: '#332E28', muted: '#857A6D', line: '#DED5C7',
    accent: '#A08262', accentHover: '#88694C',
    onDark: '#F2ECE3', onDarkMuted: '#AFA396',
  },
  sage: {
    label: 'Sage and linen',
    dark: '#2A302A', darkSoft: '#353C34',
    bg: '#F6F5F0', band: '#E6E8DE', surface: '#FFFFFC',
    text: '#2C312B', muted: '#78806F', line: '#D8DBCE',
    accent: '#7A8A66', accentHover: '#5F6E4E',
    onDark: '#EFF1E9', onDarkMuted: '#A6AC9C',
  },
  stone: {
    label: 'Stone and mist',
    dark: '#292A2C', darkSoft: '#343639',
    bg: '#F6F6F5', band: '#E6E6E4', surface: '#FFFFFF',
    text: '#2C2D2F', muted: '#7C7D80', line: '#D9D9D6',
    accent: '#7E8489', accentHover: '#63686D',
    onDark: '#EFEFEE', onDarkMuted: '#A6A7A9',
  },
  terracotta: {
    label: 'Terracotta and sand',
    dark: '#33271F', darkSoft: '#3F3128',
    bg: '#FAF4EC', band: '#F0E3D4', surface: '#FFFDF9',
    text: '#372B22', muted: '#8B7A69', line: '#E3D5C3',
    accent: '#B0714F', accentHover: '#8E583C',
    onDark: '#F5EDE3', onDarkMuted: '#B5A492',
  },
  ink: {
    label: 'Ink and oat',
    dark: '#232629', darkSoft: '#2E3236',
    bg: '#F7F5F0', band: '#E9E5DC', surface: '#FFFFFD',
    text: '#26292C', muted: '#767A7E', line: '#DCD8CE',
    accent: '#4A5A63', accentHover: '#35434B',
    onDark: '#EFEDE7', onDarkMuted: '#A3A6A9',
  },
} as const;

/**
 * Only two families are offered, and both are loaded on every page anyway, so
 * switching between them costs nothing. Keeping the list short is deliberate:
 * more choices here means more ways to land on a pairing that reads badly.
 */
export const FONTS = {
  serif: { label: 'Serif', stack: 'var(--font-serif), Georgia, serif' },
  sans: { label: 'Sans serif', stack: 'var(--font-sans), Helvetica Neue, Arial, sans-serif' },
} as const;

export const HEADING_STYLES = {
  airy: { label: 'Airy and spaced out', weight: '300', tracking: '0.06em', transform: 'uppercase' },
  classic: { label: 'Classic', weight: '400', tracking: '0.01em', transform: 'none' },
  bold: { label: 'Bold and close', weight: '600', tracking: '-0.01em', transform: 'none' },
} as const;

export const CORNERS = {
  square: { label: 'Square', radius: '0px' },
  soft: { label: 'Slightly rounded', radius: '3px' },
  round: { label: 'Rounded', radius: '14px' },
} as const;

interface Theme {
  palette: keyof typeof PALETTES;
  headingFont: keyof typeof FONTS;
  bodyFont: keyof typeof FONTS;
  headingStyle: keyof typeof HEADING_STYLES;
  corners: keyof typeof CORNERS;
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
  const hs = pick(HEADING_STYLES, theme.headingStyle, 'classic');
  const corners = pick(CORNERS, theme.corners, 'square');

  return [
    `--c-dark:${p.dark}`,
    `--c-dark-soft:${p.darkSoft}`,
    `--c-bg:${p.bg}`,
    `--c-band:${p.band}`,
    `--c-surface:${p.surface}`,
    `--c-text:${p.text}`,
    `--c-muted:${p.muted}`,
    `--c-line:${p.line}`,
    `--c-accent:${p.accent}`,
    `--c-accent-hover:${p.accentHover}`,
    `--c-on-dark:${p.onDark}`,
    `--c-on-dark-muted:${p.onDarkMuted}`,
    `--font-heading:${heading.stack}`,
    `--font-body:${body.stack}`,
    `--heading-weight:${hs.weight}`,
    `--heading-tracking:${hs.tracking}`,
    `--display-transform:${hs.transform}`,
    `--radius:${corners.radius}`,
  ].join(';');
}
