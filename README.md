# Kenjax Courier website

Next.js 16 (App Router), TypeScript and Tailwind CSS 4, built as a **static site** and hosted on **Cloudflare Pages** (free plan).

- The pages are plain static files in `out/` after a build.
- The request form posts to `/api/quote`, a Cloudflare Pages Function in `functions/api/quote.ts`. It emails each request to Kenjax dispatch through **Resend**.
- Old URLs (`/index.html`, `/about.html`, `/contact.html`) redirect through `public/_redirects`.

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000 (pages only; the form endpoint isn't available here)
npm run preview    # builds, then runs the full site on Cloudflare's local runtime at http://localhost:8788
```

`npm run preview` runs with `QUOTE_DRY_RUN=1`, so form submissions print to the terminal instead of sending email.

## Deploy to Cloudflare Pages

### 1. Resend (form email)
1. In Resend, go to **Domains → Add domain** and enter `kenjaxcourier.com`.
2. Keep the DNS records it shows open; you'll add them in step 3.
3. Create an API key with **Sending access**. Keep it private: it goes into Cloudflare in step 4, never into the code or a chat.

### 2. Cloudflare Pages project
1. In Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git** and choose this GitHub repo.
2. Build settings:
   - Framework preset: **Next.js (Static HTML Export)**, or **None**
   - Build command: `npm run build`
   - Build output directory: `out`
   - Environment variable: `NODE_VERSION` = `22`
3. Click **Save and Deploy**. The site goes live at `kenjax-courier.pages.dev`. Check it there before switching the domain.

### 3. Move kenjaxcourier.com DNS to Cloudflare
Cloudflare Pages can only serve the bare `kenjaxcourier.com` address if the domain's DNS is managed by Cloudflare.

1. In Cloudflare, go to **Add a domain**, enter `kenjaxcourier.com` and choose the **Free** plan.
2. Cloudflare imports the existing records. **Compare them with the current DNS before going further.** Every MX, TXT (SPF/DKIM/verification) and other record must be there, or email for the domain will stop working.
3. Add the Resend records from step 1.
4. At the registrar, replace the nameservers with the two Cloudflare gives you. This can take a few minutes up to 24 hours.
5. When the domain shows **Active**, open the Pages project → **Custom domains** and add `kenjaxcourier.com`, then `www.kenjaxcourier.com`.
6. Optional: add a Cloudflare **Redirect Rule** sending `www.kenjaxcourier.com/*` to `https://kenjaxcourier.com/$1` (301).

### 4. Form settings
In the Pages project, go to **Settings → Variables and Secrets** and add these for **Production**:

| Name | Type | Value |
|---|---|---|
| `RESEND_API_KEY` | Secret | your Resend API key |
| `QUOTE_TO_EMAIL` | Text (optional) | defaults to `information@kenjaxinc.com` |
| `QUOTE_FROM_EMAIL` | Text (optional) | defaults to `Kenjax Website <quotes@kenjaxcourier.com>` |

Redeploy after adding them (**Deployments → … → Retry deployment**). Then send a test request from the live site and confirm it arrives.

### 5. Retire GitHub Pages
Once the site loads on kenjaxcourier.com from Cloudflare, go to the GitHub repo's **Settings → Pages** and turn GitHub Pages off.

## Free-plan limits (as of Nov 2026)
- Static page requests: unlimited.
- `/api/quote` runs as a Pages Function: 100,000 requests a day on the Workers Free plan.
- Builds: 500 a month (one per push).
- Resend free plan: 100 emails a day.

## Where to edit things
- Phone, email, address, hours, service tiers: `src/lib/site.ts`
- Form options and validation (shared by the form and the Function): `src/lib/quote.ts`
- Email sending: `functions/api/quote.ts`
- Pages: `src/app/<page>/page.tsx`
- Colors and fonts: `src/app/globals.css` (`@theme` block)
- Redirects and headers: `public/_redirects`, `public/_headers`

## Adding proof content later
There are deliberately no testimonials or stats yet. When real ones exist, add a section to `src/app/page.tsx` between "How a run works" and the closing call-to-action.
