import { useStoryblokApi } from '@storyblok/astro';
import type { ISbStoryData } from '@storyblok/astro';

/**
 * Page routing during the migration.
 *
 * Content is moving from markdown files to Storyblok one page at a time. Both
 * sources are read, and **Storyblok wins where a slug exists in both**. That way
 * moving a page across is a single action in the CMS, with no code change and no
 * moment where the page is missing from the site.
 *
 * Once everything has moved, the markdown half of this can be deleted along with
 * the Sveltia admin.
 */

const isEnabled = Boolean(
  import.meta.env.STORYBLOK_PREVIEW_TOKEN ?? process.env.STORYBLOK_PREVIEW_TOKEN,
);

/** Drafts are visible on staging so she can check work before publishing. */
const version: 'draft' | 'published' =
  import.meta.env.PUBLIC_NOINDEX === 'true' ? 'draft' : 'published';

export interface StoryblokPage {
  slug: string;
  name: string;
  story: ISbStoryData;
}

export async function getStoryblokPages(): Promise<StoryblokPage[]> {
  if (!isEnabled) return [];

  try {
    const api = useStoryblokApi();
    const { data } = await api.get('cdn/stories', {
      version,
      content_type: 'page',
      per_page: 100,
      resolve_links: 'url',
    });

    return (data.stories ?? [])
      // The site root is still built by src/pages/index.astro. Two files cannot
      // claim "/", so a Storyblok story at "home" is skipped until the home page
      // is deliberately migrated. Without this the build fails on a route clash
      // the moment someone names a page "home".
      .filter((story: ISbStoryData) => story.full_slug !== 'home' && story.full_slug !== '')
      .map((story: ISbStoryData) => ({
        slug: story.full_slug,
        name: story.name,
        story,
      }));
  } catch (error) {
    // A missing or wrong token must not take the whole site down mid-migration.
    // The markdown pages still build, and the doctor script explains the cause.
    console.warn(
      '[storyblok] could not fetch pages, falling back to markdown only:',
      error instanceof Error ? error.message : error,
    );
    return [];
  }
}

export { isEnabled as storyblokEnabled, version as storyblokVersion };
