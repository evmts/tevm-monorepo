import type { DefaultTheme } from 'vitepress'
import { learnSidebar } from './learn/sidebar'
import { apiReferenceSidebar } from './reference/sidebar'
import { homeSidebar } from './home/sidebar'



export const sidebar: DefaultTheme.Sidebar = {
	'/learn/': [homeSidebar, learnSidebar],
	'/api/': [homeSidebar, apiReferenceSidebar],
}
