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

## Recommended: a staging subdomain on her own domain

Point a subdomain at the site you already have. It serves from the root, so the styling and
links work. Her live site at `gigicollective.com` is untouched, because adding a subdomain
record cannot affect the root domain.

This reuses the GitHub Pages setup that is already working, needs no new accounts, and is the
truest rehearsal available: real DNS, real HTTPS, real domain.

### Setting it up

1. **In her DNS** (HostGator's control panel for now), add one record:

   | Type | Name | Value |
   |---|---|---|
   | CNAME | `new` | `jonnymarshall.github.io` |

   That is the only change. Do not touch the existing records for `@` or `www`. Those are
   what keep her current site alive.

2. **In the repo**: Settings → Pages → Custom domain → `new.gigicollective.com` → Save.

   Wait for the DNS check to pass, then tick **Enforce HTTPS**. This can take from a few
   minutes to a few hours.

3. **Keep search engines out.** Already done, but this is how it works: the repository
   variable `PUBLIC_NOINDEX` is set to `true`, and the build passes it through so every page
   gets `<meta name="robots" content="noindex, nofollow">`.

   ```bash
   gh variable list --repo jonnymarshall/gigicollective
   ```

4. **Let the CMS work there.** Worker `sveltia-cms-auth` → Settings → the **Variables and
   secrets** section at the top of the page → edit `ALLOWED_DOMAINS` to:

   ```
   gigicollective.com,new.gigicollective.com
   ```

   Redeploy the Worker. Now `new.gigicollective.com/admin/` works and she can write real
   content into the staging site.

### Checking the noindex applied

```bash
curl -s https://new.gigicollective.com/ | grep robots
```

Should print `<meta name="robots" content="noindex, nofollow">`. If it prints nothing, the
staging site is indexable and will compete with her real one.

## Alternative: Cloudflare Pages

Cloudflare gives every project a free `something.pages.dev` address that also serves from the
root, and needs no DNS change at all.

The catch as of August 2026: the Cloudflare dashboard has moved on from the flow their own
docs describe. There is no longer a **Create** → **Pages** → **Connect to Git** path; there
is a single **Create application** button, and Cloudflare now steers new projects towards
"Workers with static assets" instead of Pages.

It is still perfectly doable, just not worth fighting an unfamiliar dashboard when the
subdomain route above reuses something already working. Come back to this only if you would
rather not touch DNS at all.

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
