export const themeStorageKey = 'suduxu-theme';

export type ThemeName = 'light' | 'dark';

export function normalizeTheme(theme: string | null | undefined): ThemeName | null {
  return theme === 'light' || theme === 'dark' ? theme : null;
}

export function getThemeCookieValue(theme: ThemeName) {
  return `${themeStorageKey}=${encodeURIComponent(theme)}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function getThemeCookieValueForHost(theme: ThemeName, hostname: string) {
  const cookie = getThemeCookieValue(theme);
  if (hostname === 'suduxu.com' || hostname.endsWith('.suduxu.com')) {
    return `${cookie}; Domain=.suduxu.com`;
  }

  return cookie;
}