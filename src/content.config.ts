import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Every field defined here has a matching field in public/admin/config.yml.
 * If you add a field in one place, add it in the other, or the CMS and the
 * site will disagree about what a piece of content looks like.
 */


/**
 * The blocks a page can be built from. Each entry matches an option in the
 * "Page sections" list in public/admin/config.yml and a component in
 * src/components/blocks/. Add a block in all three places or not at all.
 */
const galleryItem = z.object({ image: z.string(), caption: z.string().optional() });

/** Which full-width band a section sits on. Alternating these gives the page its rhythm. */
const background = z.enum(['bg', 'tint', 'dark']);

const block = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('text'),
    eyebrow: z.string().optional(),
    heading: z.string().optional(),
    text: z.string().optional(),
    width: z.enum(['narrow', 'wide']).default('narrow'),
    background: background.default('bg'),
  }),
  z.object({
    type: z.literal('imageText'),
    eyebrow: z.string().optional(),
    heading: z.string().optional(),
    text: z.string().optional(),
    image: z.string().optional(),
    imageSide: z.enum(['left', 'right']).default('right'),
    linkLabel: z.string().optional(),
    linkUrl: z.string().optional(),
    background: background.default('bg'),
  }),
  z.object({
    type: z.literal('image'),
    image: z.string().optional(),
    caption: z.string().optional(),
    width: z.enum(['wide', 'full']).default('wide'),
    background: background.default('bg'),
  }),
  z.object({
    type: z.literal('gallery'),
    eyebrow: z.string().optional(),
    heading: z.string().optional(),
    images: z.array(galleryItem).default([]),
    columns: z.number().default(3),
    background: background.default('bg'),
  }),
  z.object({
    type: z.literal('quote'),
    eyebrow: z.string().optional(),
    quote: z.string().optional(),
    attribution: z.string().optional(),
    role: z.string().optional(),
    background: background.default('tint'),
  }),
  z.object({
    type: z.literal('cta'),
    eyebrow: z.string().optional(),
    heading: z.string().optional(),
    text: z.string().optional(),
    buttonLabel: z.string().optional(),
    buttonUrl: z.string().optional(),
    image: z.string().optional(),
    background: background.default('dark'),
  }),
  z.object({
    type: z.literal('features'),
    eyebrow: z.string().optional(),
    heading: z.string().optional(),
    numbered: z.boolean().default(false),
    items: z
      .array(z.object({
        title: z.string(),
        text: z.string().optional(),
        image: z.string().optional(),
      }))
      .default([]),
    background: background.default('tint'),
  }),
]);

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    heroImage: z.string().optional(),
    showInNav: z.boolean().default(true),
    navOrder: z.number().default(0),
    draft: z.boolean().default(false),
    blocks: z.array(block).default([]),
  }),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    coverImage: z.string().optional(),
    date: z.coerce.date(),
    gallery: z
      .array(z.object({ image: z.string(), caption: z.string().optional() }))
      .default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, pages, projects };
