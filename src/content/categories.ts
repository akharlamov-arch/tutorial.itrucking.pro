import itruckingProIcon from '@/assets/categories/itrucking-pro.png';
import onrampIcon from '@/assets/categories/onramp.png';
import type { Localized } from './schema';

export interface Category {
  id: string;
  name: Localized;
  /** Картинка или эмодзи перед названием. */
  icon: { image: string } | { emoji: string };
}

/** Порядок здесь = порядок кнопок фильтра на главной. */
export const categories = [
  {
    id: 'itrucking-pro',
    name: { ru: 'iTrucking Pro', en: 'iTrucking Pro' },
    icon: { image: itruckingProIcon },
  },
  {
    id: 'onramp',
    name: { ru: 'OnRamp', en: 'OnRamp' },
    icon: { image: onrampIcon },
  },
  {
    id: 'efs-cards',
    name: { ru: 'Использование карт EFS', en: 'Using EFS Cards Tutorial' },
    icon: { emoji: '💳' },
  },
  {
    id: 'tire-discount',
    name: { ru: 'Программа скидок на шины', en: 'Tire Discount Program' },
    icon: { emoji: '🚛' },
  },
] as const satisfies readonly Category[];

export type CategoryId = (typeof categories)[number]['id'];

export function getCategory(id: CategoryId): Category {
  const category = categories.find((c) => c.id === id);
  if (!category) throw new Error(`Unknown category: ${id}`);
  return category;
}

export function isCategoryId(value: string | null): value is CategoryId {
  return categories.some((c) => c.id === value);
}
