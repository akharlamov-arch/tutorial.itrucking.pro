import type { Tutorial } from '@/content/schema';

/**
 * Рекомендации к туториалу:
 * 1. явно указанные в `related`;
 * 2. иначе — следующие по порядку туториалы той же категории (по кругу);
 * 3. если в категории больше никого нет — первые по порядку из других категорий.
 * Туториалы с `hideFromRecommendations` предлагаются только через `related`.
 */
export function getRecommendations(current: Tutorial, all: Tutorial[], limit = 2): Tutorial[] {
  if (current.related?.length) {
    return current.related
      .map((slug) => all.find((t) => t.slug === slug))
      .filter((t): t is Tutorial => t !== undefined)
      .slice(0, limit);
  }

  const candidates = all.filter((t) => t.slug !== current.slug && !t.hideFromRecommendations);
  const sameCategory = candidates.filter((t) => t.category === current.category);

  if (sameCategory.length > 0) {
    const after = sameCategory.filter((t) => t.order > current.order);
    const before = sameCategory.filter((t) => t.order <= current.order);
    return [...after, ...before].slice(0, limit);
  }

  return candidates.slice(0, limit);
}
