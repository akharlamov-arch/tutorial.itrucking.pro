import logoDark from '@/assets/logos/logo-dark.png';
import logoLight from '@/assets/logos/logo-light.png';
import { InstallButton } from '@/components/InstallButton/InstallButton';
import { site } from '@/config/site';
import { LANGS } from '@/content/schema';
import { useI18n } from '@/i18n/context';
import { useTheme } from '@/theme/context';
import styles from './Header.module.css';

export function Header() {
  const { lang, setLang, t } = useI18n();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <a href={site.portalUrl} className={styles.logo} target="_blank" rel="noopener noreferrer">
          <img src={logoLight} alt="iTrucking" className={styles.logoLight} />
          <img src={logoDark} alt="iTrucking" className={styles.logoDark} />
        </a>
        <div className={styles.controls}>
          <div className={styles.langSwitcher} role="group" aria-label={t.language}>
            {LANGS.map((code) => (
              <button
                key={code}
                type="button"
                className={
                  code === lang ? `${styles.langButton} ${styles.active}` : styles.langButton
                }
                aria-pressed={code === lang}
                onClick={() => setLang(code)}
              >
                {code.toUpperCase()}
              </button>
            ))}
          </div>
          <InstallButton />
          <button
            type="button"
            className={styles.iconButton}
            onClick={toggleTheme}
            aria-label={t.toggleTheme}
            title={t.toggleTheme}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
        </div>
      </div>
    </header>
  );
}
