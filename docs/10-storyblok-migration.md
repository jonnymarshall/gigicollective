# Moving to Storyblok

## Why

Sveltia is a form. Storyblok lets her open the actual site, click on a heading, and
type. Sections drag to reorder and the real page rearranges as she does it.

She was described as a designer rather than an arranger, so the section schema is
built with that in mind: every section carries its own style controls, and there is
a Columns section she can compose freely inside. See "Freedom built in" below.

## What she gains, concretely

| Now (Sveltia) | After (Storyblok) |
|---|---|
| Fill in fields, publish, then go and look | Click the thing on the page and change it |
| Sections reorder by dragging a handle in a list | Sections reorder on the page itself |
| A preview that shows fields, not the site | The actual site, live |
| Needs a GitHub account and a collaborator invite | Signs in with her email address |
| Every layout decision goes through you | Spacing, alignment, width, colour band, image shape are hers |

## What disappears

The Cloudflare login worker, the GitHub OAuth app, her GitHub account, the
collaborator invite, and `docs/03` entirely. Storyblok has its own login. That was
the most awkward hour of this whole setup and it stops existing.

## What does not change

The domain, the DNS, the `new.` staging subdomain, HTTPS, the repository, the
GitHub Actions deploy, and the entire visual design. Astro still builds the site
and GitHub Pages still serves it. Only where the words live, and how she edits
them, is different.

---

## Freedom built in

Every section has these, so she can change how it looks without asking:

- **Background**: page, tinted band, or dark band
- **Space above** and **Space below**: none through extra large
- **Text alignment**: left or centred
- **Content width**: narrow, normal, wide, or edge to edge

Plus per-section controls. The hero has height and how much the photo is darkened.
Images have a shape option. The gallery has photos per row and photo shape. Quotes
have three sizes.

And a **Columns** section: she picks a layout (two equal, three equal, narrow then
wide, and so on) and drops other sections into each column. That is the hatch for
arrangements nobody designed up front.

Every option still resolves to a value the stylesheet understands, so none of this
can produce something that breaks on a phone.

---

## The schema lives in this repo

`storyblok/schema.mjs` is the source of truth for the 15 components, not
Storyblok's UI. It is versioned, reviewable in a diff, and a fresh space can be
rebuilt from it in one command.

```bash
npm run storyblok:check
```

```bash
npm run storyblok:push
```

Re-running is safe. Existing components are updated in place, never duplicated.

---

## What I need from you

**1. A Storyblok account and a space.** Free, at https://app.storyblok.com/#/signup

When creating the space you choose a **region**, and it cannot be changed later.
Pick the one closest to where her visitors are. This only affects build speed, not
the live site, because the site is built ahead of time.

**2. Three values.** None of them should be pasted into chat. Put them in a local
environment file in the project root, which is already git-ignored:

| Value | Where to find it |
|---|---|
| Space ID | Settings, General. A number |
| Preview token | Settings, Access Tokens. Used at build time |
| Personal access token | My Account, Personal access tokens. Used only to push the schema |

The three variable names the scripts expect are `STORYBLOK_SPACE_ID`,
`STORYBLOK_PREVIEW_TOKEN` and `STORYBLOK_MANAGEMENT_TOKEN`.

**3. Tell me when that file exists** and I will push the schema and rewire the site.

---

## Then, in order

- [ ] 1. Push the component schema into the space
- [ ] 2. Rewire Astro to fetch from Storyblok instead of markdown files
- [ ] 3. Wire up the visual editor bridge, so clicking the page opens the right field
- [ ] 4. Point Storyblok's preview at `new.gigicollective.com`
- [ ] 5. Move the existing content across. There is very little of it, so this is quick
- [ ] 6. **Build the content backup job.** See "Backups" above. Do not skip this
- [ ] 7. Add a Storyblok webhook so publishing triggers a rebuild, replacing the git commit
- [ ] 8. Have her use it properly for a few days
- [ ] 9. Only then delete the Sveltia admin, the Cloudflare worker, the OAuth app, and `docs/03`

Step 9 happens last and only once she has confirmed the new editor works for her.
Until then both editors exist side by side and nothing is lost.

## Backups: AGREED, NOT YET BUILT

Content will live on Storyblok's servers rather than in your repo. That is the real
trade for the visual editing, and their free tier has **no automated export**. If the
account is lost or the free tier changes, there is no copy of her writing anywhere.

**Jonny has asked for this and it is owed.** A scheduled GitHub Action that pulls the
whole space to JSON and commits it to this repo, so the content is versioned here
even though it is authored there.

Build it at **step 6**, right after the first real content lands, and before the
HostGator site is cancelled. Not earlier, because there is nothing to back up yet,
and not later, because "later" is how content gets lost.

Tracked in the checklist above so it cannot be quietly skipped.

## The one-seat limit

The free tier includes one editor seat. That should be her, since you work in code
and do not need to edit content.

If you both end up needing to edit, the next tier is $99 a month, which is a cliff
rather than a step. Worth confirming one seat is genuinely enough before the
content migration, because that is the point after which switching again gets
expensive in time.
