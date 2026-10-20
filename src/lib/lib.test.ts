import { describe, expect, it } from 'vitest';
import type { Block, Tutorial, TutorialInput } from '@/content/schema';
import { messages } from '@/i18n/messages';
import { pluralizeSteps } from './plural';
import { getRecommendations } from './recommendations';
import { buildTutorial, countSteps } from './tutorial';
import { typograph } from './typography';

function make(slug: string, overrides: Partial<TutorialInput> = {}): Tutorial {
  return buildTutorial(slug, {
    category: 'pumpprice',
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

  it('не предлагает туториалы из других категорий', () => {
    for (const tutorial of [a, b, c]) {
      expect(getRecommendations(tutorial, all).map((t) => t.slug)).not.toContain('other');
    }
  });

  it('если туториал в категории один — рекомендаций нет', () => {
    expect(getRecommendations(other, all)).toEqual([]);
  });

  it('явный related задаёт порядок, но только внутри категории', () => {
    const withRelated = make('x', { order: 6, related: ['other', 'hidden', 'a'] });
    expect(getRecommendations(withRelated, [...all, withRelated]).map((t) => t.slug)).toEqual([
      'hidden',
      'a',
    ]);
  });
});

describe('typograph', () => {
  const NBSP = '\u00A0';

  it('привязывает короткие предлоги и союзы к следующему слову', () => {
    expect(typograph('Нажмите на кнопку и выберите в меню')).toBe(
      `Нажмите на${NBSP}кнопку и${NBSP}выберите в${NBSP}меню`,
    );
    expect(typograph('Для клиентов без предоплаты')).toBe(
      `Для${NBSP}клиентов без${NBSP}предоплаты`,
    );
  });

  it('обрабатывает подряд идущие короткие слова и начало строки', () => {
    expect(typograph('В меню и в отчёте')).toBe(`В${NBSP}меню и${NBSP}в${NBSP}отчёте`);
  });

  it('привязывает английские артикли и предлоги', () => {
    expect(typograph('Click the icon to open a report')).toBe(
      `Click the${NBSP}icon to${NBSP}open a${NBSP}report`,
    );
  });

  it('не отрывает тире от предыдущего слова', () => {
    expect(typograph('Отправьте коды сразу — они действуют недолго')).toBe(
      `Отправьте коды сразу${NBSP}— они действуют недолго`,
    );
  });

  it('не трогает разметку, ссылки и длинные слова', () => {
    const text = 'Откройте [страницу](https://itrucking.pro/) и нажмите **«Save»**';
    expect(typograph(text)).toBe(
      `Откройте [страницу](https://itrucking.pro/) и${NBSP}нажмите **«Save»**`,
    );
    expect(typograph('Водитель заправится')).toBe('Водитель заправится');
  });
});
