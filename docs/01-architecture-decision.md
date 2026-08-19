# Architecture decision

## The plan being evaluated (from Gemini)

- Astro for the site
- GitHub Pages for hosting
- Decap CMS (or Sanity) as the editor

## Verdict

Two of the three are right. The third needs swapping.

### Astro: keep it. Correct call.

Astro turns markdown files into plain HTML at build time. There is no server, no database,
no PHP, nothing to patch or get hacked. It is the right tool for a content site and it is
well understood, so generating it is reliable.

### GitHub Pages: fine, with one caveat.

Free, custom domain, free HTTPS, rebuilds automatically when content changes. Good enough.

Caveat: Cloudflare Pages is free too and is a bit better in practice. It gives preview
builds, faster global delivery, and a simple "rebuild now" button. It still deploys from the
exact same GitHub repository, so nothing about the code changes. If the domain moves to
Cloudflare anyway (see the HostGator doc), putting hosting there too means one less account.

This is a swap that can happen later without touching the site code, so it is not urgent.

### Decap CMS: swap it for Sveltia CMS.

Decap is the old Netlify CMS. It still works and is still maintained, but development moves
slowly and a lot of the rough edges (clunky image handling, an unreliable draft/review mode)
land on the person doing the writing, not the person doing the code.

**Sveltia CMS** is a rebuild of the same idea by a different team. It reads the same
configuration file format, so it is a genuine drop-in swap, but it is far nicer to actually
use: much faster, proper drag-and-drop image handling, works on a phone, and it has fixed a
few hundred issues Decap never got to.

Same architecture, same cost (free), better day-to-day experience for her. There is no real
argument for choosing Decap over it in 2026.

Sources:
- https://github.com/sveltia/sveltia-cms
- https://decapcms.org/docs/github-backend/

## The one real decision left: where does the content live?

Both options give her a web page she logs into and writes on. She never sees code either way.
The difference is where the words and images are stored.

### Option A: Sveltia CMS (git-based)

Her writing is saved as markdown files inside your GitHub repository.

- Cost: free, permanently. No company can change its pricing on you.
- Content is plain text files you own. Nothing to be locked out of.
- She needs a free GitHub account, added to the repo so the editor can save on her behalf.
  She signs up once and then never visits GitHub again. She only ever opens
  `herdomain.com/admin`.
- One-time setup by you: a small free login helper deployed to Cloudflare. About 10 minutes,
  done once, then forgotten.
- Publishing takes about 60 to 90 seconds to appear on the live site.

### Option B: Sanity (hosted)

Her writing is saved on Sanity's servers, and the site pulls it in when it builds.

- She logs in with Google or an email link. No GitHub account at all.
- The nicest editing experience of the two: better image cropping, live preview.
- Free tier covers this easily (2 editor seats, 10,000 documents, 20 GB of images).
- Cost: it is a company's free tier. Free tiers get worse over time. Content lives on their
  servers, so it needs backing up separately.
- More setup work for you, and more moving parts to maintain long term.

### Recommendation: Option A, Sveltia CMS.

The brief was "reduce complexity, especially for her" and "free". Option A is the one with
fewer long-term dependencies and no bill that can appear later. The only friction is the
one-time GitHub signup, which is a two-minute job that never recurs.

Pick Option B instead if she is likely to be uploading and cropping lots of photos every week,
where the better image tooling genuinely earns its keep.

## Note on "she must not touch the code"

Practically, this is already solved. She gets one bookmark, `herdomain.com/admin`, and that
page only ever shows her the fields we choose to give her. There is no code visible anywhere
in it.

Technically, with Option A she is a collaborator on the repository, which means GitHub would
let her edit code if she went looking for it. She will not. If that still feels wrong, there
is a two-repository variant (code in a private repo only you can see, content in a separate
repo she can access) which gives hard separation at the cost of a slightly more complex build.
Say the word and it can be built that way.
