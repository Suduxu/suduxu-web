import { source } from '@/lib/source';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { baseOptions } from '@/lib/layout.shared';
import { docsUrl } from '@/lib/shared';

export const metadata = {
  metadataBase: new URL(docsUrl),
};

export default function Layout({ children }: LayoutProps<'/docs'>) {
  return (
    <DocsLayout tree={source.getPageTree()} {...baseOptions({ docsHost: true })}>
      {children}
    </DocsLayout>
  );
}
