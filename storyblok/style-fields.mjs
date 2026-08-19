/**
 * Style controls attached to every section.
 *
 * She was described as a designer rather than an arranger, so these exist to let
 * her change how a section looks without asking for code. Each one still resolves
 * to a value the stylesheet understands, so there is no way to produce something
 * that breaks on a phone.
 */
export const styleFields = {
  background: {
    type: 'option',
    display_name: 'Background',
    default_value: 'bg',
    options: [
      { name: 'Page background', value: 'bg' },
      { name: 'Tinted band', value: 'tint' },
      { name: 'Dark band', value: 'dark' },
    ],
  },
  space_top: {
    type: 'option',
    display_name: 'Space above',
    default_value: 'md',
    options: [
      { name: 'None', value: 'none' },
      { name: 'Small', value: 'sm' },
      { name: 'Medium', value: 'md' },
      { name: 'Large', value: 'lg' },
      { name: 'Extra large', value: 'xl' },
    ],
  },
  space_bottom: {
    type: 'option',
    display_name: 'Space below',
    default_value: 'md',
    options: [
      { name: 'None', value: 'none' },
      { name: 'Small', value: 'sm' },
      { name: 'Medium', value: 'md' },
      { name: 'Large', value: 'lg' },
      { name: 'Extra large', value: 'xl' },
    ],
  },
  align: {
    type: 'option',
    display_name: 'Text alignment',
    default_value: 'left',
    options: [
      { name: 'Left', value: 'left' },
      { name: 'Centred', value: 'center' },
    ],
  },
  width: {
    type: 'option',
    display_name: 'Content width',
    default_value: 'normal',
    options: [
      { name: 'Narrow', value: 'narrow' },
      { name: 'Normal', value: 'normal' },
      { name: 'Wide', value: 'wide' },
      { name: 'Edge to edge', value: 'full' },
    ],
  },
};

/** Every section gets the style controls plus its own content fields. */
export const withStyle = (fields) => ({ ...fields, ...styleFields });
