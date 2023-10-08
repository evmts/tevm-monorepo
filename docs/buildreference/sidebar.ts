export const buildReferenceSidebar = {
  text: '🚧 Build reference',
  collapsed: true,
  items: [
    { text: '🚧 Overview', link: '/buildreference/overview.md' },
    { text: '🚧 Config reference', link: '/buildreference/config.md' },
    {
      text: '🚧 TypeScript Plugin',
      link: '/buildreference/typescript.md',
    },
    {
      text: '🚧 Bundlers',
      items: [
        { text: '🚧 Vite', link: '/buildreference/bundlers/vite.md' },
        { text: '🚧 Webpack', link: '/buildreference/bundlers/webpack.md' },
        {
          text: '🚧 Bun reference',
          link: '/buildreference/bundlers/bun.md',
        },
        { text: '🚧 ESBuild', link: '/buildreference/bundlers/esbuild.md' },
        { text: '🚧 Rollup', link: '/buildreference/bundlers/rollup.md' },
        {
          text: '🚧 Other build systems',
          link: '/buildreference/other',
        },
      ],
    },
    { text: '🚧 Babel', link: '/buildreference/babel.md' },
  ],
} as const
