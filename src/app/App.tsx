import type { ReactNode } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { LightboxProvider } from '@/components/Lightbox/LightboxProvider';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { HomePage } from '@/pages/HomePage';
import { TutorialRoute } from '@/pages/TutorialRoute';
import { ThemeProvider } from '@/theme/ThemeProvider';

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <LightboxProvider>{children}</LightboxProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />}>
        <Route path="tutorials/:slug" element={<TutorialRoute />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export function App() {
  return (
    <AppProviders>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProviders>
  );
}
