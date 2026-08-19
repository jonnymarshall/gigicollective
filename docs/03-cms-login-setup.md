# Step 2: Set up the login for the editor

This is the one genuinely fiddly bit of the whole setup. It takes about fifteen minutes,
you do it once, and then nobody thinks about it again.

**Every step in this document is done by you, on your own accounts, except step 2e.**
She creates one thing (a free GitHub account) and does one thing (accepts an invite). She
never signs into Cloudflare, never registers anything, and never sees a client secret.

---

## Who owns what

| Thing | Whose account | Does she ever see it? |
|---|---|---|
| The Cloudflare account | **Yours** | No. Never. |
| The login helper running on Cloudflare | **Yours** | No |
| The GitHub OAuth app | **Yours** (`jonnymarshall`) | Only its name, on a one-time "allow access?" screen |
| The `gigicollective` repository | **Yours** (`jonnymarshall`) | No |
| The Client ID and client secret | **Yours**, they belong to the app | No. Never send her these. |
| A GitHub account, used only to sign in at `/admin` | **Hers** | Yes, once at signup, then only the sign-in button |

**Her total involvement is: sign up for GitHub once, accept one email invite, then use
`gigicollective.com/admin` forever.**

### The bit that confuses everyone

You register **one** OAuth app. It is not "your login" or "her login". It is the website's
login system, and it belongs to the site.

Both of you then sign in **through** that one app using your own separate GitHub accounts.
Think of it like the front door of a building: you install one door, and then several people
use their own keys on it. The Client ID and secret are the door, not anybody's key.

So there is no second setup to do for her. Once the door is installed, she just needs a key,
which is her own GitHub account plus access to the repo.

### A trap specific to your setup

You have two GitHub accounts, `jonnymarshall` and `btckeybackup`. The repository is under
**`jonnymarshall`**.

Before starting, go to https://github.com and check the avatar in the top right corner. If it
is `btckeybackup`, sign out and back in as `jonnymarshall`. If you register the OAuth app or
connect Cloudflare under the wrong one, it will appear to work and then fail confusingly later.

---

## Why any of this is needed

The editing page runs entirely in her browser. When she presses Publish, it has to save files
into your GitHub repository, and GitHub will not let a web page do that without a proper
login handshake.

That handshake needs a tiny piece of code running on a server somewhere. It does nothing
except pass the login back and forth. Cloudflare runs code like this for free, and this
particular one already exists and is maintained by the Sveltia author, so there is nothing to
write. You are just deploying someone else's ten-line program.

Cost: free. The free allowance is 100,000 runs a day. This will use maybe five.

---

## 2a. Deploy the login helper

> **You.** Your Cloudflare account, your GitHub account (`jonnymarshall`).
> She is not involved and does not need a Cloudflare account, now or ever.

1. If you do not already have one, create a free Cloudflare account at
   https://dash.cloudflare.com/sign-up. No card required. **This is your account, in your
   name, with your email.**
2. Open https://github.com/sveltia/sveltia-cms-auth
3. Click the **Deploy to Cloudflare** button in the README.
4. Follow the prompts. It will ask to connect your GitHub account. **Connect
   `jonnymarshall`.** It will make a copy of the project under your own GitHub account, so a
   new `sveltia-cms-auth` repository will appear there. That is expected and correct. You can
   ignore it from then on.
5. Cloudflare shows a **Set up your application** form. Fill it in like this:

   | Field | What to do |
   |---|---|
   | **Git account** | Choose **`jonnymarshall`**. This is the one field that really matters. |
   | **Create private Git repository** | Leave it on. This copy of the worker has no reason to be public. Makes no difference to how it works. |
   | Repository name | Leave as `sveltia-cms-auth`. |
   | Build command | Leave as `pnpm run deploy`. That is the project's own deploy command. |
   | Builds for non-production branches | Leave off. There is only ever one branch here. |
   | Advanced settings (`npx wrangler versions upload`) | Leave alone. Only applies to the non-production branches you just turned off. |
   | API token / **Create new token** | Leave it set to create one automatically. This is Cloudflare's own token so the build can publish the worker. Nothing for you to do. |
   | **Variable value** (and any empty variable rows) | **Leave blank.** |

6. **Leave every variable blank at this stage.** This looks wrong but is correct.

   The worker's `wrangler.toml` declares no variables, so the form is not asking you for
   anything it needs. More to the point, you could not fill them in yet even if you wanted
   to: the client ID and secret come from the OAuth app in step 2b, and that app cannot be
   registered until it has this worker's address for its callback URL. The worker has no
   address until it is deployed.

   So the order is forced: deploy empty now, register the app, come back and add the values
   in 2c. The worker checks whether the credentials are present and returns a clear error if
   they are not, so a half-configured worker simply does not log anyone in. It does not break
   anything.

