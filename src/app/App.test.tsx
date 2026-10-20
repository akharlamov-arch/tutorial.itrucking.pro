import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router';
import { describe, expect, it } from 'vitest';
import { TutorialGrid } from '@/components/TutorialGrid/TutorialGrid';
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
const onrampSetup = getTutorial('onramp-account-setup')!;
const appSetup = getTutorial('onramp-app-setup')!;

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

  it('фильтрует по категории', async () => {
    const user = userEvent.setup();
    renderAt('/');

    await user.click(screen.getByRole('button', { name: /Программа скидок на\sшины/ }));
    expect(
      screen.queryByRole('heading', { level: 3, name: ifta.title.ru }),
    ).not.toBeInTheDocument();
    expect(screen.getAllByRole('heading', { level: 3 }).length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: /OnRamp Fleet Dashboard/ }));
    expect(
      screen.getByRole('heading', {
        level: 3,
        name: onrampSetup.title.ru,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { level: 3, name: appSetup.title.ru }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /OnRamp Mobile App/ }));
    expect(screen.getByRole('heading', { level: 3, name: appSetup.title.ru })).toBeInTheDocument();
  });

  it('показывает дополнительный бейдж туториала на карточке и в шапке', () => {
    renderAt('/tutorials/onramp-payment-history');
    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('Только предоплата')).toBeInTheDocument();
    expect(screen.getAllByText('Только предоплата').length).toBeGreaterThan(1);
  });

  it('не показывает поиск', () => {
    renderAt('/');
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });

  it('показывает пустое состояние, если в категории нет туториалов', () => {
    render(
      <AppProviders>
        <MemoryRouter>
          <TutorialGrid tutorials={[]} />
        </MemoryRouter>
      </AppProviders>,
    );
    expect(screen.getByText('Здесь пока нет туториалов')).toBeInTheDocument();
  });
});
