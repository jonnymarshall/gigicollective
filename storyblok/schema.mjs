import { withStyle, styleFields } from './style-fields.mjs';

/**
 * The Storyblok component schema, kept in this repo as the source of truth.
 *
 * Defining it here rather than clicking it together in Storyblok's UI means it
 * is versioned, reviewable, and reproducible into a fresh space. Push changes
 * with: npm run storyblok:push
 */

const asset = (name) => ({ type: 'asset', display_name: name, filetypes: ['images'] });
const text = (name) => ({ type: 'text', display_name: name });
const textarea = (name) => ({ type: 'textarea', display_name: name });
const richtext = (name) => ({ type: 'richtext', display_name: name });
const bool = (name, def = false) => ({ type: 'boolean', display_name: name, default_value: def });

/** Sections that can be placed on a page. */
export const SECTION_COMPONENTS = ['hero', 'text', 'image_text', 'image', 'gallery', 'quote', 'cta', 'cards', 'columns', 'spacer'];

export const components = {
  // --- Content types --------------------------------------------------------
  page: {
    is_root: true,
    is_nestable: false,
    display_name: 'Page',
    schema: {
      body: {
        type: 'bloks',
        display_name: 'Sections',
        restrict_components: true,
        component_whitelist: SECTION_COMPONENTS,
      },
      seo_description: textarea('Search engine description'),
      show_in_nav: bool('Show in the top menu', true),
      nav_order: { type: 'number', display_name: 'Menu position', default_value: 0 },
    },
  },

  post: {
    is_root: true,
    is_nestable: false,
    display_name: 'Journal post',
    schema: {
      title: text('Title'),
      excerpt: textarea('Short summary'),
      published_at: { type: 'datetime', display_name: 'Date published', disable_time: true },
      hero_image: asset('Header image'),
      tags: { type: 'text', display_name: 'Tags', description: 'Comma separated' },
      body: richtext('Post content'),
    },
  },

  project: {
    is_root: true,
    is_nestable: false,
    display_name: 'Project',
    schema: {
      title: text('Title'),
      description: textarea('Short summary'),
      date: { type: 'datetime', display_name: 'Date', disable_time: true },
      cover_image: asset('Cover image'),
      body: richtext('Description'),
      gallery: {
        type: 'bloks',
        display_name: 'Gallery',
        restrict_components: true,
        component_whitelist: ['gallery_item'],
      },
    },
  },

  // --- Sections -------------------------------------------------------------
  hero: {
    is_nestable: true,
    display_name: 'Hero',
    schema: withStyle({
      eyebrow: text('Small line above'),
      heading: text('Big heading'),
      body: textarea('Sentence below'),
      image: asset('Background photograph'),
      button_label: text('Button text'),
      button_link: { type: 'text', display_name: 'Button goes to' },
      height: {
        type: 'option',
        display_name: 'Height',
        default_value: 'tall',
        options: [
          { name: 'Short', value: 'short' },
          { name: 'Tall', value: 'tall' },
          { name: 'Full screen', value: 'full' },
        ],
      },
      overlay: {
        type: 'option',
        display_name: 'Darken the photo',
        default_value: 'medium',
        options: [
          { name: 'None', value: 'none' },
          { name: 'Light', value: 'light' },
          { name: 'Medium', value: 'medium' },
          { name: 'Heavy', value: 'heavy' },
        ],
      },
    }),
  },

  text: {
    is_nestable: true,
    display_name: 'Text',
    schema: withStyle({
      eyebrow: text('Small line above'),
      heading: text('Heading'),
      body: richtext('Text'),
    }),
  },

  image_text: {
    is_nestable: true,
    display_name: 'Text beside an image',
    schema: withStyle({
      eyebrow: text('Small line above'),
      heading: text('Heading'),
      body: richtext('Text'),
      image: asset('Image'),
      image_side: {
        type: 'option',
        display_name: 'Image on the',
        default_value: 'right',
        options: [{ name: 'Left', value: 'left' }, { name: 'Right', value: 'right' }],
      },
      image_ratio: {
        type: 'option',
        display_name: 'Image shape',
        default_value: 'natural',
        options: [
          { name: 'As uploaded', value: 'natural' },
          { name: 'Square', value: 'square' },
          { name: 'Portrait', value: 'portrait' },
          { name: 'Landscape', value: 'landscape' },
        ],
      },
      button_label: text('Button text'),
      button_link: { type: 'text', display_name: 'Button goes to' },
    }),
  },

  image: {
    is_nestable: true,
    display_name: 'Image',
    schema: withStyle({
      image: asset('Image'),
      caption: text('Caption'),
      ratio: {
        type: 'option',
        display_name: 'Shape',
        default_value: 'natural',
        options: [
          { name: 'As uploaded', value: 'natural' },
          { name: 'Wide banner', value: 'banner' },
          { name: 'Square', value: 'square' },
        ],
      },
    }),
  },

  gallery: {
    is_nestable: true,
    display_name: 'Photo gallery',
    schema: withStyle({
      eyebrow: text('Small line above'),
      heading: text('Heading'),
      columns: {
        type: 'option',
        display_name: 'Photos per row',
        default_value: '3',
        options: [
          { name: '2', value: '2' },
          { name: '3', value: '3' },
          { name: '4', value: '4' },
        ],
      },
      ratio: {
        type: 'option',
        display_name: 'Photo shape',
        default_value: 'portrait',
        options: [
          { name: 'As uploaded', value: 'natural' },
          { name: 'Square', value: 'square' },
          { name: 'Portrait', value: 'portrait' },
          { name: 'Landscape', value: 'landscape' },
        ],
      },
      images: {
        type: 'bloks',
        display_name: 'Photos',
        restrict_components: true,
        component_whitelist: ['gallery_item'],
      },
    }),
  },

  gallery_item: {
    is_nestable: true,
    display_name: 'Photo',
    schema: { image: asset('Photo'), caption: text('Caption') },
  },

  quote: {
    is_nestable: true,
    display_name: 'Pull quote',
    schema: withStyle({
      eyebrow: text('Small line above'),
      quote: textarea('Quote'),
      attribution: text('Who said it'),
      role: text('Their role or project'),
      size: {
        type: 'option',
        display_name: 'Size',
        default_value: 'large',
        options: [
          { name: 'Normal', value: 'normal' },
          { name: 'Large', value: 'large' },
          { name: 'Very large', value: 'xlarge' },
        ],
      },
    }),
  },

  cta: {
    is_nestable: true,
    display_name: 'Call to action',
    schema: withStyle({
      eyebrow: text('Small line above'),
      heading: text('Heading'),
      body: textarea('Text'),
      button_label: text('Button text'),
      button_link: { type: 'text', display_name: 'Button goes to' },
      image: asset('Photograph'),
    }),
  },

  cards: {
    is_nestable: true,
    display_name: 'Row of cards',
    schema: withStyle({
      eyebrow: text('Small line above'),
      heading: text('Heading'),
      numbered: bool('Number them 01, 02, 03'),
      dividers: bool('Thin lines between them', true),
      items: {
        type: 'bloks',
        display_name: 'Cards',
        restrict_components: true,
        component_whitelist: ['card'],
      },
    }),
  },

  card: {
    is_nestable: true,
    display_name: 'Card',
    schema: { title: text('Title'), body: textarea('Text'), image: asset('Small image') },
  },

  /**
   * The freedom hatch. She chooses a column layout and drops any other section
   * into each column, so she can compose arrangements nobody designed up front.
   */
  columns: {
    is_nestable: true,
    display_name: 'Columns',
    schema: withStyle({
      layout: {
        type: 'option',
        display_name: 'Column layout',
        default_value: '1-1',
        options: [
          { name: 'Two equal', value: '1-1' },
          { name: 'Three equal', value: '1-1-1' },
          { name: 'Four equal', value: '1-1-1-1' },
          { name: 'Narrow then wide', value: '1-2' },
          { name: 'Wide then narrow', value: '2-1' },
        ],
      },
      vertical_align: {
        type: 'option',
        display_name: 'Line up vertically',
        default_value: 'top',
        options: [
          { name: 'Top', value: 'top' },
          { name: 'Middle', value: 'middle' },
          { name: 'Bottom', value: 'bottom' },
        ],
      },
      items: {
        type: 'bloks',
        display_name: 'Column contents',
        restrict_components: true,
        component_whitelist: ['text', 'image', 'quote', 'cards', 'gallery'],
      },
    }),
  },

  spacer: {
    is_nestable: true,
    display_name: 'Space or divider',
    schema: {
      size: styleFields.space_top,
      line: bool('Draw a thin line'),
      background: styleFields.background,
    },
  },
};
