import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Sidebar = [
	{ text: 'Home', link: '/' },
	{
		text: 'Tutorial',
		items: [
			{ text: 'Why EVMts', link: '/tutorial/why' },
			{ text: 'Introduction', link: '/tutorial/introduction' },
			{ text: 'Installation', link: '/tutorial/installation' },
			{
				text: 'Configuration',
				link: '/tutorial/configuration',
			},
			{
				text: 'Hello World',
				link: '/tutorial/hello-world',
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
