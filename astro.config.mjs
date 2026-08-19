// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gigicollective.com',
  integrations: [sitemap()],

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
