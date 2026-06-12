/**
 * Topic clusters. Each becomes a pillar page at /topics/<slug> that links to
 * every post tagged with it — a classic SEO hub-and-spoke structure that helps
 * search and answer engines understand the publication's coverage of a subject.
 *
 * A post joins a topic via its `topics: [...]` frontmatter (matching `slug`).
 */
export interface Topic {
  slug: string;
  title: string;
  /** Meta description for the topic page. */
  description: string;
  /** Short intro paragraph shown at the top of the topic page. */
  intro: string;
}

export const TOPICS: Topic[] = [
  {
    slug: 'political-economy-of-ai',
    title: 'The Political Economy of AI',
    description:
      'Why AI is not inevitable. Essays and interviews on techno-determinism, who really steers technology, and how democratic societies can shape the future of AI.',
    intro:
      'The founding idea of Generative Futures: technologies are malleable, not inevitable. Their impact is the product of political choices, institutions, and material conditions — which means a different future is possible.',
  },
  {
    slug: 'how-ai-works',
    title: 'How AI Actually Works',
    description:
      'Plain-language explainers on transformers, interpretability, and the limits of large language models — making the technical AI debate legible to non-specialists.',
    intro:
      'You cannot steer a technology you do not understand. These pieces open up the technical workings of modern AI — architectures, interpretability, and where today’s models break.',
  },
  {
    slug: 'ai-and-work',
    title: 'AI, Work & the Economy',
    description:
      'Will AI replace jobs or augment workers? Essays on automation, the productivity paradox, teaching, and whether AI raises or stagnates wages.',
    intro:
      'Whether AI replaces or empowers workers is a political choice, not a technical destiny. These pieces examine automation, productivity, and the economics of an AI labour market.',
  },
  {
    slug: 'ai-safety-and-alignment',
    title: 'AI Safety & Alignment',
    description:
      'Interpretability, positive alignment, and the politics of AI safety — conversations with researchers at the frontier of making AI legible and aligned.',
    intro:
      'Making AI safe is as much a political and institutional question as a technical one. These pieces explore interpretability, alignment, and human flourishing as a design target.',
  },
  {
    slug: 'ai-and-geopolitics',
    title: 'AI & Geopolitics',
    description:
      'The US–China AI race, the agent economy, compute and sovereignty, and whether Europe can catch up — the contested infrastructure of the AI era.',
    intro:
      'AI is being built into the infrastructure of power. These pieces map the US–China race, the contested agent economy, and the politics of compute, sovereignty, and progress.',
  },
  {
    slug: 'ai-and-society',
    title: 'AI, Time & Society',
    description:
      'How AI is reshaping memory, time, creativity, and learning — and whether it could be an antidote to social media rather than an accelerant.',
    intro:
      'Beyond economics and geopolitics, AI is reshaping how we experience time, memory, creativity, and learning. These pieces ask what kind of human life we want technology to support.',
  },
];

export const TOPIC_BY_SLUG = new Map(TOPICS.map((t) => [t.slug, t]));
