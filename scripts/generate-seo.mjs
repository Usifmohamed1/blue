import 'dotenv/config';
import { writeFile, readFile } from 'node:fs/promises';
import { siteConfig } from '../src/data/config.js';
import { projects } from '../src/data/projects.js';
import { posts } from '../src/data/posts.js';
const configured = process.env.SITE_URL || siteConfig.siteUrl;
const base = new URL(configured || 'https://example.com');
if (!['https:', 'http:'].includes(base.protocol))
  throw new Error('SITE_URL must use HTTPS or HTTP.');
if (!configured)
  console.warn('Set SITE_URL before launch. sitemap.xml currently uses https://example.com.');
const escape = (v) =>
  String(v).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[c],
  );
const routes = [
  '/',
  '/services',
  '/work',
  '/about',
  '/contact',
  '/blog',
  ...projects.map((p) => `/work/${p.slug}`),
  ...posts.map((p) => `/blog/${p.slug}`),
];
await writeFile(
  'dist/sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${routes.map((path) => `\n  <url><loc>${escape(new URL(path, base).href)}</loc></url>`).join('')}\n</urlset>\n`,
);
await writeFile(
  'dist/robots.txt',
  `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', base).href}\n`,
);
let html = await readFile('dist/index.html', 'utf8');
if (configured)
  html = html.replace(
    'content="/social-card.png"',
    `content="${escape(new URL('/social-card.png', base).href)}"`,
  );
await writeFile('dist/index.html', html);
await writeFile('dist/_redirects', '/* /index.html 200\n');
console.log(`Generated sitemap.xml and robots.txt for ${routes.length} routes.`);
