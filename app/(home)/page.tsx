import React from 'react';
import Link from 'next/link';
import { HoverSpot, VirtualControllerProvider } from './components/virtual-controller-demo';
import { HeroInteractiveDemo } from './components/hero-demo';
import { parseLinks } from './components/parse-links';
import { docsUrl } from '@/lib/shared';

const PAGE_DATA = {
  hero: {
    eyebrowInfo: "Works on Mac, Windows, Linux & Mobile",
    eyebrowText: "Phones Reinvented",
    title: "Build customizable controllers within minutes",
    description: "Suduxu is a development tool that allows software creators to turn any smartphone into a responsive, custom game controller or companion screen.",
    buttons: [
      { label: "Get started", href: docsUrl, variant: "primary" as const, external: false },
      { label: "View on GitHub", href: "https://github.com/Suduxu/Suduxu-Hub", variant: "ghost" as const, external: true }
    ],
    cliInfo: "Less than 15 seconds to get started",
    cliCommand: "$ suduxu server start",
    featuresText: " ·  10-200fps input  ·  MIT"
  },
  techStack: [
    "RUST BACKEND",
    "KMP CLIENT",
    "TCP + UDP",
    "CROSS-PLATFORM"
  ],
  whatItIs: {
    eyebrow: "What it is",
    title: "Pay less reach more.",
    description: "Suduxu lives inside your application's process. There's nothing to deploy, host, or keep online — it starts when your app starts.",
    pillars: [
      {
        title: "Embeddable",
        desc: "Add the Rust crate or the Unity package to your project. Suduxu runs in-process — no external service to stand up or maintain."
      },
      {
        title: "Configurable",
        desc: "Ports, authentication, sensors, rate limits, client caps — every server behavior lives in one suduxu.json file you can change without touching code. For a guided interface, use the built-in [configurator](/configurator)."
      },
      {
        title: "Extensible",
        desc: "Write your own controller layouts in HTML or XML, define new themes per client, or wire in sensors and inputs the event system has never seen before."
      }
    ]
  },
  reviews: {
    eyebrow: "Don't trust us",
    title: "What users say.",
    description: "Suduxu is already powering local multiplayer and companion apps for creators around the world. Here is what they think.",
    cards: [
      {
        initial: "M",
        colorClass: "bg-brand/20 text-brand",
        handle: "@marcus_rühl",
        role: "Indie Developer",
        quote: "Turned my old Google Pixel into a steering wheel for my racing game in 10 minutes. Incredible tool."
      },
      {
        initial: "E",
        colorClass: "bg-blue-500/20 text-blue-500",
        handle: "@elena_huston",
        role: "Software Engineer",
        quote: "The latency is literally unnoticeable. It feels like magic to have a custom controller just pop up on my phone."
      },
      {
        initial: "T",
        colorClass: "bg-purple-500/20 text-purple-500",
        handle: "@thomas_leitner",
        role: "Game Director",
        quote: "Finally, a way to add local multiplayer without making people buy expensive controllers. The Rust backend is rock solid."
      }
    ]
  },
  changelog: {
    title: "Constantly Evolving",
    description: "We push updates regularly to ensure Suduxu remains the most capable virtual controller tool available. Check out what is new.",
    button: { label: "View Changelog", href: "/changelog", variant: "primary" as const }
  }
};

