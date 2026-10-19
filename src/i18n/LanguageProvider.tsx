import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_LANG, LANGS, type Lang } from '@/content/schema';
import { I18nContext } from './context';
import { messages } from './messages';

const STORAGE_KEY = 'lang';

function isLang(value: unknown): value is Lang {
  return LANGS.includes(value as Lang);
}

function readStoredLang(): Lang {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return isLang(stored) ? stored : DEFAULT_LANG;
  } catch {
    return DEFAULT_LANG;
  }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readStoredLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // Приватный режим или заблокированное хранилище — язык просто не запомнится.
    }
  }, [lang]);

  const value = useMemo(() => ({ lang, setLang, t: messages[lang] }), [lang]);
  return <I18nContext value={value}>{children}</I18nContext>;
}
