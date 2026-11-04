# BLUE — Your Creative Partner

A complete Arabic-first agency website built with React 18, Vite, React Router v6, CSS Modules, Framer Motion, react-i18next, React Hook Form, Zod, and React Helmet Async. A separate Express API validates contact enquiries, sends email through SMTP, and can notify a Telegram bot after delivery.

The interface follows the supplied dark navy / electric blue / cyan identity. See [BRAND.md](./BRAND.md) for the exact tokens, logo geometry, font choices, and content confidence.

## Install and run

Open a terminal in the project folder. Use Node.js **20.19 or later** (a current LTS release is recommended) and npm, then run:

```sh
npm install
cp .env.example .env
npm run dev
```

On Windows, `copy .env.example .env` is the equivalent file-copy command. Do not commit `.env` or share its values in chat.

One command starts both services:

- Vite listens on port **5173**, bound to `0.0.0.0` for a cloud development preview.
- Express listens on port **3001** by default.
- Vite forwards `/api` requests to Express, so the frontend does not need a separate API URL during normal local development.

Use the running cloud environment’s port-preview feature if one is available. For a preview hostname rejected by Vite host validation, set `__VITE_ADDITIONAL_SERVER_ALLOWED_HOSTS` to that exact hostname in the environment before starting Vite; keep host validation enabled. Starting this development server does not deploy the site or create a public website. Keep the terminal running while developing; stop both processes with Ctrl+C.

## Build and production startup

```sh
npm run build
npm start
```

`npm run build` creates the static frontend in `dist/`. `npm start` starts the API in production mode and can serve the built frontend, including React Router fallback routes. Keep `NODE_ENV=production` in production hosting settings as well. Development-only logging is intentionally unavailable in production. The production start script uses POSIX environment assignment; Windows users can run `node server/server.js` after setting `NODE_ENV=production` in their shell or `.env`.

`npm run preview` serves the frontend build for local review. It is a preview server, not the production API process; keep the API running separately when testing form delivery through it.

Other project commands:

```sh
npm run lint
npm test
```

The server tests use mocked delivery providers. They must not send real email or Telegram messages.

## Routes

| Route             | Content                                                                 |
| ----------------- | ----------------------------------------------------------------------- |
| `/`               | Hero, services, featured concepts, process, counters, testimonials, FAQ |
| `/services`       | Detailed services, deliverables, audiences, prefilled enquiry links     |
| `/work`           | Searchable, filterable portfolio                                        |
| `/work/:slug`     | Case study, concept gallery, lightbox, adjacent projects                |
| `/about`          | Agency story, values, team placeholders, timeline                       |
| `/contact`        | Validated enquiry form and contact alternatives                         |
| `/blog`           | Three example editorial posts                                           |
| `/blog/:slug`     | Article page                                                            |
| Any unknown route | Custom 404                                                              |

Routes load through React lazy imports. Navigation resets the scroll position. Arabic is the default language; the visible language switch updates `lang`, `dir`, and page metadata. Language persistence uses guarded local storage, so unavailable storage does not prevent the site from working.

## Configure contact delivery

The root `.env.example` lists supported **server-only** variables:

