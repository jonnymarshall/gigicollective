/**
 * Checks the Storyblok credentials and reports precisely what is wrong.
 *
 * Storyblok's errors are good but you only see them if you ask the right
 * endpoint. This asks several and interprets the answers, so a misconfigured
 * token gives a one-line diagnosis instead of a confusing 403.
 *
 *   npm run storyblok:doctor
 */
try {
  process.loadEnvFile();
} catch {
  // Fall back to the ambient environment, which is how this runs in CI.
}

const spaceId = process.env.STORYBLOK_SPACE_ID;
const mgmtToken = process.env.STORYBLOK_MANAGEMENT_TOKEN;
const previewToken = process.env.STORYBLOK_PREVIEW_TOKEN;

const REGIONS = {
  eu: { mapi: 'https://mapi.storyblok.com/v1', cdn: 'https://api.storyblok.com/v2' },
  us: { mapi: 'https://api-us.storyblok.com/v1', cdn: 'https://api-us.storyblok.com/v2' },
  ca: { mapi: 'https://api-ca.storyblok.com/v1', cdn: 'https://api-ca.storyblok.com/v2' },
  ap: { mapi: 'https://api-ap.storyblok.com/v1', cdn: 'https://api-ap.storyblok.com/v2' },
};

let failed = false;
const fail = (msg) => { failed = true; console.log('  ✗ ' + msg); };
const ok = (msg) => console.log('  ✓ ' + msg);

console.log('Credentials');
for (const [name, value] of [
  ['STORYBLOK_SPACE_ID', spaceId],
  ['STORYBLOK_PREVIEW_TOKEN', previewToken],
  ['STORYBLOK_MANAGEMENT_TOKEN', mgmtToken],
]) {
  if (!value) fail(`${name} is not set`);
  else ok(`${name} is set (${value.length} chars)`);
}
if (spaceId && !/^\d+$/.test(spaceId)) {
  fail(`STORYBLOK_SPACE_ID should be digits only. Storyblok shows it as "#1234567"; the # is not part of it.`);
}
if (failed) process.exit(1);

// Which region holds this space. A space that does not exist in a region 404s,
// while one that does but is not readable 403s, so the 403 is the signal.
console.log('\nRegion');
let region = null;
for (const [name, urls] of Object.entries(REGIONS)) {
  const res = await fetch(`${urls.mapi}/spaces/${spaceId}/components`, {
    headers: { Authorization: mgmtToken },
  });
  if (res.status !== 404) {
    region = name;
    ok(`space lives in the ${name.toUpperCase()} region`);
    break;
  }
}
if (!region) {
  fail('no region recognises this space id. Check the Space ID in Settings, General.');
  process.exit(1);
}

// Management token: scopes.
console.log('\nManagement token');
const res = await fetch(`${REGIONS[region].mapi}/spaces/${spaceId}/components`, {
  headers: { Authorization: mgmtToken },
});
const body = await res.text();

if (res.ok) {
  const count = JSON.parse(body).components?.length ?? 0;
  ok(`can read components (${count} currently in the space)`);

  const probe = await fetch(`${REGIONS[region].mapi}/spaces/${spaceId}/components`, {
    method: 'POST',
    headers: { Authorization: mgmtToken, 'Content-Type': 'application/json' },
    body: JSON.stringify({ component: { name: '', schema: {} } }),
  });
  // An empty name is rejected as invalid (422) when writing is allowed, and as
  // forbidden (403) when it is not. Nothing is created either way.
  if (probe.status === 403) fail('cannot write components. Tick Components > write.');
  else ok('can write components');
} else if (/insufficient scope/i.test(body)) {
  fail(`token is missing a scope: ${body}`);
  console.log('    Fix: edit the token (or make a new one) with Components > read AND write.');
} else if (/does not have access to this space/i.test(body)) {
  fail('token is not allowed to touch this space.');
  console.log('    Fix: set Space access to this space, or check the Space ID.');
} else {
  fail(`unexpected response ${res.status}: ${body.slice(0, 160)}`);
}

// Preview token: used at build time to read content.
console.log('\nPreview token');
const cdn = await fetch(
  `${REGIONS[region].cdn}/cdn/stories?version=draft&per_page=1&token=${previewToken}`,
);
if (cdn.ok) {
  const stories = (await cdn.json()).stories ?? [];
  ok(`can read content (${stories.length ? stories.length + ' story found' : 'space is empty, which is expected before the migration'})`);
} else {
  fail(`cannot read content: ${cdn.status} ${cdn.statusText}`);
  console.log('    Fix: use the Preview token from Settings > Access Tokens, not the Public one.');
}

console.log(failed ? '\nSomething needs fixing, see above.' : `\nAll good. Region: ${region.toUpperCase()}.`);
process.exit(failed ? 1 : 0);
