# Step 3: Turn on hosting and point the domain at it

## 3a. Switch on GitHub Pages

In the repository: **Settings** → **Pages** → under **Source**, choose **GitHub Actions**.

That is the whole setting. The workflow file at `.github/workflows/deploy.yml` is already in
the project and does the rest.

Push anything to `main` and watch the **Actions** tab. The first run takes a couple of
minutes. When it goes green, the site is live at `https://yourusername.github.io/wife-site/`.

That address will look slightly broken (styling and links off) because the site is configured
for a real domain at the root, not a subfolder. That is expected and fixes itself in the next
step. If you want to check it properly before the domain is ready, run `npm run dev` locally.

## 3b. Add the domain

Two parts, and they have to agree with each other.

**On GitHub:** Settings → Pages → **Custom domain** → type `herdomain.com` → Save.

That writes a file called `CNAME` into the repository. Do not delete it. If you ever rename
or move the repo, check it is still there.

**At the DNS provider** (wherever the domain's records are managed, which for now is
HostGator), create these records:

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| CNAME | `www` | `yourusername.github.io` |

All four A records are needed. They are GitHub's servers and are the same for everyone.

If the domain moved to Cloudflare, add the same records there, and set the four A records to
**DNS only** (grey cloud) rather than proxied, at least until HTTPS is working.

## 3c. Wait, then turn on HTTPS

DNS changes take anywhere from a few minutes to a few hours to spread. Once they have,
GitHub's Pages settings page will stop showing a warning and the **Enforce HTTPS** checkbox
becomes available. Tick it.

Do not skip this. Without it the site loads over an insecure connection and browsers show a
"Not secure" warning next to the address.

## 3d. Old addresses

If the HostGator site had pages at addresses the new site does not use, add redirects so
that visitors and Google land somewhere sensible instead of a 404 page.

The simplest approach on a static site is a small HTML file per old address. For example, to
send `/old-page` to `/about`, create `public/old-page/index.html`:

```html
<!doctype html>
<meta http-equiv="refresh" content="0; url=/about">
<link rel="canonical" href="https://herdomain.com/about">
```

Use the URL list from `docs/00-leaving-hostgator.md` step 3 to work out which ones are worth
doing. Anything with real traffic is worth it. One-off pages nobody visits are not.

## 3e. Tell Google about the new site

1. Add the site at https://search.google.com/search-console
2. Verify ownership (the DNS record method is easiest since you are already in the DNS settings)
3. Submit the sitemap: `https://herdomain.com/sitemap-index.xml`

The sitemap is generated automatically on every build, so this is a one-time job.

## Alternative: Cloudflare Pages instead

If you went private-repository, or just prefer it:

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Pick the repository
3. Build command: `npm run build`, output directory: `dist`
4. Add the custom domain in the Pages project settings

Everything else in this project stays exactly the same. Delete
`.github/workflows/deploy.yml` if you are not using GitHub Pages, so it does not run
pointlessly on every publish.
