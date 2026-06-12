// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// The canonical production URL. Change this to your custom domain once it's live
// (e.g. 'https://generativefutures.org'). Everything SEO, canonical tags,
// sitemap, RSS, JSON-LD, Open Graph, derives from this single value.
export const SITE_URL = 'https://generativefutures.app';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  trailingSlash: 'never',
  // The site stays static; only routes that opt in with `export const
  // prerender = false` (the /api/latest-posts.json endpoint) run on demand as
  // a Vercel serverless function. This lets us read the Substack feed
  // server-side and dodge browser CORS restrictions.
  output: 'static',
  adapter: vercel(),
  integrations: [
    sitemap({
      // Show search engines the relative importance + freshness of pages.
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        if (item.url === SITE_URL + '/') item.priority = 1.0;
        if (item.url.includes('/posts/')) item.priority = 0.8;
        if (item.url.includes('/topics/')) item.priority = 0.6;
        return item;
      },
    }),
  ],
  build: {
    inlineStylesheets: 'auto',
  },
});
