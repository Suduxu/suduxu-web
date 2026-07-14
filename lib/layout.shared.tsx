import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { appName, gitConfig } from './shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      // JSX supported
      title: appName,
    },
    links: [
      {
        type: 'main',
        text: 'Configurator',
        url: '/configurator',
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