| Variable                                 | Purpose                                                                                   |
| ---------------------------------------- | ----------------------------------------------------------------------------------------- |
| `PORT`                                   | API port; defaults to `3001`                                                              |
| `NODE_ENV`                               | `development` locally; `production` on a public server                                    |
| `CLIENT_ORIGIN`                          | Comma-separated frontend origins allowed to call the API                                  |
| `TRUST_PROXY`                            | Optional verified number of reverse-proxy hops; configure for your host, not by guesswork |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`  | SMTP connection; typical submission is port `587`, secure `false` with STARTTLS           |
| `SMTP_USER`, `SMTP_PASS`                 | SMTP authentication                                                                       |
| `CONTACT_FROM`                           | Approved sender address for the SMTP account                                              |
| `CONTACT_TO`                             | Inbox receiving enquiries                                                                 |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | Optional additional notification after successful email delivery                          |

Do not prefix credentials with `VITE_`: Vite exposes those values to browsers. Keep SMTP and Telegram secrets in the backend host’s environment settings. TLS verification remains enabled. For provider-specific mail settings, use the provider’s documented SMTP configuration.

When SMTP is unconfigured in **development**, the API logs the sanitized enquiry locally and returns `delivery: "development"`. The UI labels this as a development receipt; it does **not** mean an email was delivered. Logs can contain a person’s enquiry details, so use test data and handle development logs appropriately.

In **production**, missing SMTP configuration returns `503 DELIVERY_UNAVAILABLE`. An email delivery failure returns `502 DELIVERY_FAILED`; it is not reported as success. If email succeeds but optional Telegram notification fails, the request remains successful to avoid encouraging duplicate email submissions. Verify real delivery using approved test details before launch.

### API contract

`POST /api/contact` accepts JSON:

```json
{
  "name": "Example person",
  "phone": "+201000000000",
  "email": "person@example.com",
  "service": "branding",
  "budget": "not-sure",
  "message": "A clear description of the project and what it needs to achieve.",
  "website": ""
}
```

`website` is a honeypot and should remain empty. Supported service IDs are `branding`, `social`, `management`, `motion`, `ads`, and `web`. Budget IDs are `not-sure`, `under-10k`, `10k-25k`, `25k-50k`, and `50k-plus`; the labels can be translated without changing these IDs.

The server validates and sanitizes input, limits JSON bodies to 16 KB, restricts origins, and rate limits enquiries to five requests per IP per 15 minutes. The honeypot returns a neutral response without sending a lead. `/api/health` reports service status without exposing credentials or configuration values. Client-side validation improves the form experience; server validation remains authoritative.

A successful response is `{ "success": true, "delivery": "email" }`, `email-and-telegram`, or development-only `development`. Errors return a safe error code and, when applicable, field errors. Do not expose raw provider errors to visitors.

## Edit business details and content

The frontend uses structured files rather than embedding marketing copy in page components:

- `src/data/config.js`: business details, Instagram account, confirmed contact destinations, public URL, and shared facts.
- `src/data/services.js`: six service IDs and icon choices.
- `src/data/projects.js`: project categories, poster themes, image/gallery paths, and metric structure.
- `src/data/testimonials.js`, `team.js`, `faq.js`, and `posts.js`: entries used by their matching sections and pages.
- `src/locales/ar.json` and `src/locales/en.json`: all translated headings, descriptions, labels, accessibility text, validation copy, case studies, and articles. Keep both files’ keys in sync.
- CSS Modules alongside components/pages: local layout and visual rules. Global CSS variables provide the shared brand palette.

Replace empty WhatsApp, email, and city values with verified details. WhatsApp numbers need international country code and digits only. Until a number is supplied, contact alternatives use the provided Instagram account. Service links prefill the enquiry form using `/contact?service=branding` and the other service IDs.

Set `SITE_URL` (build-time sitemap origin) and `VITE_SITE_URL` (client canonical origin), or the shared `siteConfig.siteUrl`, before the release build. Without a configured origin the build warns and writes clearly replaceable `https://example.com` sitemap URLs. Check generated sitemap/robots output and canonical/Open Graph URLs on the deployed domain. Use a 1200 × 630 social preview and an approved logo asset.

### Replace placeholder artwork and evidence

The portfolio contains original generated poster concepts, not commissioned client case studies. Team entries, testimonials, project metrics, and blog posts are explicitly placeholders or examples. The “since 2016” statement comes from the supplied brief; other business achievements are not independently verified.

Add approved images under the public asset directory, then update the relevant project’s `image` and gallery entries. Prefer WebP/AVIF for photos, SVG for vectors, explicit dimensions, meaningful translated alt text, and small files. Local generated artwork remains available when an image is absent. Do not hotlink stock photos or publish client work without the right to use it.

Replace placeholder metrics with measured, attributable results. Remove concept/example labels only when the underlying content is real and approved. Replace team placeholders and quotes with consented names, roles, imagery, and testimonials. Preserve the font license files when redistributing the self-hosted fonts.

