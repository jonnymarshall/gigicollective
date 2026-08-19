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

if (problems.length) {
  console.error('config.yml has problems:');
  for (const p of problems) console.error('  -', p);
  process.exit(1);
}

const names = config.collections.map((c) => c.name).join(', ');
console.log(`config.yml is valid. Collections: ${names}`);
