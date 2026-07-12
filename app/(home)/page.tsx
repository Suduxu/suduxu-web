import Link from 'next/link';
import { HoverSpot, VirtualControllerProvider } from './components/virtual-controller-demo';
import { HeroInteractiveDemo } from './components/hero-demo';

function Btn({
  href, children, variant = 'primary', external,
}: {
  href: string; children: React.ReactNode; variant?: 'primary' | 'ghost'; external?: boolean;
}) {
  const base =
    'inline-flex items-center gap-2 font-mono text-[13px] px-[18px] py-[11px] rounded-md border transition-colors whitespace-nowrap';
  const styles =
    variant === 'primary'
      ? 'bg-brand border-brand font-semibold text-[color:var(--brand-fg)] hover:bg-brand-hover hover:border-brand-hover'
      : 'bg-transparent border-fd-border text-fd-foreground hover:border-fd-muted-foreground';
  return (
    <Link href={href} {...(external ? { target: '_blank', rel: 'noopener' } : {})} className={`${base} ${styles}`}>
      {children}
    </Link>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-xs tracking-[0.12em] uppercase text-brand-text">{children}</span>;
}

const PILLARS: [string, string][] = [
  ['Embeddable', 'Add the Rust crate or the Unity package to your project. Suduxu runs in-process — no external service to stand up or maintain.'],
  ['Configurable', 'Ports, authentication, sensors, rate limits, client caps — every server behavior lives in one suduxu.json file you can change without touching code.'],
  ['Extensible', 'Write your own controller layouts in HTML or XML, define new themes per client, or wire in sensors and inputs the event system has never seen before.'],
];

export default function HomePage() {
  return (
    <VirtualControllerProvider>
      <main className="w-full relative overflow-x-hidden">
        <section className="border-b border-fd-border">
          <div className="max-w-[1140px] mx-auto px-8 pt-24 pb-20 grid md:grid-cols-2 gap-14 items-center">
            <div>
              <HoverSpot block>
                <div className="mb-5 inline-block">
                  <HoverSpot infoText="Works on Mac, Windows, Linux & Mobile">
                    <Eyebrow>Fast · Local network · Cross-platform</Eyebrow>
                  </HoverSpot>
                </div>
              </HoverSpot>
              
              <HoverSpot block>
                <h1 className="font-display font-semibold text-[clamp(2.4rem,5vw,3.1rem)] leading-[1.08] tracking-[-0.01em] mb-5">
                  Phones reinvented, build customizable controllers within minutes
                </h1>
              </HoverSpot>
              
              <HoverSpot block>
                <p className="text-fd-muted-foreground text-[17px] max-w-[460px] mb-8">
                  Suduxu is a development tool that allows software creators to turn any smartphone into a responsive, custom game controller or companion screen.
                </p>
              </HoverSpot>

              <HoverSpot block>
                <div className="flex gap-3 mb-9">
                  <HoverSpot><Btn href="/docs">Get started</Btn></HoverSpot>
                  <HoverSpot><Btn href="https://github.com/Suduxu/Suduxu-Hub" variant="ghost" external>View on GitHub</Btn></HoverSpot>
                </div>
              </HoverSpot>

              <HoverSpot block>
                <div className="font-mono text-xs text-fd-muted-foreground/70 flex items-center gap-2">
                  <HoverSpot infoText="Install via Cargo in 2 seconds">
                    <span className="cursor-default bg-fd-muted px-2 py-1 rounded">$ cargo add suduxu</span>
                  </HoverSpot>
                  <HoverSpot>
                    <span>&nbsp;·&nbsp; 10–200fps input &nbsp;·&nbsp; MIT</span>
                  </HoverSpot>
                </div>
              </HoverSpot>
            </div>

            <HoverSpot block>
              <div className="hidden md:flex items-center justify-center w-full">
                <HeroInteractiveDemo maxEvents={10} tickRate={100} />
              </div>
            </HoverSpot>
          </div>
        </section>

        <HoverSpot block>
          <div className="border-b border-fd-border py-5">
            <div className="max-w-[1140px] mx-auto px-8 text-center font-mono text-[12.5px] tracking-[0.04em] text-fd-muted-foreground/60">
              <HoverSpot><span className="text-fd-muted-foreground">RUST BACKEND</span></HoverSpot> ·{' '}
              <HoverSpot><span className="text-fd-muted-foreground">KMP CLIENT</span></HoverSpot> ·{' '}
              <HoverSpot><span className="text-fd-muted-foreground">TCP + UDP</span></HoverSpot> ·{' '}
              <HoverSpot><span className="text-fd-muted-foreground">CROSS-PLATFORM</span></HoverSpot>
            </div>
          </div>
        </HoverSpot>

        <section className="border-b border-fd-border py-24">
          <div className="max-w-[1140px] mx-auto px-8">
            <div className="max-w-[560px] mb-12">
              <HoverSpot block>
                <div className="mb-3.5"><Eyebrow>What it is</Eyebrow></div>
              </HoverSpot>
              <HoverSpot block>
                <h2 className="font-display font-semibold text-[32px] tracking-[-0.01em] mb-3.5">
                  Pay less reach more.
                </h2>
              </HoverSpot>
              <HoverSpot block>
                <p className="text-fd-muted-foreground">
                  Suduxu lives inside your application&apos;s process. There&apos;s nothing to deploy, host, or
                  keep online — it starts when your app starts.
                </p>
              </HoverSpot>
            </div>
            
            <HoverSpot block>
              <div className="grid md:grid-cols-3 gap-px bg-fd-border border border-fd-border rounded-lg overflow-hidden">
                {PILLARS.map(([title, desc]) => (
                  <div key={title} className="bg-fd-background p-8">
                    <HoverSpot infoText={`Explore ${title} architecture`} block>
                      <div className="p-2 -m-2">
                        <h3 className="font-display font-semibold text-lg mb-2.5 inline-block cursor-default">{title}</h3>
                        <p className="text-fd-muted-foreground text-[14.5px] mt-2">{desc}</p>
                      </div>
                    </HoverSpot>
                  </div>
                ))}
              </div>
            </HoverSpot>
          </div>
        </section>
      </main>
    </VirtualControllerProvider>
  );
}