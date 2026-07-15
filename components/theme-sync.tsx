'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { getThemeCookieValue, normalizeTheme } from '@/lib/theme';

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

    document.cookie = getThemeCookieValue(normalizedTheme);
  }, [theme]);

  return null;
}