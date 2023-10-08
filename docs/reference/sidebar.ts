import type { DefaultTheme } from 'vitepress'
import { homeSidebar } from '../common'
import { actionsReferenceSidebar } from './actions/sidebar'
import { coreTypesReferenceSidebar } from './coretypes/sidebar'
import { jsonRpcReferenceSidebar } from './jsonrpc/sidebar'

export const apiReferenceSidebar: DefaultTheme.Sidebar = [
  homeSidebar,
  {
    text: '🚧 API Reference',
    items: [
      coreTypesReferenceSidebar,
      actionsReferenceSidebar,
      jsonRpcReferenceSidebar,
      buildReferenceSidebar,
      cliReferenceSidebar,
      otherUsagesSidebar,
      advancedSidebar
    ],
  },
]
