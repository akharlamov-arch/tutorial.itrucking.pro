import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { getTutorial } from '@/content';
import { AppProviders, AppRoutes } from './App';

function renderAt(path: string) {
  return render(
    <AppProviders>
      <MemoryRouter initialEntries={[path]}>
        <AppRoutes />
      </MemoryRouter>
    </AppProviders>,
  );
}

const ifta = getTutorial('ifta-report')!;

describe('приложение', () => {
  it('показывает список туториалов на главной', () => {
    renderAt('/');
    expect(screen.getByRole('heading', { level: 3, name: ifta.title.ru })).toBeInTheDocument();
  });

  it('открывает туториал по прямой ссылке и закрывает его', async () => {
    const user = userEvent.setup();
    renderAt('/tutorials/ifta-report');

    const dialog = screen.getByRole('dialog', { name: ifta.title.ru });
    expect(within(dialog).getByText('Пошаговая инструкция')).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Закрыть' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('открывает туториал по клику на карточку', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.click(
      screen.getByRole('link', { name: new RegExp(ifta.title.ru.replace(/[?]/g, '\\?')) }),
    );
    expect(screen.getByRole('dialog', { name: ifta.title.ru })).toBeInTheDocument();
  });

  it('неизвестный туториал ведёт на главную', () => {
    renderAt('/tutorials/no-such-tutorial');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('переключает язык', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.click(screen.getByRole('button', { name: 'EN' }));
    expect(screen.getByRole('heading', { level: 3, name: ifta.title.en })).toBeInTheDocument();
    expect(document.documentElement.lang).toBe('en');
  });

  it('ищет и фильтрует по категории', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.type(screen.getByRole('searchbox'), 'несуществующий запрос');
    expect(screen.getByText('Ничего не найдено')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Очистить поиск' }));
    await user.click(screen.getByRole('button', { name: /Программа скидок на шины/ }));
    expect(
      screen.queryByRole('heading', { level: 3, name: ifta.title.ru }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThan(0);
  });
});
