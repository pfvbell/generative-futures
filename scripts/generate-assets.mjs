/**
 * Generate every brand raster the site needs from the master logo
 * (`assets/brand-logo.png`, the navy square with the cream diverging mark).
 *
 * Runs automatically before each build via the `prebuild` npm script, and can
 * be run manually:  node scripts/generate-assets.mjs
 *
 * Outputs (into /public):
 *   logo.png            512×512 full square, Organization/OG schema + OG image
 *   mark.png            256×256 tight mark on navy, header brand chip
 *   apple-touch-icon    180×180 tight mark on navy
 *   favicon-32 / -16    PNG favicons
 *   og-default.png      1200×630 social share card (logo + wordmark + tagline)
 *
 * Uses `sharp`, a dependency of Astro, no extra install.
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const r = (p) => resolve(root, p);
const SRC = r('assets/brand-logo.png');

async function run() {
  // The logo's own background navy, reused so composites blend seamlessly.
  const corner = await sharp(SRC)
    .extract({ left: 0, top: 0, width: 1, height: 1 })
    .raw()
    .toBuffer();
  const bg = { r: corner[0], g: corner[1], b: corner[2] };

  // The bare mark (navy trimmed away), used for the small icons so the lines
  // stay legible at favicon sizes.
  const trimmed = await sharp(SRC).trim({ threshold: 12 }).toBuffer();

  async function icon(size, outPath, pad = 0.16) {
    const inner = Math.round(size * (1 - pad));
    const fg = await sharp(trimmed)
      .resize({ width: inner, height: inner, fit: 'contain', background: bg })
      .png()
      .toBuffer();
    await sharp({
      create: { width: size, height: size, channels: 4, background: bg },
    })
      .composite([{ input: fg, gravity: 'center' }])
      .png()
      .toFile(r(outPath));
    console.log(`✓ ${outPath}`);
  }

  // Full square logo (keeps the intended composition).
  await sharp(SRC).resize(512, 512).png().toFile(r('public/logo.png'));
  console.log('✓ public/logo.png');

  // Tight-mark icons.
  await icon(256, 'public/mark.png', 0.18);
  await icon(180, 'public/apple-touch-icon.png');
  await icon(32, 'public/favicon-32.png', 0.1);
  await icon(16, 'public/favicon-16.png', 0.08);

  // Social share card: logo on the left, wordmark + tagline on the right.
  const W = 1200;
  const H = 630;
  const logoSize = 500;
  const logo = await sharp(SRC).resize(logoSize, logoSize).png().toBuffer();
  const cream = '#f2efe3';
  const text = Buffer.from(
    `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
      <style>text{font-family:'Helvetica Neue',Helvetica,Arial,'DejaVu Sans',sans-serif;}</style>
      <text x="630" y="250" font-size="28" font-weight="700" fill="#8198ba" letter-spacing="4">GENERATIVE FUTURES</text>
      <text x="630" y="328" font-size="46" font-weight="800" fill="${cream}">Building progressive</text>
      <text x="630" y="386" font-size="46" font-weight="800" fill="${cream}">technological futures.</text>
      <text x="630" y="448" font-size="25" font-weight="500" fill="#9fb3d1">The political economy of AI · Phil Bell</text>
    </svg>`,
  );
  await sharp({
    create: { width: W, height: H, channels: 4, background: bg },
  })
    .composite([
      { input: logo, left: 70, top: Math.round((H - logoSize) / 2) },
      { input: text, left: 0, top: 0 },
    ])
    .png()
    .toFile(r('public/og-default.png'));
  console.log('✓ public/og-default.png');

  console.log('All brand assets generated.');
}

run().catch((err) => {
  // Don't hard-fail the build if generation hiccups; existing files remain.
  console.warn('⚠ Could not generate brand assets:', err.message);
});
