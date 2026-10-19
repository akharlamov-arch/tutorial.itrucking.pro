/**
 * Запускается после `vite build`. Для каждого туториала создаёт dist/tutorials/<slug>/index.html —
 * копию приложения со своими <title>, description и Open Graph (превью ссылки в мессенджерах).
 * Благодаря этому прямые ссылки на туториалы работают на статическом хостинге (S3).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import type { Tutorial } from '../src/content/schema';

const root = path.resolve(import.meta.dirname, '..');
const dist = path.join(root, 'dist');

interface ManifestEntry {
  file: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}

interface PageMeta {
  title: string;
  description: string;
  url: string;
  image?: string;
}

function renderHead(template: string, meta: PageMeta): string {
  const tags = [
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="iTrucking" />`,
    `<meta property="og:title" content="${escapeHtml(meta.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(meta.url)}" />`,
    `<link rel="canonical" href="${escapeHtml(meta.url)}" />`,
    ...(meta.image
      ? [
          `<meta property="og:image" content="${escapeHtml(meta.image)}" />`,
          `<meta name="twitter:card" content="summary_large_image" />`,
        ]
      : []),
  ];

  return template
    .replace(/<title>.*?<\/title>/s, `<title>${escapeHtml(meta.title)}</title>`)
    .replace(
      /<meta name="description" content=".*?" \/>/s,
      `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    )
    .replace('</head>', `    ${tags.join('\n    ')}\n  </head>`);
}

async function loadContent() {
  // Загружаем контент через Vite, чтобы работали import картинок и import.meta.glob.
  const vite = await createServer({
    root,
    logLevel: 'error',
    server: { middlewareMode: true, hmr: false },
    appType: 'custom',
  });
  try {
    const content = (await vite.ssrLoadModule('/src/content/index.ts')) as {
      tutorials: Tutorial[];
    };
    const { site } = (await vite.ssrLoadModule('/src/config/site.ts')) as {
      site: { url: string };
    };
    return { tutorials: content.tutorials, siteUrl: site.url };
  } finally {
    await vite.close();
  }
}

async function main() {
  const template = await fs.readFile(path.join(dist, 'index.html'), 'utf8');
  const manifest = JSON.parse(
    await fs.readFile(path.join(dist, '.vite/manifest.json'), 'utf8'),
  ) as Record<string, ManifestEntry>;
  const { tutorials, siteUrl } = await loadContent();

  // В режиме Vite-сервера import картинки даёт исходный путь (/src/...), в сборке — файл с хешем.
  const builtUrl = (sourcePath: string): string | undefined => {
    const entry = manifest[sourcePath.replace(/^\//, '')];
    return entry ? `${siteUrl}/${entry.file}` : undefined;
  };

  const homeTitle = /<title>(.*?)<\/title>/s.exec(template)?.[1] ?? 'iTrucking';
  const homeDescription = /<meta name="description" content="(.*?)"/s.exec(template)?.[1] ?? '';
  await fs.writeFile(
    path.join(dist, 'index.html'),
    renderHead(template, { title: homeTitle, description: homeDescription, url: `${siteUrl}/` }),
  );

  for (const tutorial of tutorials) {
    const cover = tutorial.cover;
    const coverSource = typeof cover === 'string' ? cover : cover?.ru;
    const html = renderHead(template, {
      title: `${tutorial.title.ru} | iTrucking`,
      description: tutorial.description.ru,
      url: `${siteUrl}/tutorials/${tutorial.slug}`,
      image: coverSource ? builtUrl(coverSource) : undefined,
    });
    const dir = path.join(dist, 'tutorials', tutorial.slug);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, 'index.html'), html);
  }

  console.log(`prerender: ${tutorials.length} tutorial pages written to dist/tutorials/`);
}

await main();
