import type { DefaultTheme } from 'vitepress'
import { learnSidebar } from '../learn/sidebar'
import { apiReferenceSidebar } from '../reference/sidebar'



export const sidebar: DefaultTheme.Sidebar = {
	'/learn/': learnSidebar,
	'/api/': apiReferenceSidebar,
}
