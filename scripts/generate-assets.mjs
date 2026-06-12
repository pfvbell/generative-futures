/**
 * Rasterise the brand SVGs into the PNGs that social crawlers and app icons
 * need (most do not render SVG Open Graph images). Runs automatically before
 * every build via the `prebuild` npm script, and can be run manually:
 *
 *   node scripts/generate-assets.mjs
 *
 * Uses `sharp`, which ships as a dependency of Astro — no extra install.
 */
import sharp from 'sharp';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const r = (p) => resolve(root, p);

async function svgToPng(svgPath, outPath, width, height) {
  const svg = await readFile(r(svgPath));
  const img = sharp(svg, { density: 220 });
  if (height) img.resize(width, height, { fit: 'cover' });
  else img.resize(width, width);
  await img.png().toFile(r(outPath));
  console.log(`✓ ${outPath}`);
}

try {
  // 1200×630 social share card.
  await svgToPng('assets/og-default.svg', 'public/og-default.png', 1200, 630);
  // App / Org logo (square).
  await svgToPng('public/favicon.svg', 'public/logo.png', 512, 512);
  // Apple touch icon.
  await svgToPng('public/favicon.svg', 'public/apple-touch-icon.png', 180, 180);
  console.log('All brand assets generated.');
} catch (err) {
  // Don't hard-fail the build if sharp is unavailable in some environment;
  // the SVG fallbacks still exist.
  console.warn('⚠ Could not generate raster assets:', err.message);
}
