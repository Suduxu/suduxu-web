import type { Metadata } from 'next';
import { appName, siteUrl } from '@/lib/shared';

export const siteMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${appName} — Turn any phone into a controller for your app`,
    template: `%s · ${appName}`,
  },
  description:
    'Suduxu streams real-time input and feedback between phones and your app over the local network. Rust backend, KMP client, TCP + UDP, open source.',
  openGraph: {
    type: 'website',
    siteName: appName,
    url: siteUrl,
    title: `${appName} — Turn any phone into a controller for your app`,
    description:
      'Stream real-time input and feedback between phones and your app over the local network. No extra hardware, no app store.',
  },
  twitter: { card: 'summary_large_image' },
};
