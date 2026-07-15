'use client';

import { useEffect } from 'react';
import { useTheme } from 'next-themes';
import { getThemeCookieValueForHost, normalizeTheme, themeStorageKey } from '@/lib/theme';

function readThemeCookie() {
  const match = document.cookie.match(new RegExp(`(?:^|; )${themeStorageKey}=([^;]*)`));
  return normalizeTheme(match?.[1] ? decodeURIComponent(match[1]) : undefined);
}

export function ThemeSync() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const cookieTheme = readThemeCookie();
    if (cookieTheme && cookieTheme !== theme) {
      setTheme(cookieTheme);
    }
  }, [setTheme, theme]);

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