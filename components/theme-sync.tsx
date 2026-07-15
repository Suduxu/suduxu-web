'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { getThemeCookieValueForHost, normalizeTheme } from '@/lib/theme';

export function ThemeSync() {
  const { theme } = useTheme();

  useEffect(() => {
    if (!theme) {
      return;
    }

    const normalizedTheme = normalizeTheme(theme);
    if (!normalizedTheme) {
      return;
    }

    document.cookie = getThemeCookieValueForHost(normalizedTheme, window.location.hostname);
  }, [theme]);

  return null;
}