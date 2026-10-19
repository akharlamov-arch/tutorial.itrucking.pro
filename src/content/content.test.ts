import { describe, expect, it } from 'vitest';
import { categories } from './categories';
import { tutorials } from './index';
import type { Block } from './schema';
import { collectTexts } from '@/lib/tutorial';

// Эти тесты ловят ошибки при добавлении и правке туториалов.

const slugs = new Set(tutorials.map((t) => t.slug));

function collectImages(blocks: Block[]): unknown[] {
  return blocks.flatMap((block): unknown[] => {
    if (block.type === 'image') return [block.src];
    if (block.type === 'callout' && block.image !== undefined) return [block.image];
    if (block.type === 'steps') return block.items.flatMap((step) => collectImages(step.blocks));
    return [];
  });
}

describe('контент туториалов', () => {
  it('туториалы найдены', () => {
    expect(tutorials.length).toBeGreaterThan(0);
  });

  it('slug — латиница в нижнем регистре, цифры и дефисы', () => {
    for (const { slug } of tutorials) expect(slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
  });

  it('у каждого туториала существующая категория', () => {
    const ids = categories.map((c) => c.id as string);
    for (const t of tutorials) expect(ids, t.slug).toContain(t.category);
  });

  it.each(tutorials.map((t) => [t.slug, t] as const))(
    '%s: все тексты заполнены на RU и EN',
    (_, t) => {
      for (const text of collectTexts(t)) {
        expect(text.ru.trim(), `пустой RU-текст (EN: "${text.en}")`).not.toBe('');
        expect(text.en.trim(), `пустой EN-текст (RU: "${text.ru}")`).not.toBe('');
      }
    },
  );

  it.each(tutorials.map((t) => [t.slug, t] as const))(
    '%s: ссылки tutorial:… ведут на существующие туториалы',
    (_, t) => {
      for (const text of collectTexts(t)) {
        for (const value of [text.ru, text.en]) {
          for (const [, target] of value.matchAll(/\]\(tutorial:([^)]+)\)/g)) {
            expect(slugs, `ссылка на несуществующий туториал "${target}"`).toContain(target);
          }
        }
      }
    },
  );

  it.each(tutorials.map((t) => [t.slug, t] as const))(
    '%s: related ссылается на существующие туториалы',
    (_, t) => {
      for (const slug of t.related ?? []) expect(slugs, `related: "${slug}"`).toContain(slug);
    },
  );

  it.each(tutorials.map((t) => [t.slug, t] as const))('%s: у всех картинок есть файл', (_, t) => {
    const images = [t.cover, ...collectImages(t.body)].filter((image) => image !== undefined);
    for (const image of images) {
      const sources = typeof image === 'string' ? [image] : Object.values(image as object);
      for (const src of sources) expect(src).toEqual(expect.any(String));
    }
  });
});
