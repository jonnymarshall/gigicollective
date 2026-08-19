// Validates public/admin/config.yml before it can reach her.
// A malformed config renders the editor as a blank page with no error on screen.
import { readFileSync } from 'node:fs';
import { load } from 'js-yaml';

let config;
try {
  config = load(readFileSync('public/admin/config.yml', 'utf8'));
} catch (error) {
  console.error('config.yml is not valid YAML:\n', error.message);
  process.exit(1);
}

const problems = [];

if (!config?.backend?.repo) problems.push('backend.repo is missing');
if (!config?.backend?.base_url) problems.push('backend.base_url is missing');
if (!config?.media_folder) problems.push('media_folder is missing');
if (!Array.isArray(config?.collections) || !config.collections.length) {
  problems.push('no collections defined');
}

for (const collection of config.collections ?? []) {
  const where = collection.name ?? '(unnamed)';
  if (!collection.folder && !collection.files) {
    problems.push(`collection "${where}" has neither folder nor files`);
  }
  const fieldGroups = collection.files
    ? collection.files.map((f) => [`${where}/${f.name}`, f.fields])
    : [[where, collection.fields]];

  for (const [label, fields] of fieldGroups) {
    if (!Array.isArray(fields) || !fields.length) {
      problems.push(`"${label}" has no fields`);
      continue;
    }
    for (const field of fields) {
      if (!field?.name) problems.push(`"${label}" has a field with no name`);
      if (!field?.widget) problems.push(`"${label}".${field?.name} has no widget`);
    }
  }
}


// ---------------------------------------------------------------------------
// Cross-check the section types against the Astro schema.
//
// These two files have to agree. If the CMS offers a field or a dropdown value
// that the schema rejects, the build fails the moment she picks it, and the
// failure lands on her publish rather than on ours. Catch it here instead.
// ---------------------------------------------------------------------------

const schemaSource = readFileSync('src/content.config.ts', 'utf8');

/** The slice of the schema that defines one block type, so checks stay scoped. */
function schemaSliceFor(typeName) {
  const marker = `z.literal('${typeName}')`;
  const start = schemaSource.indexOf(marker);
  if (start === -1) return null;
  const next = schemaSource.indexOf('z.literal(', start + marker.length);
  return schemaSource.slice(start, next === -1 ? schemaSource.length : next);
}

/**
 * Shared enums declared once at the top, like `const background = z.enum([...])`,
 * and then referenced from several block types. Without resolving these, every
 * field using one looks like a mismatch.
 */
const sharedEnums = new Map();
for (const match of schemaSource.matchAll(/const\s+(\w+)\s*=\s*z\.enum\(\[([^\]]*)\]\)/g)) {
  const values = [...match[2].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  sharedEnums.set(match[1], values);
}

/** The values a given field is allowed to hold, or null if it is not an enum. */
function allowedValues(slice, fieldName) {
  const inline = slice.match(new RegExp(`\\b${fieldName}\\s*:\\s*z\\.enum\\(\\[([^\\]]*)\\]`));
  if (inline) return [...inline[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);

  const named = slice.match(new RegExp(`\\b${fieldName}\\s*:\\s*(\\w+)`));
  if (named && sharedEnums.has(named[1])) return sharedEnums.get(named[1]);

  return null;
}

const pages = config.collections.find((c) => c.name === 'pages');
const blocks = pages?.fields?.find((f) => f.name === 'blocks');

for (const type of blocks?.types ?? []) {
  const slice = schemaSliceFor(type.name);
  if (!slice) {
    problems.push(`section "${type.name}" has no matching z.literal in content.config.ts`);
    continue;
  }
  for (const field of type.fields ?? []) {
    if (!new RegExp(`\\b${field.name}\\s*:`).test(slice)) {
      problems.push(`section "${type.name}" offers field "${field.name}" which the schema does not define`);
    }
    if (field.widget === 'select' && Array.isArray(field.options)) {
      const allowed = allowedValues(slice, field.name);
      if (allowed) {
        for (const option of field.options) {
          const value = typeof option === 'object' ? option.value : option;
          if (typeof value === 'string' && !allowed.includes(value)) {
            problems.push(
              `section "${type.name}".${field.name} offers "${value}", but the schema allows ` +
              `only ${allowed.map((v) => `"${v}"`).join(', ')}. Choosing it in the CMS would fail the build.`,
            );
          }
        }
      }
    }
  }
}

if (problems.length) {
  console.error('config.yml has problems:');
  for (const p of problems) console.error('  -', p);
  process.exit(1);
}

const names = config.collections.map((c) => c.name).join(', ');
console.log(`config.yml is valid. Collections: ${names}`);