7. Deploy. When it finishes, Cloudflare shows you a web address that looks like:
   ```
   https://sveltia-cms-auth.something.workers.dev
   ```
   **Copy that address.** It is needed twice below.

## 2b. Register the OAuth app

> **You.** Signed in to GitHub as `jonnymarshall`.
> This registers the website's login system, once, for everybody who will ever use it.

1. Go to https://github.com/settings/developers
2. Check the top right avatar says `jonnymarshall` before continuing.
3. **OAuth Apps** → **New OAuth App**
4. Fill in:
   - **Application name**: `Gigi Collective website editor`
     This is the only part of this step she will ever see. The first time she signs in,
     GitHub asks her to allow this app access, showing this name. Make it something she will
     recognise, so it does not look like a phishing screen.
   - **Homepage URL**: `https://gigicollective.com`
   - **Application description**: optional, but worth writing. She sees this on the one-time
     "allow access?" screen, so a plain sentence makes it obviously legitimate:
     `The content editor for gigicollective.com. Lets you publish pages and blog posts.`
   - **Redirect URI**: the worker address with **`/callback`** on the end:
     ```
     https://sveltia-cms-auth.jonnymarshall5.workers.dev/callback
     ```
     The `/callback` is easy to miss and nothing works without it. The worker only answers on
     `/callback` and `/oauth/redirect`, so the bare address will fail with a redirect
     mismatch. It must match exactly, including the `https://` and no trailing slash.
   - **Allow wildcard matching**: **off**. It would let tokens be sent to any subdomain or
     path under that address. There is exactly one valid destination here, so there is no
     reason to widen it.
   - **Enable Device Flow**: **off**. That is for signing in on devices without a browser,
     like a TV. Not used here.
   - **Expire user access tokens**: **off**. This one has a real consequence. Turning it on
     makes her sign-in expire after 8 hours, and recovering from that needs refresh token
     handling that this worker does not have. It reads the access token and nothing else. So
     with this on she would be signed out roughly daily; with it off she stays signed in.
5. Register the application.
6. On the next screen, copy the **Client ID**.
7. Click **Generate a new client secret** and copy that too. GitHub only shows the secret
   once, so paste it somewhere before you navigate away.

**These two values are yours and stay yours.** They go into your Cloudflare account in the
next step and nowhere else. She never needs them, and anyone who has them can sign in as the
website. Do not put them in the repo, do not email them, do not paste them into a chat.

## 2c. Give the helper the two values

> **You.** Your Cloudflare account.

1. **Workers & Pages** → click `sveltia-cms-auth` → **Settings**

2. **There are two sections on this page both called "Variables and secrets".** Only one of
   them works.

   | Which | Where it is | Use it? |
   |---|---|---|
   | **Variables and secrets** | The **first** section, at the very top of the page. Its empty state reads "Configure API tokens and other runtime variables", and the table has a **Type** column. | **Yes, this one.** |
   | Variables and secrets | Nested **inside the Build section**, further down, next to Deploy Hooks and Build cache. Its empty state reads "No build variables or secrets configured". | No. |

   The second one only exists while the deploy command is running. Values put there are
   invisible to the running Worker, and sign-in will fail with nothing obvious to point at.

   If the Add dialog you are looking at offers only a key and a value with no **Type**
   choice, you are in the Build one. Scroll back to the top of the page.

3. In the top section, click **Add variable** and add these three. **Set all three to type
   `Secret`**, not Text:

| Name | Value |
|---|---|
| `GITHUB_CLIENT_ID` | the Client ID from 2b |
| `GITHUB_CLIENT_SECRET` | the client secret from 2b |
| `ALLOWED_DOMAINS` | `gigicollective.com` |

Why all three as Secret, when only one is really sensitive: Cloudflare preserves secrets
across deploys ("Secrets not included in the file are preserved from the previous version"),
but plain text variables are expected to come from `wrangler.toml`. This project's
`wrangler.toml` declares none, and the Worker now redeploys automatically on every push to
its repo. A plain text value set here could be wiped by one of those redeploys. Secret type
costs nothing and survives. The Worker reads both kinds identically.

`ALLOWED_DOMAINS` is what stops anyone who finds the worker address from pointing their own
editing page at it. The login only works when the request comes from a domain listed here.

**To test before the domain has moved,** list both, comma separated and no spaces:

```
gigicollective.com,jonnymarshall.github.io
```

That lets you sign in at `jonnymarshall.github.io/gigicollective/admin/` while DNS still
points at HostGator. Remove the github.io half once the real domain is live.

