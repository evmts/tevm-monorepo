import type { DefaultTheme } from 'vitepress'
import { homeSidebar } from '../home/sidebar'

export const apiReferenceSidebar: DefaultTheme.Sidebar = [
  homeSidebar,
  {
    text: '🚧 API Reference',
    items: [
      actionsReferenceSidebar,
      jsonRpcActionsReferenceSidebar,
      advancedReferenceSidebar,
      buildReferenceSidebar,
      cliReferenceSidebar,
      creatorsReferenceSidebar,
      handlersReferenceSidebar,
      localForksReferenceSidebar,
      usageWithOtherLibrariesReferenceSidebar,
    ],
  },
]
