import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Sidebar = [
	{ text: 'Home', link: '/' },
	{
		text: 'Introduction',
		items: [
			{ text: 'Why EVMts', link: '/introduction/why-evmts' },
			{ text: 'Get started', link: '/introduction/get-started' },
			{ text: 'Installation', link: '/introduction/installation' },
			{
				text: 'configuration',
				link: '/introduction/configuration',
			},
			{
				text: 'hello-world',
				link: '/introduction/hello-world',
			},
		],
	},
	{
		text: 'Wagmi Usage',
		items: [
			{ text: 'useContractRead', link: '/wagmi/use-contract-read' },
			{ text: 'useContractWrite', link: '/wagmi/use-contract-write' },
		],
	},
	{
		text: 'Configuration',
		collapsed: true,
		items: [
			{
				text: 'ESBuild',
				link: '/guides/esbuild',
			},
			{
				text: 'NEXT.js',
				link: '/guides/next',
			},
			{
				text: 'Rollup',
				link: '/guides/rollup',
			},
			{
				text: 'Rspack',
				link: '/guides/rspack',
			},
			{
				text: 'Vite',
				link: '/guides/Vite',
			},
			{
				text: 'Webpack',
				link: '/guides/Webpack',
			},
		],
	},
	{
		text: 'Reference',
		collapsed: true,
		items: [
			{
				text: 'CLI',
				link: '/reference/cli',
			},
			{
				text: 'Config',
				link: '/reference/config',
			},
		],
	},
]
