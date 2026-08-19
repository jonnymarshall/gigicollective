import { marked } from 'marked';

/**
 * Blocks store their rich text in a frontmatter field rather than the page body,
 * so Astro does not render it for us. Content comes from the CMS and is written
 * by a trusted editor, so no sanitising step is needed.
 */
export function renderMarkdown(value?: string): string {
  if (!value) return '';
  return marked.parse(value, { async: false }) as string;
}
