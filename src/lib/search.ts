import type { CategoryId } from '@/content/categories';
import type { Lang, Tutorial } from '@/content/schema';

export interface TutorialFilter {
  query: string;
  category: CategoryId | 'all';
  lang: Lang;
}

/** Фильтр по категории и поиск по названию и описанию на текущем языке. */
export function filterTutorials(tutorials: Tutorial[], { query, category, lang }: TutorialFilter) {
  const needle = query.trim().toLocaleLowerCase(lang);
  return tutorials.filter((tutorial) => {
    if (category !== 'all' && tutorial.category !== category) return false;
    if (!needle) return true;
    return (
      tutorial.title[lang].toLocaleLowerCase(lang).includes(needle) ||
      tutorial.description[lang].toLocaleLowerCase(lang).includes(needle)
    );
  });
}
