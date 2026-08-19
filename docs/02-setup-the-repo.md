# Step 1: Get the code onto GitHub

> **Done.** The repo exists at https://github.com/jonnymarshall/gigicollective and
> GitHub Pages is switched on. This is kept as a record of what was decided and why.

Everything after this depends on the code being in a GitHub repository, so do this first.

## Before you start: pick public or private

This one catches people out.

**On a free GitHub account, GitHub Pages only works from a public repository.**
Private repositories need GitHub Pro, which is about $4 a month.

Three ways to handle it:

| Choice | Cost | Trade-off |
|---|---|---|
| **Public repository** | free | Anyone can read the code and the draft content. The site is public anyway, so this mostly matters if drafts are sensitive. |
| Private + GitHub Pro | ~$4/mo | Nothing changes about the setup, you just pay. |
| Private + host on Cloudflare Pages instead | free | Cloudflare serves private repos for free. Slightly different hosting steps, everything else identical. |

Public is the simplest and is what most personal sites do. Note that drafts do sit in the
repository even when hidden from the site, so if that matters, pick one of the other two.

## Create the repository

```bash
cd /Users/jonny/code/wife-site
git init -b main
git add -A
git commit -m "Initial site"
```

Then create it on GitHub and push. With the `gh` command line tool:

```bash
gh repo create gigicollective --public --source=. --remote=origin --push
```

Swap `--public` for `--private` if you went that way.

## Fill in the four placeholders

Search the project for `example.com`, `YOUR-GITHUB-USERNAME`, `YOUR-REPO-NAME` and
`YOUR-WORKER-NAME` and replace them. They live in:

| File | What to change |
|---|---|
| `astro.config.mjs` | `site:` → the real domain |
| `public/robots.txt` | the `Sitemap:` line → the real domain |
| `public/admin/config.yml` | `repo:` → `jonnymarshall/gigicollective` |
| `public/admin/config.yml` | `site_url:` → the real domain |
| `public/admin/config.yml` | `base_url:` → the Cloudflare Worker address from the next doc |

The `base_url` one comes from step 2, so leave it for now and come back.

## Check it still builds

```bash
npm run verify
```

That runs a type check and a full build. If it says `Complete!` with no errors, push it.
