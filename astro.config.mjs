// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// IMPORTANT: change `site` to the real domain before going live.
// It is used to build absolute URLs in the sitemap and the RSS feed.
export default defineConfig({
  site: 'https://gigicollective.com',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: true },
  },
});
