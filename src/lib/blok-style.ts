import type { SbBlokData } from '@storyblok/astro';

/**
 * Turns the style controls she sets in Storyblok into class names the stylesheet
 * already understands.
 *
 * Every value is looked up in a fixed map rather than interpolated, so an
 * unexpected value from the CMS falls back to a sane default instead of emitting
 * a class that does not exist.
 */

const BACKGROUNDS = { bg: 'band--bg', tint: 'band--tint', dark: 'band--dark' } as const;
const SPACE_TOP = {
  none: 'pt-none', sm: 'pt-sm', md: 'pt-md', lg: 'pt-lg', xl: 'pt-xl',
} as const;
const SPACE_BOTTOM = {
  none: 'pb-none', sm: 'pb-sm', md: 'pb-md', lg: 'pb-lg', xl: 'pb-xl',
} as const;
const ALIGN = { left: '', center: 'is-centred' } as const;
const WIDTH = {
  narrow: 'w-narrow', normal: 'w-normal', wide: 'w-wide', full: 'w-full',
} as const;

const pick = <T extends Record<string, string>>(map: T, key: unknown, fallback: keyof T) =>
  map[key as keyof T] ?? map[fallback];

/** The class list for a section's outer element. */
export function blockClasses(blok: SbBlokData, extra = ''): string {
  return [
    'band',
    pick(BACKGROUNDS, blok.background, 'bg'),
    pick(SPACE_TOP, blok.space_top, 'md'),
    pick(SPACE_BOTTOM, blok.space_bottom, 'md'),
    pick(ALIGN, blok.align, 'left'),
    pick(WIDTH, blok.width, 'normal'),
    extra,
  ].filter(Boolean).join(' ');
}

/** Storyblok assets arrive as an object; an unset one still has a null filename. */
export function assetUrl(asset: unknown): string | undefined {
  if (!asset || typeof asset !== 'object') return undefined;
  const filename = (asset as { filename?: string }).filename;
  return filename || undefined;
}

export function assetAlt(asset: unknown, fallback = ''): string {
  if (!asset || typeof asset !== 'object') return fallback;
  return (asset as { alt?: string }).alt || fallback;
}

const RATIOS = {
  natural: '', square: 'ratio-square', portrait: 'ratio-portrait',
  landscape: 'ratio-landscape', banner: 'ratio-banner',
} as const;

export function ratioClass(value: unknown): string {
  return RATIOS[value as keyof typeof RATIOS] ?? '';
}
