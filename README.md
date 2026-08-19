# gigicollective

The website for Gigi Collective. A static site with a browser-based editor, hosted free.

- **Astro** builds plain HTML from markdown files
- **GitHub Pages** hosts it, rebuilding automatically whenever content is published
- **Sveltia CMS** at `/admin` is where content is written. It saves straight into this repo

No server, no database, no monthly bill.

## Where this is up to

- [x] Site built, blog / pages / work sections working
- [x] Repo created and pushed
- [x] GitHub Pages turned on, deploying automatically on every push
- [x] Cloudflare login helper set up, see [docs/03](docs/03-cms-login-setup.md)
- [x] She has a GitHub account and a collaborator invite
- [x] CMS login working, she has published a change successfully
- [x] Staging site live at https://new.gigicollective.com, see [docs/08](docs/08-staging-and-going-live.md)
- [ ] Real content replacing the placeholders
- [ ] Domain pointed at the site, see [docs/04](docs/04-hosting-and-domain.md)
- [ ] `PUBLIC_NOINDEX` removed on launch day
- [ ] HostGator cancelled, see [docs/00](docs/00-leaving-hostgator.md)

**Staging site: https://new.gigicollective.com** — fully working, and carrying a `noindex`
tag so Google ignores it. Review and content migration happen here.
`gigicollective.com` itself is still served by HostGator and is untouched.

## Requirements

Astro 7 needs **Node 22 or newer**. Check with `node -v`.

If it reports Node 20 or older:

```bash
nvm install 22 && nvm use 22
```

There is a `.nvmrc` in this folder, so `nvm use` on its own will pick the right version once
22 is installed.

### Note on the `satteri` pin in package.json

`package.json` contains this:

```json
"overrides": { "satteri": "0.10.3" }
```

`satteri` is the markdown processor Astro 7 uses internally. Version 0.10.4 was published
without its Apple Silicon binary, so it cannot run on an M-series Mac. Astro accepts `^0.10.3`,
so this pins it to the last version that shipped a complete set.

Remove the override once a later version is out with all platform binaries published, and run
`npm run verify` to confirm.

## Running it locally

```bash
npm install
npm run dev
```

Then open http://localhost:4321

| Command | What it does |
|---|---|
| `npm run dev` | Local preview with live reload |
| `npm run build` | Build the site into `dist/`. This is what CI runs |
| `npm run check` | Type check only |
| `npm run verify` | Type check, validate the CMS config, and build. Run this before pushing |
| `npm run check:cms` | Validate `public/admin/config.yml` on its own. A broken one gives her a blank editor with no error |

To try the editor locally, open http://localhost:4321/admin/index.html and choose **Work with
Local Repository**. No login needed, changes save to disk.

## Where things live

```
src/
  content/posts/       blog posts (markdown, written via the CMS)
  content/pages/       standalone pages: about, contact, etc
  content/projects/    work / gallery items
  data/site.json       site name, footer, contact, social links
  data/home.json       everything on the front page
  content.config.ts    what fields each content type has
  layouts/             the page shell: head tags, header, footer
  components/          header, footer, cards
  lib/                 small shared helpers (date formatting, slugs)
  pages/               the routes. File path maps to web address
  styles/global.css    all the styling. Design tokens at the top
public/
  admin/config.yml     what the editing screens look like
  images/uploads/      images uploaded through the CMS land here
```

## Two rules when changing things

**1. Content fields live in two files.** `src/content.config.ts` says what a post is allowed
to contain. `public/admin/config.yml` says what she sees when editing one. Add a field to one
and you must add it to the other, or they disagree and the build fails.

Page sections live in **three** places: the schema in `src/content.config.ts`, a component in
`src/components/blocks/`, and a branch in `src/components/Blocks.astro`. The switch statement
in `Blocks.astro` is written out rather than looked up in a map precisely so that forgetting
one of these fails the build instead of silently dropping the section.

Design options live in `src/lib/theme.ts` and must have a matching entry in the `Look and
feel` fields of `config.yml`.

**2. Restyle from the top of `global.css`.** The colours, fonts and spacing are all CSS
variables defined in one block at the top. Changing those restyles the whole site without
touching any component.

## Setup, start to finish

Read these in order:

| Doc | What it covers |
|---|---|
| [00-leaving-hostgator.md](docs/00-leaving-hostgator.md) | What to check and back up before cancelling anything |
| [01-architecture-decision.md](docs/01-architecture-decision.md) | Why this stack, and what was rejected |
| [02-setup-the-repo.md](docs/02-setup-the-repo.md) | Getting the code onto GitHub. Public vs private matters here |
| [03-cms-login-setup.md](docs/03-cms-login-setup.md) | The login helper. The only fiddly part |
| [04-hosting-and-domain.md](docs/04-hosting-and-domain.md) | Switching on hosting, DNS, HTTPS, redirects |
| [05-guide-for-the-editor.md](docs/05-guide-for-the-editor.md) | **Send this one to her.** Everything she needs |
| [06-contact-form.md](docs/06-contact-form.md) | Adding a working contact form |
| [07-moving-the-content-across.md](docs/07-moving-the-content-across.md) | Getting the old content over |
| [08-staging-and-going-live.md](docs/08-staging-and-going-live.md) | Previewing the finished site safely, then the launch day sequence |

## Placeholders to replace before launch

Search for these and swap them out:

- `example.com` in `astro.config.mjs` and `public/robots.txt`
- `YOUR-GITHUB-USERNAME/YOUR-REPO-NAME` in `public/admin/config.yml`
- `YOUR-WORKER-NAME` in `public/admin/config.yml`
- The starter content in `src/data/site.json` and `src/data/home.json`
- The example post and project in `src/content/`