function Btn({
  href, children, variant = 'primary', external, className
}: {
  href: string; children: React.ReactNode; variant?: 'primary' | 'ghost'; external?: boolean; className?: string;
}) {
  const base =
    'inline-flex items-center gap-2 font-mono text-[13px] px-[18px] py-[11px] rounded-md border transition-colors whitespace-nowrap';
  const styles =
    variant === 'primary'
      ? 'bg-brand border-brand font-semibold text-[color:var(--brand-fg)] hover:bg-brand-hover hover:border-brand-hover'
      : 'bg-transparent border-fd-border text-fd-foreground hover:border-fd-muted-foreground';
  return (
    <Link href={href} {...(external ? { target: '_blank', rel: 'noopener' } : {})} className={`${base} ${styles} ${className || ''}`}>
      {children}
    </Link>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <span className="font-mono text-xs tracking-[0.12em] uppercase text-brand-text">{children}</span>;
}

export default function HomePage() {
  return (
    <VirtualControllerProvider>
      <main className="w-full relative overflow-x-hidden">
        <section className="border-b border-fd-border relative overflow-hidden">
          <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-brand/15 blur-[100px] animate-[pulse_6s_ease-in-out_infinite] pointer-events-none" />
          <div className="absolute top-[20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-blue-500/15 blur-[120px] animate-[pulse_8s_ease-in-out_infinite_delay-2s] pointer-events-none" />
          
          <div className="max-w-[1140px] mx-auto px-8 pt-24 pb-20 grid md:grid-cols-2 gap-14 items-center relative z-10">
            <div>
              <HoverSpot block>
                <div className="mb-5 inline-block">
                  <HoverSpot infoText={PAGE_DATA.hero.eyebrowInfo}>
                    <Eyebrow>{PAGE_DATA.hero.eyebrowText}</Eyebrow>
                  </HoverSpot>
                </div>
              </HoverSpot>
              
              <HoverSpot block>
                <h1 className="font-display font-semibold text-[clamp(2.4rem,5vw,3.1rem)] leading-[1.08] tracking-[-0.01em] mb-5">
                  {PAGE_DATA.hero.title}
                </h1>
              </HoverSpot>
              
              <HoverSpot block>
                <p className="text-fd-muted-foreground text-[17px] max-w-[460px] mb-8">
                  {PAGE_DATA.hero.description}
                </p>
              </HoverSpot>

              <HoverSpot block>
                <div className="flex gap-3 mb-9">
                  {PAGE_DATA.hero.buttons.map((btn, i) => (
                    <HoverSpot key={i}>
                      <Btn href={btn.href} variant={btn.variant} external={btn.external} className={btn.variant === 'primary' ? 'text-white' : ''}>
                        {btn.label}
                      </Btn>
                    </HoverSpot>
                  ))}
                </div>
              </HoverSpot>

              <HoverSpot block>
                <div className="font-mono text-xs text-fd-muted-foreground/70 flex items-center gap-2">
                  <HoverSpot infoText={PAGE_DATA.hero.cliInfo}>
                    <span className="cursor-default bg-fd-muted px-2 py-1 rounded">{PAGE_DATA.hero.cliCommand}</span>
                  </HoverSpot>
                  <HoverSpot>
                    <span>{PAGE_DATA.hero.featuresText}</span>
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
          <div className="border-b border-fd-border py-5 bg-fd-background">
            <div className="max-w-[1140px] mx-auto px-8 text-center font-mono text-[12.5px] tracking-[0.04em] text-fd-muted-foreground/60">
              {PAGE_DATA.techStack.map((tech, i) => (
                <React.Fragment key={tech}>
                  <HoverSpot><span className="text-fd-muted-foreground">{tech}</span></HoverSpot>
                  {i < PAGE_DATA.techStack.length - 1 && ' · '}
                </React.Fragment>
              ))}
            </div>
          </div>
        </HoverSpot>

        <section className="border-b border-fd-border py-24 bg-fd-background">
          <div className="max-w-[1140px] mx-auto px-8">
            <div className="max-w-[560px] mb-12">
              <HoverSpot block>
                <div className="mb-3.5"><Eyebrow>{PAGE_DATA.whatItIs.eyebrow}</Eyebrow></div>
              </HoverSpot>
              <HoverSpot block>
                <h2 className="font-display font-semibold text-[32px] tracking-[-0.01em] mb-3.5">
                  {PAGE_DATA.whatItIs.title}
                </h2>
              </HoverSpot>
              <HoverSpot block>
                <p className="text-fd-muted-foreground">
                  {PAGE_DATA.whatItIs.description}
                </p>
              </HoverSpot>
            </div>
            
            <HoverSpot block>
              <div className="grid md:grid-cols-3 gap-px bg-fd-border border border-fd-border rounded-lg overflow-hidden">
                {PAGE_DATA.whatItIs.pillars.map((pillar) => (
                  <div key={pillar.title} className="bg-fd-background p-8">
                    <HoverSpot infoText={`Explore ${pillar.title} architecture`} block>
                      <div className="p-2 -m-2">
                        <h3 className="font-display font-semibold text-lg mb-2.5 inline-block cursor-default">{pillar.title}</h3>
                        <p className="text-fd-muted-foreground text-[14.5px] mt-2">{parseLinks(pillar.desc)}</p>
                      </div>
                    </HoverSpot>
                  </div>
                ))}
              </div>
            </HoverSpot>
          </div>
        </section>

        <section className="border-b border-fd-border py-24 bg-fd-muted/10">
          <div className="max-w-[1140px] mx-auto px-8">
            <div className="max-w-[560px] mb-12">
              <HoverSpot block>
                <div className="mb-3.5"><Eyebrow>{PAGE_DATA.reviews.eyebrow}</Eyebrow></div>
              </HoverSpot>
              <HoverSpot block>
                <h2 className="font-display font-semibold text-[32px] tracking-[-0.01em] mb-3.5">
                  {PAGE_DATA.reviews.title}
                </h2>
              </HoverSpot>
              <HoverSpot block>
                <p className="text-fd-muted-foreground">
                  {PAGE_DATA.reviews.description}
                </p>
              </HoverSpot>
            </div>
            
            <HoverSpot block>
              <div className="grid md:grid-cols-3 gap-6">
                {PAGE_DATA.reviews.cards.map((card, i) => (
                  <div key={i} className="bg-fd-background border border-fd-border rounded-xl p-6 relative overflow-hidden transition-colors hover:bg-fd-muted/20">
                    <HoverSpot infoText="Read full review" block>
                      <div className="relative z-10 p-1 -m-1">
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${card.colorClass}`}>
                            {card.initial}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{card.handle}</div>
                            <div className="text-xs text-fd-muted-foreground">{card.role}</div>
                          </div>
                        </div>
                        <p className="text-fd-muted-foreground text-[14.5px] leading-relaxed">
                          &quot;{card.quote}&quot;
                        </p>
                      </div>
                    </HoverSpot>
                  </div>
                ))}
              </div>
            </HoverSpot>
          </div>
        </section>

        <section className="border-b border-fd-border py-24 bg-fd-muted/30 relative overflow-hidden">
          <div className="absolute bottom-[-30%] left-[25%] w-[50vw] h-[50vw] rounded-full bg-brand/15 blur-[120px] animate-[pulse_7s_ease-in-out_infinite] pointer-events-none" />
          
          <div className="max-w-[1140px] mx-auto px-8 text-center relative z-10">
            <HoverSpot block>
              <h2 className="font-display font-semibold text-[32px] tracking-[-0.01em] mb-4">
                {PAGE_DATA.changelog.title}
              </h2>
            </HoverSpot>
            <HoverSpot block>
              <p className="text-fd-muted-foreground text-[17px] max-w-[460px] mx-auto mb-8">
                {PAGE_DATA.changelog.description}
              </p>
            </HoverSpot>
            <HoverSpot>
              <Btn href={PAGE_DATA.changelog.button.href} variant={PAGE_DATA.changelog.button.variant} className="text-white">
                {PAGE_DATA.changelog.button.label}
              </Btn>
            </HoverSpot>
          </div>
        </section>
      </main>
    </VirtualControllerProvider>
  );
}