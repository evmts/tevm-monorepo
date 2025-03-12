import { defineConfig } from 'vocs'

export default defineConfig({
  title: 'Docs',
  sidebar: [
    {
      text: 'Getting Started',
      link: '/getting-started',
    },
    {
      text: 'Example',
      link: '/example',
    },
    {
      text: 'Direct Solidity Imports',
      link: '/direct-solidity-imports',
    },
    {
      text: 'Bundler Packages',
      items: [
        {
          text: 'Plugins',
          link: '/bundler-packages/plugins',
        },
        {
          text: 'Other Packages',
          link: '/bundler-packages/other-packages',
        }
      ],
    }
  ],
})
