import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Sidebar = [
	{ text: 'Home', link: '/' },
	{
		text: 'Tutorial',
		items: [
			{ text: 'Why EVMts', link: '/introduction/why' },
			{ text: 'Get started', link: '/introduction/get-started' },
			{ text: 'Installation', link: '/introduction/installation' },
			{
				text: 'Configuration',
				link: '/introduction/configuration',
			},
			{
				text: 'Hello World',
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
		text: 'Bundler Configuration',
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
