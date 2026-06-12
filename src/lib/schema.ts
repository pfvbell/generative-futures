/**
 * JSON-LD builders for AEO / structured data.
 *
 * Centralising schema here keeps the markup correct and consistent. Every
 * builder returns a plain object ready to be JSON.stringified by <JsonLd>.
 */
import { SITE, AUTHOR, SAME_AS } from '../site.config';
import type { CollectionEntry } from 'astro:content';

const abs = (path: string) => new URL(path, SITE.url).href.replace(/\/$/, '') || SITE.url;

/** Stable @id for the Person node, referenced across pages. */
export const PERSON_ID = `${SITE.url}/#person`;
export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

export function personSchema() {
  return {
    '@type': 'Person',
    '@id': PERSON_ID,
    name: AUTHOR.name,
    jobTitle: AUTHOR.jobTitle,
    description: AUTHOR.bio,
    url: SITE.url,
    sameAs: SAME_AS,
  };
}

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    logo: abs('/logo.png'),
    image: abs(SITE.defaultOgImage),
    founder: { '@id': PERSON_ID },
    sameAs: SAME_AS,
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    inLanguage: SITE.language,
    publisher: { '@id': ORG_ID },
  };
}

/** The site-wide graph injected on every page. */
export function siteGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [websiteSchema(), organizationSchema(), personSchema()],
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}

export function faqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

/** Article or PodcastEpisode schema for a single post. */
export function postSchema(post: CollectionEntry<'posts'>) {
  const { data } = post;
  const url = abs(`/posts/${post.id}`);
  const image = abs(data.ogImage ?? SITE.defaultOgImage);

  const base = {
    '@context': 'https://schema.org',
    headline: data.title,
    name: data.title,
    description: data.description,
    abstract: data.summary,
    url,
    image,
    inLanguage: SITE.language,
    datePublished: data.pubDate.toISOString(),
    dateModified: (data.updatedDate ?? data.pubDate).toISOString(),
    keywords: data.keywords.join(', '),
    about: data.entities.slice(0, 12).map((name) => ({ '@type': 'Thing', name })),
    author: { '@id': PERSON_ID },
    publisher: { '@id': ORG_ID },
    isPartOf: { '@id': WEBSITE_ID },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    // The canonical full text lives on Substack — declare it.
    sameAs: [data.substackUrl],
  };

  if (data.type === 'podcast') {
    return {
      ...base,
      '@type': 'PodcastEpisode',
      ...(data.durationMinutes
        ? { timeRequired: `PT${data.durationMinutes}M` }
        : {}),
      associatedMedia: data.youtubeId
        ? {
            '@type': 'VideoObject',
            name: data.title,
            description: data.description,
            thumbnailUrl: `https://i.ytimg.com/vi/${data.youtubeId}/hqdefault.jpg`,
            uploadDate: data.pubDate.toISOString(),
            embedUrl: `https://www.youtube.com/embed/${data.youtubeId}`,
          }
        : undefined,
    };
  }

  return {
    ...base,
    '@type': data.type === 'newsletter' ? 'Article' : 'BlogPosting',
  };
}

/** ItemList schema for index / topic pages. */
export function itemListSchema(
  posts: CollectionEntry<'posts'>[],
  name: string,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name,
    itemListElement: posts.map((post, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: abs(`/posts/${post.id}`),
      name: post.data.title,
    })),
  };
}
