import { useMemo, useState } from 'react';
import { Outlet, useSearchParams } from 'react-router';
import { CategoryFilter } from '@/components/CategoryFilter/CategoryFilter';
import { Footer } from '@/components/Footer/Footer';
import { Header } from '@/components/Header/Header';
import { Hero } from '@/components/Hero/Hero';
import { TutorialGrid } from '@/components/TutorialGrid/TutorialGrid';
import { tutorials } from '@/content';
import { isCategoryId, type CategoryId } from '@/content/categories';
import { useI18n } from '@/i18n/context';
import { filterTutorials } from '@/lib/search';

/** Главная: список туториалов. Открытый туториал рендерится поверх через <Outlet />. */
export function HomePage() {
  const { lang } = useI18n();
  const [query, setQuery] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get('category');
  const category: CategoryId | 'all' = isCategoryId(categoryParam) ? categoryParam : 'all';
  const setCategory = (value: CategoryId | 'all') =>
    setSearchParams(value === 'all' ? {} : { category: value });

  const visible = useMemo(
    () => filterTutorials(tutorials, { query, category, lang }),
    [query, category, lang],
  );

  return (
    <>
      <Header />
      <main>
        <Hero query={query} onQueryChange={setQuery} />
        <CategoryFilter value={category} onChange={setCategory} />
        <TutorialGrid tutorials={visible} />
      </main>
      <Footer />
      <Outlet />
    </>
  );
}
