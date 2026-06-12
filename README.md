# Generative Futures — website

The SEO/AEO-optimised companion site for **Generative Futures**, Phil Bell's
publication on the political economy of AI. Its job is to help people discover
the work and route them to the [Substack](https://genfutures.substack.com),
[YouTube](https://www.youtube.com/@generativefutures), and the podcast (on
Spotify and Apple Podcasts).

Built with [Astro](https://astro.build) — static, fast, and structured-data
rich. Designed to deploy to Vercel with a custom domain.

---

## Quick start

```bash
npm install
npm run dev      # local dev server at http://localhost:4321
npm run build    # production build into ./dist
npm run preview  # preview the production build locally
```

`npm run build` automatically regenerates the brand raster images
(`public/og-default.png`, `logo.png`, `apple-touch-icon.png`) from the SVG
sources via `scripts/generate-assets.mjs`.

---

## How it's organised

```
src/
  site.config.ts        ← brand, author, ALL external links (edit this first)
  content.config.ts     ← schema for posts
  content/posts/*.md    ← one Markdown file per essay / podcast
  data/topics.ts        ← topic cluster (pillar) pages
  lib/schema.ts         ← JSON-LD builders (Organization, Article, FAQ, …)
  components/            ← BaseHead (meta), Header, Footer, PostCard, FAQ, …
  layouts/              ← BaseLayout, PostLayout
  pages/                ← home, about, start-here, posts, topics, podcast, rss
public/                 ← robots.txt, favicon, generated images
```

## Editing content

**Add or update a post:** create/edit a Markdown file in `src/content/posts/`.
The frontmatter drives everything — meta description, summary, takeaways, the
FAQ (which becomes FAQ schema for AI answer engines), entities, keywords, and
the outbound links. See any existing file for the full shape, or
`src/content.config.ts` for the schema. The Markdown body is short original
commentary that points readers to the full piece on Substack — we deliberately
do **not** republish the source articles.

**Change a link, the brand, or the author:** edit `src/site.config.ts`. Every
page, the footer, and the structured data read from it.

### ⚠️ Unverified items to confirm

These were probable-but-unconfirmed during research. Confirm, then fill in
`src/site.config.ts`:

- **X/Twitter handle** — research found `@PhilipfvBell` but couldn't verify it.
  Set `AUTHOR.twitter` and `AUTHOR.twitterHandle` once confirmed (empty = hidden).
- **Newspeak House reading group** — referenced on the About page from your own
  article; edit/remove in `src/pages/about.astro` if needed.

---

## SEO / AEO features built in

- **Per-page canonical URLs**, robots directives, Open Graph + Twitter cards.
- **JSON-LD structured data**: `Organization`, `WebSite`, `Person` on every
  page; `BlogPosting` / `Article` / `PodcastEpisode` per post;
  `BreadcrumbList`; `FAQPage`; `ItemList` on index/topic pages; `PodcastSeries`.
- **Answer-engine ready**: every post has an answer-first "In short" summary and
  an FAQ block mirrored in FAQ schema. `robots.txt` explicitly welcomes AI
  crawlers (GPTBot, PerplexityBot, ClaudeBot, OAI-SearchBot, Google-Extended…).
- **Automatic `sitemap-index.xml`** (via `@astrojs/sitemap`) and **RSS** at
  `/rss.xml`.
- **Topic cluster pages** (`/topics/*`) for hub-and-spoke internal linking.
- **Fast by default**: static HTML, system fonts (no web-font requests),
  inlined critical CSS, lazy-loaded embeds.

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel: **New Project → import the repo**. Framework preset auto-detects
   as **Astro**; build command `npm run build`, output `dist`. No env vars
   needed.
3. **Custom domain:** Vercel → Project → *Settings → Domains* → add your domain
   (e.g. `generativefutures.app`) and follow the DNS instructions.
4. **Important — set the production URL:** update `SITE_URL` in
   `astro.config.mjs` **and** `url` in `src/site.config.ts` to your real domain,
   then update the `Sitemap:` line in `public/robots.txt`. Canonical tags, the
   sitemap, RSS, and all JSON-LD derive from this. Redeploy.

### After launch — recommended

- Submit the site to **Google Search Console** and **Bing Webmaster Tools**, and
  submit `sitemap-index.xml`.
- Add a real, high-quality `public/og-default.png` if you want to replace the
  generated one (1200×630).
- Consider verifying the site on each platform and cross-linking back from your
  Substack/YouTube descriptions to boost discovery.