## Deploy

### One Node host: Render, Railway, or Replit

1. Install dependencies with `npm ci` when using the committed lockfile.
2. Build with `npm run build`.
3. Set `NODE_ENV=production`, real SMTP variables, verified proxy settings if needed, and `CLIENT_ORIGIN` to the actual public frontend origin.
4. Start with `npm start`; use the host-provided `PORT`.
5. Test direct visits to a nested route, `/api/health`, and an actual approved contact enquiry.

The Node host must support a persistent server process. In Replit, use `npm run dev` for workspace development and the build/start commands for deployment.

### Static frontend: Netlify or Vercel; API: Render or Railway

| Setting                  | Frontend                                                      |
| ------------------------ | ------------------------------------------------------------- |
| Framework                | Vite                                                          |
| Install                  | `npm ci`                                                      |
| Build                    | `npm run build`                                               |
| Publish/output directory | `dist`                                                        |
| Public API setting       | `VITE_API_URL` set to the deployed API origin before building |

Run the Express server on the API host with production SMTP configuration. Set backend `CLIENT_ORIGIN` to the exact frontend origin. Keep server secrets out of Netlify/Vercel frontend build variables. A static frontend alone cannot deliver enquiries.

Configure the static host to serve `index.html` for frontend routes, while preserving files and any API forwarding rule. On Netlify, the usual SPA rule is `/* /index.html 200`. On Vercel, use an equivalent frontend rewrite. Recheck direct navigation and reload on `/work/:slug` and `/blog/:slug`; a working homepage alone does not validate routing.

Changing `VITE_API_URL` requires rebuilding the frontend. If an API proxy is configured on the same public origin instead, leave the client API origin empty and route `/api` to the backend.

## Launch checklist

- [ ] Confirm WhatsApp, email, city, Instagram, services, public URL, and since-2016 statement.
- [ ] Replace portfolio images/case studies, metric values, team placeholders, quotes, and example articles.
- [ ] Approve both languages, exact logo rendering, fonts, and the dark visual direction.
- [ ] Configure SMTP and optional Telegram securely; verify real delivery and production failure behavior.
- [ ] Set real CORS origins and verified reverse-proxy settings.
- [ ] Review privacy wording, lead retention, spam handling, and applicable consent requirements.
- [ ] Check both languages at 360, 768, 1280, and 1536 px, plus keyboard and reduced-motion navigation.
- [ ] Verify nested-route reloads, 404 behavior, canonical/OG tags, sitemap, robots, and social preview.
- [ ] Run the final build, lint, server tests, and mobile Lighthouse audit after replacing assets.

## Validation evidence

- `npm run dev` starts Vite and Express together; `npm run build` and `npm run lint` pass.
- All 15 backend tests pass, including production delivery failures, sanitization, CORS, honeypot, rate limits, and mocked SMTP/Telegram behavior.
- Browser checks cover all requested widths in Arabic and English, with no horizontal overflow or JavaScript errors. Filters/search, case-study navigation, gallery keyboard controls/focus return, mobile drawer, FAQ, testimonials, and contact states were exercised.
- Automated WCAG A/AA scans report zero violations across 18 route/language states.
- Contact tests passed again after the Zod/resolver security updates. Provider delivery was mocked; real SMTP/Telegram credentials remain unconfigured.

The isolated production mobile Lighthouse run scored **90 Performance / 100 Accessibility / 100 Best Practices / 100 SEO**, with zero cumulative layout shift. Production responses use compression, and offscreen sections defer rendering work without removing their content. These are local synthetic results; remeasure the deployed site after replacing assets.

## Dependency audit limitation

The production audit has **zero high or critical advisories** after upgrading Nodemailer and Zod. It still reports two moderate advisories through the explicitly requested React Router v6 packages. Published fixes require Router v7. This app uses fixed internal navigation targets and no SSR router hydration, so it does not expose the affected untrusted-navigation or hydration paths. Reassess the dependency and permit a Router v7 migration before broadening those features; this is not a claim that the package advisories are resolved.
