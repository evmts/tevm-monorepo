import type { DefaultTheme } from 'vitepress'
import { homeSidebar } from '../home/sidebar'
import { } from './actions/sidebar'
import { } from './cli/sidebar'
import { } from './coretypes/sidebar'
import { } from './localforks/sidebar'
import { } from './react/sidebar'
import { } from './utils/sidebar'

export const apiReferenceSidebar: DefaultTheme.Sidebar = [
  homeSidebar,
  {
    text: '🚧 API Reference',
    items: [
    ],
  },
]
