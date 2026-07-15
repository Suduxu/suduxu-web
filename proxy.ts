import { NextRequest, NextResponse } from 'next/server';
import { isMarkdownPreferred, rewritePath } from 'fumadocs-core/negotiation';
import { docsContentRoute, docsRoute } from '@/lib/shared';

const { rewrite: rewriteDocs } = rewritePath(
  `${docsRoute}{/*path}`,
  `${docsContentRoute}{/*path}/content.md`,
);
const { rewrite: rewriteSuffix } = rewritePath(
  `${docsRoute}{/*path}.md`,
  `${docsContentRoute}{/*path}/content.md`,
);

const DOCS_HOST = 'docs.suduxu.com';

export default function proxy(request: NextRequest) {
  const host = request.headers.get('host') || '';
  const isDocsHost = host === DOCS_HOST || host.startsWith(`${DOCS_HOST}:`);
  const pathname = request.nextUrl.pathname;

  const effectivePathname = isDocsHost
    ? pathname === '/'
      ? docsRoute
      : `${docsRoute}${pathname}`
    : pathname;

  const suffixResult = rewriteSuffix(effectivePathname);
  if (suffixResult) {
    return NextResponse.rewrite(new URL(suffixResult, request.nextUrl));
  }

  if (isMarkdownPreferred(request)) {
    const docsResult = rewriteDocs(effectivePathname);
    if (docsResult) {
      return NextResponse.rewrite(new URL(docsResult, request.nextUrl));
    }
  }

  if (isDocsHost) {
    return NextResponse.rewrite(new URL(effectivePathname, request.nextUrl));
  }

  return NextResponse.next();
}