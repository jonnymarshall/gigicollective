/**
 * Pushes the component schema in storyblok/schema.mjs into a Storyblok space.
 *
 * Keeping the schema in this repo means it is versioned and reviewable, and a
 * fresh space can be rebuilt from scratch in one command. Storyblok's UI is for
 * writing content; the structure lives here.
 *
 *   STORYBLOK_SPACE_ID=... STORYBLOK_MANAGEMENT_TOKEN=... npm run storyblok:push
 *
 * Safe to re-run: existing components are updated in place, not duplicated.
 */
import StoryblokClient from 'storyblok-js-client';
import { components } from '../storyblok/schema.mjs';

// Load the local environment file if there is one, so the credentials never have
// to be typed onto a command line where they would land in shell history.
try {
  process.loadEnvFile();
} catch {
  // No local file. Fall back to whatever is already in the environment, which is
  // how this runs in CI.
}

const spaceId = process.env.STORYBLOK_SPACE_ID;
const token = process.env.STORYBLOK_MANAGEMENT_TOKEN;
const dryRun = process.argv.includes('--dry-run');

if (!dryRun && (!spaceId || !token)) {
  console.error(
    'Missing credentials.\n' +
    '  STORYBLOK_SPACE_ID          Settings > General, the numeric Space ID\n' +
    '  STORYBLOK_MANAGEMENT_TOKEN  My Account > Personal access tokens\n\n' +
    'Run with --dry-run to check the schema without pushing.',
  );
  process.exit(1);
}

if (dryRun) {
  for (const [name, def] of Object.entries(components)) {
    const fields = Object.keys(def.schema);
    console.log(`${name.padEnd(14)} ${String(fields.length).padStart(2)} fields  ${fields.join(', ')}`);
  }
  console.log(`\n${Object.keys(components).length} components. Dry run, nothing pushed.`);
  process.exit(0);
}

const client = new StoryblokClient({ oauthToken: token });

const existing = new Map();
const { data } = await client.get(`spaces/${spaceId}/components`);
for (const component of data.components) existing.set(component.name, component.id);

let created = 0;
let updated = 0;

for (const [name, definition] of Object.entries(components)) {
  const payload = {
    component: {
      name,
      display_name: definition.display_name,
      is_root: definition.is_root ?? false,
      is_nestable: definition.is_nestable ?? true,
      schema: definition.schema,
    },
  };

  try {
    if (existing.has(name)) {
      await client.put(`spaces/${spaceId}/components/${existing.get(name)}`, payload);
      updated++;
      console.log(`updated  ${name}`);
    } else {
      await client.post(`spaces/${spaceId}/components`, payload);
      created++;
      console.log(`created  ${name}`);
    }
  } catch (error) {
    console.error(`FAILED   ${name}:`, error?.message ?? error);
    process.exitCode = 1;
  }
}

console.log(`\n${created} created, ${updated} updated.`);
