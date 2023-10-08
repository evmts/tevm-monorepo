import type { DefaultTheme } from 'vitepress'
import { homeSidebar, linkToLearnSidebar } from '../common'

export const learnSidebar: DefaultTheme.Sidebar = [
  homeSidebar,
  {
    text: '🚧 Learn EVMts',
    items: [
      {
        text: '🚧 Getting Started',
        items: [
          { text: '🚧 Quick start', link: '/learn/gettingstarted/quickstart' },
          { text: '🚧 Why EVMts', link: '/learn/gettingstarted/why' },
          {
            text: '🚧 Tutorial: balanceOf',
            link: '/learn/tutorials/balanceof',
          },
          {
            text: '🚧 Tutorial: optimistic counter',
            link: '/learn/tutorials/optimisticcounter',
          },
        ],
      },
      {
        text: '🚧 Installation',
        items: [
          {
            text: '🚧 Start a new EVMts project',
            link: '/learn/installation/newproject',
          },
          {
            text: '🚧 Add EVMts to an existing project',
            link: '/learn/installation/existingproject',
          },
          { text: '🚧 Editor setup', link: '/learn/installation/editor' },
          { text: '🚧 Bundler setup', link: '/learn/installation/bundler' },
          { text: '🚧 Developer tool', link: '/learn/installation/developertool' },
        ],
      },
      {
        text: '🚧 Everything is an Action',
        collapsed: true,
        items: [
          { text: '🚧 Actions', link: '/learn/conceptual/actions' },
          { text: '🚧 ActionCreators', link: '/learn/conceptual/actioncreators' },
          { text: '🚧 ActionHandlers', link: '/learn/conceptual/actionhandlers' },
          { text: '🚧 ActionListeners', link: '/learn/conceptual/actionlisteners' },
        ],
      },
      {
        text: '🚧 Working with EVMts',
        collapsed: true,
        items: [
          {
            text: '🚧 Working with Listeners',
            link: '/learn/guides/listeners',
          },
          {
            text: '🚧 Optimistic updates',
            link: '/learn/guides/optimisticupdates',
          },
          {
            text: '🚧 Solidity scripting',
            link: '/learn/guides/scripting',
          },
          { text: '🚧 Debugging', link: '/learn/guides/debugging' },
          { text: '🚧 Testing', link: '/learn/guides/testing' },
        ],
      },
    ],
  },
  linkToLearnSidebar
]

