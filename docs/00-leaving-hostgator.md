# Leaving HostGator safely

Do these BEFORE cancelling the hosting plan. Cancelling hosting can kill things that
are not the website.

## 1. Check for email on the domain

This is the single biggest thing people get wrong.

If she has an address like `hello@gigicollective.com`, that mailbox very likely lives on the
HostGator hosting plan. Cancel the hosting and the mailbox is gone, along with its history.

Check: log in to HostGator cPanel and look for "Email Accounts". If any exist, they must be
moved before cancelling.

Replacement options:
- **Cloudflare Email Routing** (free): forwards `hello@gigicollective.com` to an existing Gmail
  inbox. Good if she only receives, and is happy to reply from her Gmail address.
- **Zoho Mail** (free for one domain, one user): a real mailbox, real webmail.
- **Google Workspace** (~$7/user/month): a real Gmail inbox on her own domain. Easiest if she
  already lives in Gmail.

If a mailbox is moving, export the existing mail first (IMAP into a mail client, or the
cPanel backup) so nothing is lost.

## 2. Take a full backup of the current site

Even if the new site is a fresh design, keep a copy of the old one:
- cPanel → Backup → download a full backup, or at least the `public_html` folder.
- If it is WordPress, also export the database, and use Tools → Export for a content XML file.
- Save every image she wants to keep. Images are usually the thing nobody can re-create.

Store this somewhere off the laptop too (external drive or cloud).

## 3. Write down every URL that currently exists

Open the current site and list every page address, for example:
```
gigicollective.com/about
gigicollective.com/blog/some-post-title
```
Quick way to get the full list: visit `gigicollective.com/sitemap.xml` in a browser, or run
a free crawler. Save the list.

Why: if a page moves to a different address on the new site, Google slowly forgets the old
one and her search traffic drops. We handle that with redirects in step 6 of the launch doc.

## 4. Decide where the domain name itself lives

The domain name and the hosting are two separate things, even though HostGator sells both.
You can cancel the hosting and keep the domain registered with HostGator. That works fine.

But HostGator renewal prices for domains are high compared to the market. Options:

| Registrar | Cost | Notes |
|---|---|---|
| Leave it at HostGator | whatever they charge | Zero effort. Watch out for auto-renew upsells. |
| **Cloudflare Registrar** | at cost, roughly $10/yr for .com | Recommended. No markup, no upsells, and DNS is in the same place. |
| Porkbun | similar, cheap | Also fine, simpler signup than Cloudflare. |

To transfer a domain you need it to be more than 60 days old, unlocked, and you need the
authorisation code (EPP code) from HostGator. Transfers take a few days.

**Order of operations matters.** Do the transfer first, get the new site live, and only then
cancel the hosting. Never cancel first.

## 5. Only then, cancel the hosting

Once the new site is live on the real domain and email is confirmed working, cancel.
Ask for a refund if there is unused prepaid time. Take a screenshot of the cancellation
confirmation.
