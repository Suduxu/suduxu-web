import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Space_Grotesk, IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google';

const display = Space_Grotesk({
  subsets: ['latin'], variable: '--font-space-grotesk', weight: ['500', '600', '700'],
});
const sans = IBM_Plex_Sans({
  subsets: ['latin'], variable: '--font-ibm-plex-sans', weight: ['400', '500', '600'],
});
const mono = JetBrains_Mono({
  subsets: ['latin'], variable: '--font-jetbrains-mono', weight: ['400', '500', '600'],
});

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen w-screen font-sans">
        {/* defaultTheme 'light'; users can toggle. Set to 'dark' to open dark. */}
        <RootProvider theme={{ defaultTheme: 'light' }}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}

export { siteMetadata as metadata } from './metadata';
