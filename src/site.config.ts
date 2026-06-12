/**
 * Central configuration for Generative Futures.
 *
 * This is the single source of truth for the brand, author, and every external
 * link. SEO metadata, JSON-LD structured data, the footer, and the platform
 * buttons all read from here — so updating a URL once updates it everywhere.
 *
 * Items marked UNVERIFIED were probable-but-unconfirmed during research.
 * Confirm them, then set `verified: true` (or just delete the line) to surface
 * them across the site.
 */

export const SITE = {
  name: 'Generative Futures',
  /** Used in <title> suffixes and JSON-LD. */
  shortName: 'Generative Futures',
  tagline: 'Building progressive technological futures',
  /** One-line description used as the default meta description + Org schema. */
  description:
    'Generative Futures explores the political economy of AI — how democratic societies can steer technology toward a progressive future, instead of being steered by it. Essays and podcasts by Phil Bell.',
  /** Longer "elevator pitch" used on the homepage hero + About page intro. */
  mission:
    'A project dedicated to escaping techno-determinism and thinking through how to build progressive technological futures.',
  /** Production URL. Must match `site` in astro.config.mjs. */
  url: 'https://generativefutures.app',
  locale: 'en_GB',
  language: 'en',
  /** Default social-share image (relative to /public). */
  defaultOgImage: '/og-default.png',
  themeColor: '#0b1f3a',
} as const;

export const AUTHOR = {
  name: 'Phil Bell',
  jobTitle: 'Writer & founder, Generative Futures',
  bio: 'Phil Bell writes Generative Futures, a publication on the political economy of AI and how to build progressive technological futures. He interviews researchers at the frontier of AI and AI safety.',
  // UNVERIFIED — research found @PhilipfvBell as probable but could not confirm.
  // Confirm and set to the real URL, or leave empty to hide.
  twitter: '', // e.g. 'https://x.com/PhilipfvBell'
  twitterHandle: '', // e.g. '@PhilipfvBell' — used for twitter:creator card
  linkedin: '', // add if/when available
} as const;

/**
 * Every place readers can find the publication. `primary: true` items are
 * featured prominently (hero, platform bar); others appear in the footer.
 */
export const PLATFORMS = {
  substack: {
    label: 'Substack',
    cta: 'Read & subscribe',
    url: 'https://genfutures.substack.com',
    handle: 'genfutures.substack.com',
    primary: true,
  },
  youtube: {
    label: 'YouTube',
    cta: 'Watch',
    url: 'https://www.youtube.com/@generativefutures',
    handle: '@generativefutures',
    primary: true,
  },
  spotify: {
    label: 'Spotify',
    cta: 'Listen',
    url: 'https://open.spotify.com/show/5XfgcoT3QpRY1WEi8dqm4h',
    handle: 'Generative Futures',
    primary: true,
  },
  applePodcasts: {
    label: 'Apple Podcasts',
    cta: 'Listen',
    url: 'https://podcasts.apple.com/us/podcast/tech-futures-project/id1850111159',
    handle: 'Generative Futures',
    primary: false,
  },
  rss: {
    label: 'Podcast RSS',
    cta: 'Subscribe via RSS',
    url: 'https://api.substack.com/feed/podcast/1266094.rss',
    handle: 'RSS',
    primary: false,
  },
} as const;

/** Ordered list of platforms for nav/footer rendering. */
export const PLATFORM_LIST = Object.values(PLATFORMS);

/** sameAs array for Organization / Person JSON-LD (helps entity SEO/AEO). */
export const SAME_AS: string[] = [
  PLATFORMS.substack.url,
  PLATFORMS.youtube.url,
  PLATFORMS.spotify.url,
  PLATFORMS.applePodcasts.url,
  ...(AUTHOR.twitter ? [AUTHOR.twitter] : []),
  ...(AUTHOR.linkedin ? [AUTHOR.linkedin] : []),
];

/** Primary nav links. */
export const NAV = [
  { label: 'Start here', href: '/start-here' },
  { label: 'Essays & podcasts', href: '/posts' },
  { label: 'Topics', href: '/topics' },
  { label: 'Podcast', href: '/podcast' },
  { label: 'About', href: '/about' },
] as const;
