import { useI18n } from '@/i18n/context';
import styles from './Hero.module.css';

const BRAND = 'iTrucking Pro';

interface HeroProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export function Hero({ query, onQueryChange }: HeroProps) {
  const { t } = useI18n();
  const [before, after] = t.heroTitle.split('{brand}');

  return (
    <section className={styles.hero}>
      <div className={styles.heading}>
        <h1>
          {before}
          <span className={styles.brand}>{BRAND}</span>
          {after}
        </h1>
        <p>{t.heroSubtitle}</p>
      </div>
      <div className={styles.searchBox} role="search">
        <input
          type="search"
          className={styles.input}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t.searchPlaceholder}
          aria-label={t.searchPlaceholder}
        />
        {query.trim() ? (
          <button
            type="button"
            className={`${styles.icon} ${styles.clear}`}
            onClick={() => onQueryChange('')}
            aria-label={t.searchClear}
          >
            <svg
              viewBox="0 0 24 24"
              width="20"
              height="20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        ) : (
          <svg
            className={styles.icon}
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        )}
      </div>
    </section>
  );
}
