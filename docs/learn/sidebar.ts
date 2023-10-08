import type { DefaultTheme } from 'vitepress'
import { installationSidebar } from './installation/sidebar'
import { conceptualSidebar } from './conceptual/sidebar'
import { guidesSidebar } from './guides/sidebar'
import { gettingStartedSidebar } from './gettingstarted/sidebar'

export const learnSidebar: DefaultTheme.Sidebar = [
  {
    text: '🚧 Learn EVMts',
    items: [
      gettingStartedSidebar,
      installationSidebar,
      conceptualSidebar,
      guidesSidebar
    ],
  },
]

