import type { DefaultTheme } from 'vitepress'
import { installationSidebar } from './installation/sidebar'
import { conceptualSidebar } from './conceptual/sidebar'
import { guidesSidebar } from './guides/sidebar'
import { gettingStartedSidebar } from './gettingstarted/sidebar'
import { tutorialsSidebar } from './tutorials/sidebar'

export const onboarding = {
  text: '🚧 Getting Started',
  items: [
    ...gettingStartedSidebar,
    ...tutorialsSidebar,
  ],
} as const

export const learnSidebar: DefaultTheme.Sidebar = [
  {
    text: '🚧 Learn EVMts',
    items: [
      onboarding,
      installationSidebar,
      conceptualSidebar,
      guidesSidebar
    ],
  },
]

