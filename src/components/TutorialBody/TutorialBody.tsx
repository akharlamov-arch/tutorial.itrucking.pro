import { AppDownloadButtons } from '@/components/AppDownloadButtons/AppDownloadButtons';
import { RichText } from '@/components/RichText/RichText';
import { ZoomableImage } from '@/components/ZoomableImage/ZoomableImage';
import type { Block, CalloutVariant, StepsBlock } from '@/content/schema';
import { useI18n } from '@/i18n/context';
import type { Messages } from '@/i18n/messages';
import { localize } from '@/lib/localize';
import styles from './TutorialBody.module.css';

/** Где находится блок: от этого зависят отступы и цвета. */
type Placement = 'body' | 'step' | 'substep';

export function TutorialBody({ blocks }: { blocks: Block[] }) {
  return (
    <>
      {blocks.map((block, index) => (
        <BlockView key={index} block={block} placement="body" />
      ))}
    </>
  );
}

function BlockView({ block, placement }: { block: Block; placement: Placement }) {
  const { lang } = useI18n();

  switch (block.type) {
    case 'text':
      return <RichText text={block.text[lang]} className={styles[`text-${placement}`]} />;
    case 'image': {
      const alt = block.alt?.[lang] ?? '';
      return (
        <ZoomableImage
          src={localize(block.src, lang)}
          alt={alt}
          className={styles[`image-${placement}`]}
        />
      );
    }
    case 'list':
      return (
        <section className={styles.list}>
          {block.title && <h3>{block.title[lang]}</h3>}
          <ol>
            {block.items.map((item, index) => (
              <li key={index}>
                <RichText text={item[lang]} />
              </li>
            ))}
          </ol>
        </section>
      );
    case 'callout':
      return <Callout {...block} placement={placement} />;
    case 'appDownload':
      return <AppDownloadButtons />;
    case 'steps':
      return <Steps block={block} />;
  }
}

const CALLOUT_LABELS: Partial<Record<CalloutVariant, keyof Messages>> = {
  solution: 'calloutSolution',
  tip: 'calloutTip',
  note: 'calloutNote',
};

interface CalloutProps {
  variant: CalloutVariant;
  text: Record<'ru' | 'en', string>;
  image?: string;
  placement: Placement;
}

function Callout({ variant, text, image, placement }: CalloutProps) {
  const { lang, t } = useI18n();
  const labelKey = CALLOUT_LABELS[variant];
  const content = variant === 'hint' ? `💡 ${text[lang]}` : text[lang];

  return (
    <aside
      className={`${styles.callout} ${styles[`callout-${variant}`]} ${styles[`callout-${placement}`]}`}
    >
      {variant === 'conclusion' && <h3>{t.calloutConclusion}</h3>}
      {labelKey && <strong className={styles.calloutLabel}>{t[labelKey]}</strong>}
      <RichText text={content} />
      {image && <ZoomableImage src={image} alt="" className={styles.calloutImage} />}
    </aside>
  );
}

function Steps({ block }: { block: StepsBlock }) {
  const { lang, t } = useI18n();
  const secondary = block.variant === 'secondary';
  const title = block.title?.[lang] ?? (secondary ? undefined : t.stepsTitle);
  const placement: Placement = secondary ? 'substep' : 'step';

  return (
    <section className={secondary ? styles.substepsSection : undefined}>
      {title && <h2>{title}</h2>}
      <ol className={secondary ? styles.substeps : styles.steps}>
        {block.items.map((step, index) => (
          <li key={index} className={secondary ? styles.substep : styles.step}>
            {secondary ? (
              <h4>
                <span className={styles.substepNumber}>{index + 1}</span> {step.title[lang]}
              </h4>
            ) : (
              <h3>{step.title[lang]}</h3>
            )}
            {step.blocks.map((child, childIndex) => (
              <BlockView key={childIndex} block={child} placement={placement} />
            ))}
          </li>
        ))}
      </ol>
    </section>
  );
}
