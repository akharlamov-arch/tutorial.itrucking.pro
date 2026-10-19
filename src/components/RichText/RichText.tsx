import type { ReactNode } from 'react';
import Markdown, { defaultUrlTransform, type Components } from 'react-markdown';
import { Link } from 'react-router';
import remarkBreaks from 'remark-breaks';
import { useTutorialLink } from '@/app/navigation';
import styles from './RichText.module.css';

const TUTORIAL_LINK_PREFIX = 'tutorial:';

// Разрешаем только то, что нужно туториалам: абзацы, жирный, курсив, ссылки, переносы строк.
const ALLOWED_ELEMENTS = ['p', 'strong', 'em', 'a', 'br'];

function urlTransform(url: string): string {
  return url.startsWith(TUTORIAL_LINK_PREFIX) ? url : defaultUrlTransform(url);
}

const components: Components = {
  a: ({ href = '', children }) =>
    href.startsWith(TUTORIAL_LINK_PREFIX) ? (
      <TutorialLink slug={href.slice(TUTORIAL_LINK_PREFIX.length)}>{children}</TutorialLink>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className={styles.link}>
        {children}
      </a>
    ),
};

function TutorialLink({ slug, children }: { slug: string; children: ReactNode }) {
  return (
    <Link {...useTutorialLink(slug)} className={styles.link}>
      {children}
    </Link>
  );
}

interface RichTextProps {
  text: string;
  className?: string;
}

/** Текст туториала с коротким Markdown (см. описание Block в content/schema.ts). */
export function RichText({ text, className }: RichTextProps) {
  return (
    <div className={[styles.richText, className].filter(Boolean).join(' ')}>
      <Markdown
        remarkPlugins={[remarkBreaks]}
        allowedElements={ALLOWED_ELEMENTS}
        unwrapDisallowed
        skipHtml
        urlTransform={urlTransform}
        components={components}
      >
        {text}
      </Markdown>
    </div>
  );
}
