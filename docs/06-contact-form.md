# Adding a contact form

A static site has no server of its own, so it cannot receive a form submission by itself.
You need a small outside service to catch the submission and email it on.

## Options

| Service | Free tier | Notes |
|---|---|---|
| **Web3Forms** | 250 submissions/month | No account needed, just an email address to get the key. Simplest. |
| Formspree | 50 submissions/month | Nicer dashboard, spam filtering. |
| Tally | unlimited | A full hosted form you embed. Best if the form is long or has file uploads. |

Web3Forms is the easiest starting point.

## Web3Forms setup

1. Go to https://web3forms.com, enter the email address that should receive submissions,
   and it emails you an access key.
2. Create `src/components/ContactForm.astro`:

```astro
---
const ACCESS_KEY = 'paste-the-key-here';
---

<form action="https://api.web3forms.com/submit" method="POST" id="contact-form">
  <input type="hidden" name="access_key" value={ACCESS_KEY} />
  <input type="hidden" name="redirect" value="https://gigicollective.com/thanks" />
  <!-- Spam trap. Real people leave this blank; bots fill it in. -->
  <input type="checkbox" name="botcheck" class="hidden" style="display:none" tabindex="-1" />

  <label for="contact-name">Your name</label>
  <input id="contact-name" type="text" name="name" required />

  <label for="contact-email">Your email</label>
  <input id="contact-email" type="email" name="email" required />

  <label for="contact-message">Message</label>
  <textarea id="contact-message" name="message" rows="6" required></textarea>

  <button type="submit" class="button">Send</button>
</form>

<style>
  form { max-width: 32rem; display: grid; gap: 0.4rem; }
  label { font-size: 0.9rem; color: var(--color-muted); margin-top: 0.75rem; }
  input, textarea {
    font: inherit;
    padding: 0.6rem 0.75rem;
    border: 1px solid var(--color-border);
    border-radius: var(--radius);
    background: var(--color-surface);
  }
  input:focus, textarea:focus { outline: 2px solid var(--color-accent); outline-offset: 1px; }
  button { margin-top: 1.25rem; border: 0; cursor: pointer; font: inherit; }
</style>
```

3. Add a "thanks" page at `src/pages/thanks.astro` so people land somewhere after sending.

4. Drop the form onto the contact page. The contact page comes from markdown, so the form
   needs adding in the layout. The simplest way is a dedicated `src/pages/contact.astro`
   that includes the component, and then delete `src/content/pages/contact.md` so the two do
   not fight over the same address.

## Note on the access key

The key sits in the page source where anyone can read it. That is how Web3Forms is designed
to work and it is not a security problem, but it does mean someone could use the key to send
you spam. If that ever happens, generate a new key and enable the spam controls in the
Web3Forms dashboard.
