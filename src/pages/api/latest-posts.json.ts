import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

/**
 * Live "Latest from Substack" endpoint.
 *
 * Runs on demand (Vercel serverless) — NOT prerendered — so it can fetch the
 * Substack RSS feed server-side, sidestepping the browser CORS restrictions
 * that block a direct client fetch. Returns the newest posts and marks which
 * ones already have a dedicated page on this site.
 */
export const prerender = false;

const FEED_URL = 'https://genfutures.substack.com/feed';
const MAX_ITEMS = 8;

/** Strip CDATA + decode the handful of XML entities Substack uses. */
function decode(str: string): string {
  return str
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .trim();
}

function tag(block: string, name: string): string | null {
  const m = block.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`, 'i'));
  return m ? decode(m[1]) : null;
}

/** Extract the post slug from a Substack /p/<slug> URL. */
function slugFromUrl(url: string | null): string | null {
  if (!url) return null;
  const m = url.match(/\/p\/([^/?#]+)/);
  return m ? m[1] : null;
}

export const GET: APIRoute = async () => {
  // Build a map of Substack slug -> local page path for posts already on the site.
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  const onSite = new Map<string, string>();
  for (const p of posts) {
    const slug = slugFromUrl(p.data.substackUrl);
    if (slug) onSite.set(slug, `/posts/${p.id}`);
  }

  let xml: string;
  try {
    const res = await fetch(FEED_URL, {
      headers: {
        'User-Agent': 'GenerativeFutures-site/1.0 (+https://generativefutures.app)',
        Accept: 'application/rss+xml, application/xml, text/xml',
      },
    });
    if (!res.ok) throw new Error(`Feed responded ${res.status}`);
    xml = await res.text();
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'Could not reach Substack', items: [] }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const blocks = xml.match(/<item>[\s\S]*?<\/item>/g) ?? [];
  const items = blocks.slice(0, MAX_ITEMS).map((block) => {
    const title = tag(block, 'title') ?? 'Untitled';
    const link = (tag(block, 'link') ?? '').trim();
    const pubDate = tag(block, 'pubDate');
    const isPodcast = /<enclosure[^>]+type="audio/i.test(block);
    const slug = slugFromUrl(link);
    const localPath = slug ? onSite.get(slug) ?? null : null;
    let date: string | null = null;
    if (pubDate) {
      const d = new Date(pubDate);
      if (!Number.isNaN(d.valueOf())) date = d.toISOString();
    }
    return {
      title,
      url: link,
      date,
      type: isPodcast ? 'podcast' : 'essay',
      onSite: Boolean(localPath),
      localPath,
    };
  });

  return new Response(JSON.stringify({ ok: true, items }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      // Cache at the edge for 15 min; serve stale while revalidating so we
      // don't hammer Substack and the button feels instant.
      'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600',
    },
  });
};
