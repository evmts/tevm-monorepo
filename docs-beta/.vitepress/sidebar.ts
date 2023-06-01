import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Sidebar = [
	{ text: 'Home', link: '/' },
	{
		text: 'Introduction',
		items: [
			{ text: 'Get started', link: '/introduction/get-started' },
			{ text: 'Installation', link: '/introduction/installation' },
			{
				text: 'configuration',
				link: '/introduction/configuration',
			},
		],
	},
	{
		text: 'EVMts React',
		items: [
			{ text: 'useContractRead', link: '/reference/use-contract-read' },
			{ text: 'useContractWrite', link: '/reference/use-contract-write' },
		],
	},
	{
		text: 'Configuration',
		items: [
			{
				text: 'NEXT.js',
				collapsed: true,
				items: [],
			},
			{
				text: 'Vite/Vitest',
				collapsed: true,
				items: [],
			},
			{
				text: 'ESBuild',
				collapsed: true,
				items: [],
			},
			{
				text: 'Webpack',
				collapsed: true,
				items: [],
			},
		],
	},
]
