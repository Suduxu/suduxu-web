import Link from 'next/link';

const COLUMNS: { heading: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    heading: 'Resources',
    links: [
      { label: 'Docs', href: '/docs' },
      { label: 'Config reference', href: '/docs/configuration' },
      { label: 'Quick start', href: '/docs/quickstart' },
    ],
  },
  {
    heading: 'Code',
    links: [
      { label: 'Rust SDK', href: 'https://github.com/Suduxu/Suduxu-Rust', external: true },
      { label: 'Unity SDK', href: 'https://github.com/Suduxu/Suduxu-Unity', external: true },
      { label: 'License', href: '/docs' },
    ],
  },
  {
    heading: 'Project',
    links: [
      { label: 'GitHub Discussions', href: 'https://github.com/Suduxu', external: true },
      { label: 'Changelog', href: '/docs' },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-fd-border mt-auto">
      <div className="max-w-[1140px] mx-auto px-8 py-14">
        <div className="grid gap-8 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-mono text-[15px] font-semibold mb-3">
              <span className="inline-block w-[7px] h-[7px] rounded-[1px] bg-brand" />
              suduxu
            </div>
            <p className="text-fd-muted-foreground text-[13.5px] max-w-[240px]">
              An open-source runtime for turning phones into real-time controllers
              and displays for your app.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h5 className="font-mono text-[11px] tracking-[0.1em] uppercase text-fd-muted-foreground mb-4">
                {col.heading}
              </h5>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      {...(link.external ? { target: '_blank', rel: 'noopener' } : {})}
                      className="text-sm text-fd-muted-foreground hover:text-fd-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-fd-border flex flex-col md:flex-row md:justify-between gap-2 font-mono text-xs text-fd-muted-foreground">
          <span>© {new Date().getFullYear()} Suduxu — open source, local network only.</span>
          <span>Built with Rust + Kotlin Multiplatform</span>
        </div>
      </div>
    </footer>
  );
}
