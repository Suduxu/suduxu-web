import Link from 'next/link';
import { VirtualControllerProvider, HoverSpot } from '../components/virtual-controller-demo';
import { changelogData } from '@/lib/data/changelog';

export default function ChangelogPage() {
  return (
    <VirtualControllerProvider>
      <main className="w-full relative overflow-x-hidden min-h-screen bg-fd-background pt-24 pb-20">
        <div className="max-w-[800px] mx-auto px-8">
          <HoverSpot block>
            <div className="mb-12">
              <Link href="/" className="font-mono text-xs text-brand hover:underline mb-4 inline-block">&larr; Back to Home</Link>
              <h1 className="font-display font-semibold text-4xl mb-4">Changelog</h1>
              <p className="text-fd-muted-foreground text-lg">Keep track of the latest updates, features, and fixes.</p>
            </div>
          </HoverSpot>

          <div className="space-y-12">
            {changelogData.map((release) => (
              <HoverSpot block key={release.version}>
                <div className="border border-fd-border rounded-lg p-8 bg-fd-background shadow-sm relative overflow-hidden">
                  <div className="flex flex-wrap items-baseline gap-4 mb-6 border-b border-fd-border pb-4 relative z-10">
                    <h2 className="text-2xl font-semibold font-display">v{release.version}</h2>
                    <span className="font-mono text-xs text-fd-muted-foreground">{release.date}</span>
                    <span className="text-brand text-sm font-medium ml-auto">{release.title}</span>
                  </div>

                  {release.features && release.features.length > 0 && (
                    <div className="mb-6 relative z-10">
                      <h3 className="text-sm font-mono text-fd-foreground mb-3 uppercase tracking-wider">Features</h3>
                      <ul className="list-disc list-inside space-y-2 text-fd-muted-foreground">
                        {release.features.map((feature, i) => <li key={i}>{feature}</li>)}
                      </ul>
                    </div>
                  )}

                  {release.fixes && release.fixes.length > 0 && (
                    <div className="relative z-10">
                      <h3 className="text-sm font-mono text-fd-foreground mb-3 uppercase tracking-wider">Fixes</h3>
                      <ul className="list-disc list-inside space-y-2 text-fd-muted-foreground">
                        {release.fixes.map((fix, i) => <li key={i}>{fix}</li>)}
                      </ul>
                    </div>
                  )}
                  
                  <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none z-0"></div>
                </div>
              </HoverSpot>
            ))}
          </div>
        </div>
      </main>
    </VirtualControllerProvider>
  );
}