import type { MetadataRoute } from 'next';
import { source } from '@/lib/source';
import { docsUrl, siteUrl } from '@/lib/shared';

export default function sitemap(): MetadataRoute.Sitemap {
  const docs = source.getPages().map((page) => ({
    url: `${docsUrl}${page.url}`,
    lastModified: new Date(),
  }));
  return [{ url: siteUrl, lastModified: new Date() }, ...docs];
}
