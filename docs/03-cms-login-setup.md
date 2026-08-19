# Step 2: Set up the login for the editor

This is the one genuinely fiddly bit of the whole setup. It takes about fifteen minutes,
you do it once, and then nobody thinks about it again.

## Why it is needed at all

The editing page runs entirely in the browser. When she presses Publish, it needs to save
files into your GitHub repository on her behalf, and GitHub will not let a web page do that
without a proper login handshake.

That handshake needs a tiny piece of code running on a server somewhere. It does nothing
except pass the login back and forth. Cloudflare runs code like this for free, and this
particular one already exists and is maintained by the Sveltia author, so there is nothing
to write. You are just deploying someone else's ten-line program.

Cost: free. The free allowance is 100,000 runs a day. This will use maybe five.

## What you need

- A Cloudflare account (free, no card required)
- Your GitHub account

## 2a. Deploy the login helper

1. Open https://github.com/sveltia/sveltia-cms-auth
2. Click the **Deploy to Cloudflare** button in the README.
3. Follow the prompts. It will ask to connect your GitHub account and will make a copy of
   the project under your own account. That is expected.
4. When it finishes, Cloudflare shows you a web address that looks like:
   ```
   https://sveltia-cms-auth.something.workers.dev
   ```
   **Copy that address.** It is needed twice below.

## 2b. Tell GitHub about it

1. Go to https://github.com/settings/developers
2. **OAuth Apps** → **New OAuth App**
3. Fill in:
   - Application name: `Website editor`
   - Homepage URL: your site address, for example `https://gigicollective.com`
   - Authorization callback URL: the worker address from 2a with `/callback` on the end, so:
     ```
     https://sveltia-cms-auth.something.workers.dev/callback
     ```
     This must match exactly, including the `https://`.
4. Register the application.
5. On the next screen, copy the **Client ID**.
6. Click **Generate a new client secret** and copy that too. GitHub only shows the secret
   once, so paste it somewhere before you navigate away.

## 2c. Give the helper the two values

Back in Cloudflare:

1. **Workers & Pages** → click `sveltia-cms-auth` → **Settings** → **Variables and Secrets**
2. Add these:

| Name | Value | Type |
|---|---|---|
| `GITHUB_CLIENT_ID` | the Client ID from 2b | Plain text |
| `GITHUB_CLIENT_SECRET` | the client secret from 2b | **Secret** (encrypted) |
| `ALLOWED_DOMAINS` | `gigicollective.com` | Plain text |

`ALLOWED_DOMAINS` matters. Without it, anyone who finds the worker address could point their
own editing page at it. With it, the login only works from your domain.

3. Save, then **Deploy** so the new values take effect.

## 2d. Point the editor at it

In `public/admin/config.yml`, set `base_url` to the worker address (no `/callback` this time):

```yaml
backend:
  name: github
  repo: jonnymarshall/gigicollective
  branch: main
  base_url: https://sveltia-cms-auth.something.workers.dev
```

Commit and push.

## 2e. Give her access

She needs a free GitHub account. She signs up at https://github.com/signup and sends you
her username. That is the only time she ever needs to look at GitHub.

Then, in your repository: **Settings** → **Collaborators** → **Add people** → her username,
with **Write** access. She gets an email invite and has to click accept, once.

## Testing it

Go to `https://gigicollective.com/admin/` and click **Sign In with GitHub**. If it lets you in
and shows Site settings, Pages, Blog posts and Work down the left, it is working.

Have her do the same on her own machine before you call it done.

## If something goes wrong

| Symptom | Cause |
|---|---|
| "Redirect URI mismatch" | The callback URL in 2b does not exactly match the worker address plus `/callback`. |
| Login window opens then closes with nothing | `ALLOWED_DOMAINS` does not include the domain you are visiting from. |
| Signs in, but saving fails | She has not accepted the collaborator invite, or has Read access instead of Write. |
| Editor page is blank | `config.yml` has a formatting error. YAML is picky about indentation. Check the browser console. |

## Local testing without any of this

While developing on your own machine, `/admin/index.html` offers **Work with Local
Repository**. Click it, pick the `gigicollective` folder, and you can try the editor with no
login and no worker at all. Changes save straight to the files on disk.

Note the `index.html` on the end. The local dev server needs it. On the live site plain
`/admin/` works.
