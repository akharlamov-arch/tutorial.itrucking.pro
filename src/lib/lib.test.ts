import { describe, expect, it } from 'vitest';
import type { Block, Tutorial, TutorialInput } from '@/content/schema';
import { messages } from '@/i18n/messages';
import { pluralizeSteps } from './plural';
import { getRecommendations } from './recommendations';
import { filterTutorials } from './search';
import { buildTutorial, countSteps } from './tutorial';

function make(slug: string, overrides: Partial<TutorialInput> = {}): Tutorial {
  return buildTutorial(slug, {
    category: 'itrucking-pro',
    order: 1,
    title: { ru: slug, en: slug },
    description: { ru: 'описание', en: 'description' },
    body: [],
    ...overrides,
  });
}

const step = { title: { ru: 'Шаг', en: 'Step' }, blocks: [] };

describe('pluralizeSteps', () => {
  it.each([
    [1, 'шаг'],
    [2, 'шага'],
    [4, 'шага'],
    [5, 'шагов'],
    [11, 'шагов'],
    [21, 'шаг'],
    [22, 'шага'],
  ])('ru: %i %s', (count, expected) => {
    expect(pluralizeSteps(count, 'ru', messages.ru)).toBe(expected);
  });

  it('en', () => {
    expect(pluralizeSteps(1, 'en', messages.en)).toBe('step');
    expect(pluralizeSteps(3, 'en', messages.en)).toBe('steps');
  });
});

describe('countSteps / readTime', () => {
  it('считает только основные шаги', () => {
    const body: Block[] = [
      { type: 'steps', items: [step, step] },
      { type: 'steps', variant: 'secondary', items: [step, step, step] },
    ];
    expect(countSteps(body)).toBe(2);
  });

  it('берёт readTime из файла, если он указан, иначе считает по словам', () => {
    expect(make('a', { readTime: 7 }).readTime).toBe(7);
    const longText = Array.from({ length: 400 }, () => 'слово').join(' ');
    const auto = make('b', { body: [{ type: 'text', text: { ru: longText, en: 'x' } }] });
    expect(auto.readTime).toBe(3);
  });
});

describe('filterTutorials', () => {
  const list = [
    make('ifta', { title: { ru: 'IFTA отчет', en: 'IFTA report' } }),
    make('tires', {
      category: 'tire-discount',
      description: { ru: 'Скидки на шины', en: 'Tire discounts' },
    }),
  ];

  it('ищет по названию и описанию без учёта регистра на текущем языке', () => {
    expect(
      filterTutorials(list, { query: 'ifta', category: 'all', lang: 'ru' }).map((t) => t.slug),
    ).toEqual(['ifta']);
    expect(
      filterTutorials(list, { query: 'ШИНЫ', category: 'all', lang: 'ru' }).map((t) => t.slug),
    ).toEqual(['tires']);
    expect(filterTutorials(list, { query: 'шины', category: 'all', lang: 'en' })).toEqual([]);
  });

  it('фильтрует по категории', () => {
    expect(
      filterTutorials(list, { query: '', category: 'tire-discount', lang: 'ru' }).map(
        (t) => t.slug,
      ),
    ).toEqual(['tires']);
  });
});

describe('getRecommendations', () => {
  const a = make('a', { order: 1 });
  const b = make('b', { order: 2 });
  const hidden = make('hidden', { order: 3, hideFromRecommendations: true });
  const c = make('c', { order: 4 });
  const other = make('other', { order: 5, category: 'tire-discount' });
  const all = [a, b, hidden, c, other];

  it('берёт следующие туториалы той же категории по кругу и пропускает скрытые', () => {
    expect(getRecommendations(b, all).map((t) => t.slug)).toEqual(['c', 'a']);
  });

  it('если в категории никого нет — берёт из других категорий', () => {
    expect(getRecommendations(other, all).map((t) => t.slug)).toEqual(['a', 'b']);
  });

  it('явный related важнее автоматического подбора', () => {
    const withRelated = make('x', { related: ['other', 'hidden'] });
    expect(getRecommendations(withRelated, all).map((t) => t.slug)).toEqual(['other', 'hidden']);
  });
});
