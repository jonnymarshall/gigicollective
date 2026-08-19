# Staging the new site, then going live

The goal: get the new site finished and reviewable at a real, properly working address, while
gigicollective.com carries on pointing at HostGator untouched. Then flip it over in one go.

## Why the GitHub Pages address looks broken

GitHub Pages puts project sites in a subfolder, `jonnymarshall.github.io/gigicollective/`.
The site is built for the root of a domain, so every path it writes starts with `/`. Served
from a subfolder, all of those land one level too high:

```
page asks for:  jonnymarshall.github.io/_astro/BaseLayout.css      404
file is at:     jonnymarshall.github.io/gigicollective/_astro/…    200
```

That is the whole cause of the missing styling and the broken menu links. Nothing in the code
is wrong, and it disappears the moment the site is served from the root of something.

So the fix is not to patch the paths. It is to preview somewhere that gives you a root.

## Recommended: a Cloudflare Pages preview

Cloudflare Pages gives every project a free `something.pages.dev` address that serves from
the **root**. No subfolder, so the site looks exactly as it will on the real domain.

It changes nothing about DNS, so her live site is at zero risk. You already have a Cloudflare
account from the login helper.

### Setting it up

1. Cloudflare dashboard → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. Choose `jonnymarshall/gigicollective`
3. Build settings:

   | Setting | Value |
   |---|---|
   | Framework preset | Astro (or None) |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

4. Add these environment variables:

   | Name | Value | Why |
   |---|---|---|
   | `PUBLIC_NOINDEX` | `true` | Puts `noindex` on every page so Google never indexes the staging site and competes with her real one. |
   | `NODE_VERSION` | `22` | Astro 7 needs Node 22+. The repo has a `.nvmrc` that Cloudflare usually respects, but setting this removes all doubt. |

5. Deploy. You get an address like `gigicollective.pages.dev`, fully styled, links working.

6. Add that address to the login helper so the CMS works there too. Worker
   `sveltia-cms-auth` → Settings → the **Variables and secrets** section at the top of the
   page → edit `ALLOWED_DOMAINS` to:

   ```
   gigicollective.com,gigicollective.pages.dev
   ```

   Redeploy the Worker. Then `gigicollective.pages.dev/admin/` works, and she can write real
   content into the staging site while you both review it.

From here on, both GitHub Pages and Cloudflare Pages rebuild from the same repo on every
push. They will always show the same content. Ignore the GitHub Pages one.

### Checking the noindex actually applied

```bash
curl -s https://gigicollective.pages.dev/ | grep robots
```

Should print `<meta name="robots" content="noindex, nofollow">`. If it prints nothing, the
environment variable did not take effect, and Google could index the staging site.

## Alternative: a staging subdomain on her own domain

If you would rather rehearse on the real domain, point a subdomain at the site instead:

1. In her DNS, add one record: `CNAME` for `new` → `jonnymarshall.github.io`
2. GitHub repo → Settings → Pages → Custom domain → `new.gigicollective.com`
3. Add `new.gigicollective.com` to `ALLOWED_DOMAINS` on the Worker

`gigicollective.com` itself is untouched, so her HostGator site keeps serving as normal.
Adding a subdomain record cannot affect the root domain.

This is a truer rehearsal, because it tests real DNS and real HTTPS on her domain. It is
slightly more work and it does mean touching her DNS earlier. Use `PUBLIC_NOINDEX=true` here
too, which for GitHub Pages means adding it to the build step in
`.github/workflows/deploy.yml`.

## What to do while it is staged

1. Move the content across, see [07-moving-the-content-across.md](07-moving-the-content-across.md)
2. Replace the placeholder text: site tagline, front page, About
3. Check every page on a phone as well as a laptop
4. Have her use the CMS properly for a few days, so any confusion surfaces now rather than
   after the old site is gone
5. Write down the old site's URLs so redirects can be set up, see
   [00-leaving-hostgator.md](00-leaving-hostgator.md)

## Launch day

Only when the staging site is genuinely finished.

**Decide which host wins.** If the Cloudflare Pages preview has been working well, the
simplest ending is to launch on it and drop GitHub Pages entirely. One host, one place to
look, and it serves from the root so nothing needs reconfiguring. Delete
`.github/workflows/deploy.yml` and turn Pages off in the repo settings.

Then:

1. Attach `gigicollective.com` as a custom domain on whichever host you chose
2. Update her DNS records to point at it, see [04-hosting-and-domain.md](04-hosting-and-domain.md)
3. Wait for DNS to spread, then confirm HTTPS is on and working
4. **Remove `PUBLIC_NOINDEX`** and redeploy. Forgetting this leaves the real site invisible
   to Google, which is the single worst mistake available at this stage.
5. Confirm it is gone:
   ```bash
   curl -s https://gigicollective.com/ | grep robots
   ```
   This should now print **nothing**.
6. Trim `ALLOWED_DOMAINS` back to just `gigicollective.com` and redeploy the Worker
7. Update `SITE` at the top of `scripts/check-login-helper.sh` to `gigicollective.com`
8. Add the site to Google Search Console and submit the sitemap
9. Add redirects for any old URLs that changed
10. Leave HostGator running for at least a week
11. Only then cancel it, following [00-leaving-hostgator.md](00-leaving-hostgator.md)

## The one thing not to forget

Step 4. `PUBLIC_NOINDEX` is deliberately invisible: the site looks perfect with it on. The
only symptom is that the site never appears in Google, and you would not notice for weeks.
Run the check in step 5 on launch day.
