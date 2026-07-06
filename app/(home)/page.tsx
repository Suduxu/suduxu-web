import Link from 'next/link';

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
    <main className="w-full">
      {/* ---------- HERO ---------- */}
      <section className="border-b border-fd-border">
        <div className="max-w-[1140px] mx-auto px-8 pt-24 pb-20 grid md:grid-cols-2 gap-14 items-center">
          <div>
            <div className="mb-5"><Eyebrow>Open source · Local network · Cross-platform</Eyebrow></div>
            <h1 className="font-display font-semibold text-[clamp(2.4rem,5vw,3.1rem)] leading-[1.08] tracking-[-0.01em] mb-5">
              Turn any phone into a controller for your app.
            </h1>
            <p className="text-fd-muted-foreground text-[17px] max-w-[460px] mb-8">
              Suduxu streams real-time input and feedback between phones and your application over the
              local network — joysticks, buttons, sensors, custom UI. No extra hardware, no app store,
              no server to host.
            </p>
            <div className="flex gap-3 mb-9">
              <Btn href="/docs">Get started</Btn>
              <Btn href="https://github.com/Suduxu/Suduxu-Rust" variant="ghost" external>View on GitHub</Btn>
            </div>
            <div className="font-mono text-xs text-fd-muted-foreground/70">
              $ cargo add suduxu &nbsp;·&nbsp; 10–200fps input &nbsp;·&nbsp; MIT
            </div>
          </div>

          {/* PLACEHOLDER: port the phone + terminal demo from your HTML here */}
          <div className="hidden md:flex items-center justify-center">
            <div className="w-full rounded-lg border border-fd-border bg-fd-muted p-10 text-center">
              <div className="font-mono text-xs text-fd-muted-foreground/60">
                [ hero demo — phone + event stream ]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CREDIBILITY STRIP ---------- */}
      <div className="border-b border-fd-border py-5">
        <div className="max-w-[1140px] mx-auto px-8 text-center font-mono text-[12.5px] tracking-[0.04em] text-fd-muted-foreground/60">
          <span className="text-fd-muted-foreground">RUST BACKEND</span> ·{' '}
          <span className="text-fd-muted-foreground">KMP CLIENT</span> ·{' '}
          <span className="text-fd-muted-foreground">TCP + UDP</span> ·{' '}
          <span className="text-fd-muted-foreground">CROSS-PLATFORM</span> ·{' '}
          <span className="text-fd-muted-foreground">OPEN SOURCE</span>
        </div>
      </div>

      {/* ---------- PILLARS ---------- */}
      <section className="border-b border-fd-border py-24">
        <div className="max-w-[1140px] mx-auto px-8">
          <div className="max-w-[560px] mb-12">
            <div className="mb-3.5"><Eyebrow>What it is</Eyebrow></div>
            <h2 className="font-display font-semibold text-[32px] tracking-[-0.01em] mb-3.5">
              A runtime, not a service.
            </h2>
            <p className="text-fd-muted-foreground">
              Suduxu lives inside your application&apos;s process. There&apos;s nothing to deploy, host, or
              keep online — it starts when your app starts.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-px bg-fd-border border border-fd-border rounded-lg overflow-hidden">
            {PILLARS.map(([title, desc]) => (
              <div key={title} className="bg-fd-background p-8">
                <h3 className="font-display font-semibold text-lg mb-2.5">{title}</h3>
                <p className="text-fd-muted-foreground text-[14.5px]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLACEHOLDER: port Architecture / Use cases / Features / Quick start
          sections from your HTML, following the same pattern:
          max-w-[1140px] wrapper, border-fd-border dividers, font-display headings,
          text-fd-muted-foreground body, bg-brand accents. */}
    </main>
  );
}
