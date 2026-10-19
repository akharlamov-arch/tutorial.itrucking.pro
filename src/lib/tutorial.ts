import type { Block, Localized, Tutorial, TutorialInput } from '@/content/schema';

const WORDS_PER_MINUTE = 180;

/** Количество основных шагов (дополнительные разделы variant: 'secondary' не считаются). */
export function countSteps(body: Block[]): number {
  return body
    .filter((block) => block.type === 'steps' && block.variant !== 'secondary')
    .reduce((sum, block) => sum + (block.type === 'steps' ? block.items.length : 0), 0);
}

/** Все локализованные тексты туториала — для оценки времени чтения и проверок контента. */
export function collectTexts(tutorial: Pick<TutorialInput, 'title' | 'description' | 'body'>) {
  const texts: Localized[] = [tutorial.title, tutorial.description];
  const visit = (blocks: Block[]) => {
    for (const block of blocks) {
      switch (block.type) {
        case 'text':
        case 'callout':
          texts.push(block.text);
          break;
        case 'list':
          if (block.title) texts.push(block.title);
          texts.push(...block.items);
          break;
        case 'steps':
          if (block.title) texts.push(block.title);
          for (const step of block.items) {
            texts.push(step.title);
            visit(step.blocks);
          }
          break;
        case 'image':
          if (block.alt) texts.push(block.alt);
          break;
        case 'appDownload':
          break;
      }
    }
  };
  visit(tutorial.body);
  return texts;
}

export function estimateReadTime(input: TutorialInput): number {
  const words = collectTexts(input)
    .map((text) => text.ru.split(/\s+/).filter(Boolean).length)
    .reduce((a, b) => a + b, 0);
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function buildTutorial(slug: string, input: TutorialInput): Tutorial {
  return {
    ...input,
    slug,
    stepsCount: countSteps(input.body),
    readTime: input.readTime ?? estimateReadTime(input),
  };
}
