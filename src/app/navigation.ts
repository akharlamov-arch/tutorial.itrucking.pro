import { useCallback } from 'react';
import { useLocation, useNavigate, type To } from 'react-router';

/** Сколько окон туториалов открыто поверх списка в текущей истории браузера. */
interface ModalHistoryState {
  modalDepth: number;
}

function getModalDepth(state: unknown): number {
  if (typeof state === 'object' && state !== null && 'modalDepth' in state) {
    const depth = (state as ModalHistoryState).modalDepth;
    return typeof depth === 'number' ? depth : 0;
  }
  return 0;
}

export function tutorialPath(slug: string): string {
  return `/tutorials/${slug}`;
}

/** Пропсы для <Link>, открывающего туториал поверх списка (фильтр категории сохраняется). */
export function useTutorialLink(slug: string): { to: To; state: ModalHistoryState } {
  const location = useLocation();
  return {
    to: { pathname: tutorialPath(slug), search: location.search },
    state: { modalDepth: getModalDepth(location.state) + 1 },
  };
}

/**
 * Закрывает окно туториала. Если туториалы открывались со списка — возвращаемся назад по истории,
 * чтобы кнопка «Назад» после закрытия не открывала их снова. Если ссылку открыли напрямую — идём на главную.
 */
export function useCloseTutorial(): () => void {
  const navigate = useNavigate();
  const location = useLocation();
  return useCallback(() => {
    const depth = getModalDepth(location.state);
    if (depth > 0) void navigate(-depth);
    else void navigate({ pathname: '/', search: location.search });
  }, [navigate, location.state, location.search]);
}
