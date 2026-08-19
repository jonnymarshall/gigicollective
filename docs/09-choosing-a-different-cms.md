# Changing the editor

## The problem

Sveltia is a form. She fills in fields and hopes. That is true of every git-based
CMS, because the job of one is to write text files into a repository, and a form is
the honest interface for that.

What she wants is to look at the page and change it. That is a different category
of product, and no amount of extra fields in Sveltia gets there.

## What a switch actually costs

Less than it sounds, because the architecture was decoupled from the start.

**Stays exactly as it is:**
- The domain, DNS, the `new.` staging subdomain, HTTPS
- The GitHub repo, the Actions workflow, automatic deploys
- The entire visual design: stylesheet, fonts, layouts, colour schemes
- The section components. They get re-registered rather than rewritten
- The noindex staging safeguard

**Gets replaced:** `public/admin/config.yml`, `src/content.config.ts`, and the
config validator. Roughly 650 lines, most of it configuration rather than logic.

**Gets deleted, and this is the underrated part:** the Cloudflare login worker,
her GitHub account, the collaborator invite, and the whole of `docs/03`. Every
hosted CMS below has its own login. She would sign in with an email address.
The fiddliest hour of this entire setup disappears.

Realistically: one to two days of work, and she keeps using the current site
throughout because staging stays live.

---

## The options

### 1. Storyblok — visual editing, keeps everything else

She opens the site inside Storyblok, clicks on a heading, and types. She drags
sections up and down and watches the real page rearrange. It is genuinely the
thing she is asking for, within components you design.

- **Cost:** free tier is 1 editor seat, 1 space, 10,000 API calls a month. Because
  the site is built ahead of time, those calls happen at build, not per visitor, so
  the limit is generous here.
- **Risk:** one seat. If you both need to edit, the next tier is $99/month, which
  is a cliff rather than a step.
- **Trade:** content moves off your repo onto their servers. Needs a backup routine.
- **Work:** 1 to 2 days.

### 2. TinaCMS — visual editing, content stays in your repo

Visual on-page editing like Storyblok, but the content is still markdown in your
GitHub repo. Keeps the free-forever, nothing-to-be-locked-out-of property.

- **Cost:** free, self-hosted, or a free cloud tier for 2 users.
- **Risk:** the visual editing is less polished than Storyblok's. Since polish is
  precisely what she is missing, this may not go far enough.
- **Work:** about 1 day.

### 3. Builder.io — actual drag and drop

The closest thing to the HostGator builder while keeping your code. She drags
elements around a canvas, and it composes them from your real components.

- **Cost:** free tier covers 5 users, with usage credits.
- **Risk:** this is the option that lets her make pages that look inconsistent or
  break on a phone. You answered "curated choices" when asked how much freedom she
  should have. This is the opposite of that answer.
- **Work:** 1 to 2 days.

### 4. Squarespace — stop building, start subscribing

She gets full control of everything, forever, without you. Templates that already
look like the reference you sent.

- **Cost:** about $16/month personal, $23/month business, billed annually. Call it
  $200 to $280 a year.
- **What you lose:** the free hosting you just set up, the speed, and owning the
  code. The Astro work becomes a nice prototype rather than the site.
- **What you gain:** you stop being the bottleneck. Permanently.
- **Honest note:** this is not a failure. For a small business site where the owner
  wants to change the design herself, it is often the correct answer, and the annual
  cost is less than a day of anyone's time.

---

## The recommendation

**Storyblok**, unless the budget answer is "we would rather pay than build".

It is the largest jump in what she can actually do, it keeps every hour already
spent on the design, and it deletes the most awkward part of the current setup.
The one-seat limit is the thing to check before committing.

**Squarespace** is the right call instead if the honest answer is that she wants to
design the site, not just fill it. Paying $250 a year to remove yourself from the
loop is a reasonable trade, and pretending otherwise would waste both your time.

**Builder.io** only if free positioning genuinely matters more than consistency.
It contradicts the curated answer you gave, so it needs a deliberate change of mind
rather than a drift into it.

## The underlying tension, stated plainly

You have twice chosen "curated so she cannot break it" and three times asked for
more freedom. Those pull in opposite directions.

Total freedom means pages will end up inconsistent, and some will look wrong on a
phone. That is not a tooling failure, it is what freedom costs. Every builder site
that looks messy after two years got there this way.

The question worth answering before picking is: does she want to **arrange good
pieces**, or does she want to **be the designer**? Storyblok is the best answer to
the first. Squarespace is the honest answer to the second.
