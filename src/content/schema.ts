import type { CategoryId } from './categories';

export const LANGS = ['ru', 'en'] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = 'ru';

/** Значение на каждом языке сайта. */
export type Localized<T = string> = Record<Lang, T>;

/** Одно значение для всех языков или своё для каждого (например, картинка со скриншотом на русском и английском). */
export type LocalizedOrShared<T> = T | Localized<T>;

/**
 * Вид выделенного блока:
 * - solution — «Как это избежать:»
 * - tip — «Совет:» (зелёный)
 * - note — «Примечание:» (синий)
 * - hint — подсказка с 💡 (жёлтая), обычно внутри шага
 * - warning — оранжевая плашка без заголовка
 * - info — серая плашка без заголовка, может содержать картинку
 * - conclusion — «Заключение»
 */
export type CalloutVariant =
  'solution' | 'tip' | 'note' | 'hint' | 'warning' | 'info' | 'conclusion';

/**
 * Текст в полях `text` поддерживает короткий Markdown:
 * **жирный**, [ссылка](https://...), [другой туториал](tutorial:slug), перенос строки.
 */
export type Block =
  | { type: 'text'; text: Localized }
  | { type: 'image'; src: LocalizedOrShared<string>; alt?: Localized }
  | { type: 'list'; title?: Localized; items: Localized[] }
  | { type: 'callout'; variant: CalloutVariant; text: Localized; image?: string }
  | { type: 'appDownload' }
  | StepsBlock;

export interface StepsBlock {
  type: 'steps';
  /** Заголовок над шагами. Для основных шагов по умолчанию — «Пошаговая инструкция». */
  title?: Localized;
  /** secondary — дополнительный раздел (фиолетовая нумерация), не входит в счётчик шагов. */
  variant?: 'primary' | 'secondary';
  items: Step[];
}

export type StepContentBlock = Exclude<Block, StepsBlock>;

export interface Step {
  title: Localized;
  blocks: StepContentBlock[];
}

export interface TutorialInput {
  category: CategoryId;
  /** Порядок в списке: меньше — выше. */
  order: number;
  title: Localized;
  description: Localized;
  /** Обложка: на карточке и вверху туториала. */
  cover?: LocalizedOrShared<string>;
  /** Эмодзи на карточке, если нет обложки. */
  icon?: string;
  /** Время чтения в минутах. Если не указано — считается по количеству слов. */
  readTime?: number;
  /** Slug'и туториалов для блока «Рекомендуемые материалы». Если не указано — подбираются автоматически. */
  related?: string[];
  /** Не предлагать этот туториал в рекомендациях к другим. */
  hideFromRecommendations?: boolean;
  body: Block[];
}

export interface Tutorial extends TutorialInput {
  /** Имя папки туториала, используется в адресе /tutorials/<slug>. */
  slug: string;
  readTime: number;
  stepsCount: number;
}

/** Обёртка для файла туториала: даёт автодополнение и проверку типов. */
export function defineTutorial(tutorial: TutorialInput): TutorialInput {
  return tutorial;
}
