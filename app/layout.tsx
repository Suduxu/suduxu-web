import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Space_Grotesk, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';
import { cookies } from 'next/headers';
import Script from 'next/script';
import { ThemeSync } from '@/components/theme-sync';
import { normalizeTheme, themeStorageKey } from '@/lib/theme';

const display = Space_Grotesk({
  subsets: ['latin'], variable: '--font-space-grotesk', weight: ['500', '600', '700'],
});
const sans = IBM_Plex_Sans({
  subsets: ['latin'], variable: '--font-ibm-plex-sans', weight: ['400', '500', '600'],
});
const mono = JetBrains_Mono({
  subsets: ['latin'], variable: '--font-jetbrains-mono', weight: ['400', '500', '600'],
});

export default async function Layout({ children }: LayoutProps<'/'>) {
  const cookieStore = await cookies();
  const initialTheme = normalizeTheme(cookieStore.get(themeStorageKey)?.value) ?? 'light';

  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen w-screen font-sans">
        <Script id="theme-bootstrap" strategy="beforeInteractive">
          {`(() => {
            try {
              const cookieMatch = document.cookie.match(new RegExp('(?:^|; )${themeStorageKey}=([^;]*)'));
              const cookieTheme = cookieMatch ? decodeURIComponent(cookieMatch[1]) : null;
              const theme = cookieTheme === 'dark' || cookieTheme === 'light' ? cookieTheme : null;
              if (!theme) return;
              localStorage.setItem('${themeStorageKey}', theme);
              document.documentElement.classList.toggle('dark', theme === 'dark');
            } catch (_) {}
          })();`}
        </Script>
        <RootProvider
          theme={{
            defaultTheme: initialTheme,
            storageKey: themeStorageKey,
            enableSystem: false,
          }}
        >
          <ThemeSync />
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

export { siteMetadata as metadata } from './metadata';