4. Save, then **Deploy** so the new values take effect.

## 2d. Point the editor at the helper

> **You.** A code change, so it is yours by definition. She never edits this file.

In `public/admin/config.yml`, set `base_url` to the worker address (no `/callback` this time):

```yaml
backend:
  name: github
  repo: jonnymarshall/gigicollective
  branch: main
  base_url: https://sveltia-cms-auth.something.workers.dev
```

Note there is no client secret in this file, and there must never be. This file is public.
Only the worker address goes here, which is safe to publish.

Commit and push.

## 2e. Her one and only setup task

> **Her**, for the account. **You**, for the invite.

This is the only step she takes part in.

**She does:**
1. Signs up for a free GitHub account at https://github.com/signup, using her own email
   address and her own password. **This account is hers.** You do not need her password and
   should not ask for it.
2. Sends you her username.

That is the last time she needs to think about GitHub as a thing. From then on it is just the
button she clicks to get into the editor.

**You do:**
3. In https://github.com/jonnymarshall/gigicollective → **Settings** → **Collaborators** →
   **Add people** → her username → give her **Write** access.

   Write is the minimum that allows saving. There is no narrower setting that still lets the
   CMS publish. It does technically let her edit code through the GitHub website, but she has
   no reason to go there and will not be shown it by anything she uses.

**She does:**
4. Opens the invite email from GitHub and clicks accept. One click, once.

## Testing it

> **You first, then her.** Two different tests. Do both.

**Your test:** go to `https://gigicollective.com/admin/` and click **Sign In with GitHub**.
You will be signed in as `jonnymarshall`. If it lets you in and shows Site settings, Pages,
Blog posts and Work down the left hand side, the helper and the OAuth app are working.

**Her test:** she does exactly the same thing, on her own computer, signed into GitHub as
herself. This is the test that actually matters, because it is the one that proves the
collaborator invite and her access work. Yours passing proves nothing about hers.

Ask her to make a real change, a typo fix on the About page is ideal, and press Publish. Wait
a minute or two and check it appears on the live site. Only then is this step finished.

## Checking the helper without the dashboard

Run this any time sign-in misbehaves:

```bash
sh scripts/check-login-helper.sh
```

It asks the Worker two questions from outside and tells you whether the three variables
actually reached it. This is far more reliable than looking at the Cloudflare dashboard,
because the dashboard shows what you typed, not what the running Worker can see. Those are
not the same thing until a deploy has finished.

It works by sending a deliberately bogus domain. If `ALLOWED_DOMAINS` is doing its job, that
gets rejected. If the bogus domain sails through, the variable is not reaching the Worker,
and the Worker is currently unprotected.

One thing this catches that nothing else does: values can take a minute or two to take effect
after Deploy. If sign-in fails immediately after saving, wait, run the script, and only start
changing things once it still reports a problem.

## If something goes wrong

| Symptom | Cause |
|---|---|
| "Redirect URI mismatch" | The callback URL in 2b does not exactly match the worker address plus `/callback`. |
| Login window opens then closes with nothing | `ALLOWED_DOMAINS` does not include the domain you are visiting from. |
| **She** signs in fine but saving fails | She has not accepted the collaborator invite, or has Read access instead of Write. |
| **She** cannot sign in at all, but you can | Her GitHub account is fine, but she was never invited, or the invite went to a different email than the account she made. |
| You registered things under the wrong account | Check whether the OAuth app is listed under `jonnymarshall` at https://github.com/settings/developers. If it is under `btckeybackup`, delete it and redo 2b as `jonnymarshall`. |
| "OAuth app client ID or secret is not configured" | The variables are not reaching the Worker. Run `scripts/check-login-helper.sh`. If it also reports `ALLOWED_DOMAINS` missing, all three are absent, so it is a location or deploy problem rather than a typo. Most likely they went into the Build section, or Deploy was not clicked, or the deploy has not finished propagating yet. |
| Editor page is blank | `config.yml` has a formatting error. YAML is picky about indentation. Check the browser console. |

## Local testing without any of this

> **You only.** This is a developer shortcut and is not something she uses.

While developing on your own machine, `/admin/index.html` offers **Work with Local
Repository**. Click it, pick the project folder, and you can try the editor with no login, no
worker, and no GitHub at all. Changes save straight to the files on disk.

Note the `index.html` on the end. The local dev server needs it. On the live site plain
`/admin/` works.

## What to actually send her

Nothing from this document. Send her [05-guide-for-the-editor.md](05-guide-for-the-editor.md)
once the testing above passes, plus:

- the address `gigicollective.com/admin`
- a heads-up that the first time she signs in, GitHub will ask her to allow
  "Gigi Collective website editor" access, and that she should say yes
