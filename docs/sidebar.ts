import type { DefaultTheme } from 'vitepress'
import { learnSidebar } from './learn/sidebar'
import { apiReferenceSidebar } from './reference/sidebar'
import { homeSidebar } from './home/sidebar'
import { buildReferenceSidebar } from './buildreference/sidebar'



export const sidebar: DefaultTheme.Sidebar = {
	'/learn/': [homeSidebar, learnSidebar],
	'/reference/': [homeSidebar, apiReferenceSidebar],
	'/buildreference/': [homeSidebar, buildReferenceSidebar],
	'/advanced/': [homeSidebar, buildReferenceSidebar],
}
