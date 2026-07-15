import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig, siteUrl } from './shared';

export function baseOptions(options: { docsHost?: boolean } = {}): BaseLayoutProps {
  const { docsHost = false } = options;

  return {
    nav: {
      // JSX supported
      title: appName,
    },
    links: [
      {
        type: 'main',
        text: 'Configurator',
        url: docsHost ? `${siteUrl}/configurator` : '/configurator',
      },
      {
        type: 'main',
        text: 'Suduxu Hub',
        url: 'https://github.com/Suduxu/Suduxu-Hub',
        external: true,
      },
    ],
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}
