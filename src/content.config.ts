import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * The `posts` collection. One Markdown file per Substack essay / podcast.
 *
 * Each file carries everything the SEO/AEO layer needs: a tuned meta
 * description, a structured summary, key takeaways, an FAQ (rendered as
 * FAQPage JSON-LD for answer engines), named entities, target keywords, and
 * the canonical links out to Substack / YouTube / the podcast.
 *
 * The Markdown body is original commentary that points readers to the full
 * piece on Substack, we never republish the source articles wholesale.
 */
const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    /** 150–160 char meta description, answer-first and keyword-rich. */
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    /** Drives schema type + UI treatment. */
    type: z.enum(['essay', 'podcast', 'newsletter']).default('essay'),
    /** 60–90 word plain-language summary (also feeds the AI/AEO snippet). */
    summary: z.string(),
    takeaways: z.array(z.string()).default([]),
    faqs: z
      .array(z.object({ question: z.string(), answer: z.string() }))
      .default([]),
    /** People, orgs, books, concepts, strengthens entity SEO. */
    entities: z.array(z.string()).default([]),
    keywords: z.array(z.string()).default([]),
    topics: z.array(z.string()).default([]),

    // Canonical outbound links, the site funnels to these.
    substackUrl: z.string().url(),
    youtubeId: z.string().optional(),
    spotifyEpisodeUrl: z.string().url().optional(),

    // Podcast-only metadata.
    guest: z
      .object({ name: z.string(), bio: z.string() })
      .optional(),
    durationMinutes: z.number().optional(),

    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    /** Per-post social image override (relative to /public). */
    ogImage: z.string().optional(),
  }),
});

export const collections = { posts };
