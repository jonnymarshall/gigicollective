// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { storyblok } from '@storyblok/astro';
import { loadEnv } from 'vite';

// Astro does not expose non-PUBLIC_ variables to the config file itself, so load
// them here. This is the same file the scripts read.
const env = loadEnv(process.env.NODE_ENV ?? 'development', process.cwd(), '');
const storyblokToken = env.STORYBLOK_PREVIEW_TOKEN ?? process.env.STORYBLOK_PREVIEW_TOKEN;

export default defineConfig({
  site: 'https://gigicollective.com',

  integrations: [
    sitemap(),

    // Content is authored in Storyblok. The markdown collections still work
    // alongside this while the migration is in progress; see src/lib/pages.ts.
    //
    // Registered unconditionally, even with no token. It provides the
    // `virtual:storyblok-options` module that StoryblokComponent imports, and
    // making it conditional breaks the build wherever the token is absent
    // rather than degrading gracefully. Fetching is what handles a bad token.
    storyblok({
      accessToken: storyblokToken ?? '',
      apiOptions: { region: 'eu' },
      bridge: true,
      componentsDir: 'src',
      enableFallbackComponent: true,
      customFallbackComponent: 'storyblok/UnknownBlock',
      components: {
        page: 'storyblok/Page',
        hero: 'storyblok/Hero',
        text: 'storyblok/Text',
        image_text: 'storyblok/ImageText',
        image: 'storyblok/Image',
        gallery: 'storyblok/Gallery',
        gallery_item: 'storyblok/GalleryItem',
        quote: 'storyblok/Quote',
        cta: 'storyblok/Cta',
        cards: 'storyblok/Cards',
        card: 'storyblok/Card',
        columns: 'storyblok/Columns',
        spacer: 'storyblok/Spacer',
      },
    }),
  ],

  // Fonts are downloaded at build time and served from our own domain, so there
  // is no request to Google when someone visits, and no layout shift while they load.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Cormorant Garamond',
      cssVariable: '--font-serif',
      weights: [300, 400, 500, 600],
      styles: ['normal', 'italic'],
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Jost',
      cssVariable: '--font-sans',
      weights: [300, 400, 500],
      // Body copy never needs italics in this design, so do not ship them.
      styles: ['normal'],
      fallbacks: ['Helvetica Neue', 'Arial', 'sans-serif'],
    },
  ],

  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
  },
});
