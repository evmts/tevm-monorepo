export const buildReferenceSidebar = {
  text: '🚧 Build reference',
  collapsed: true,
  items: [
    { text: '🚧 Config reference', link: '/reference/section/name' },
    {
      text: '🚧 TypeScript Plugin',
      link: '/reference/section/name',
    },
    {
      text: '🚧 Bundlers',
      items: [
        { text: '🚧 Webpack', link: '/reference/section/name' },
        { text: '🚧 Vite', link: '/reference/section/name' },
        { text: '🚧 Rollup', link: '/reference/section/name' },
        { text: '🚧 ESBuild', link: '/reference/section/name' },
        { text: '🚧 Babel', link: '/reference/section/name' },
        {
          text: '🚧 Other build systems',
          link: '/reference/section/name',
        },
      ],
    },
  ],
} as const
