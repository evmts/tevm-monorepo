import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Sidebar = [
	{ text: 'Home', link: '/' },
	{
		text: 'Getting Started',
		items: [
			{ text: 'Why EVMts', link: '/getting-started/why' },
			{ text: 'Introduction', link: '/getting-started/introduction' },
			{ text: 'Quick Start', link: '/getting-started/quick-start' },
		],
	},
	{
		text: 'Tutorial',
		items: [
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
		link: '/wagmi/overview',
		items: [
			{ text: 'useContractRead', link: '/wagmi/use-contract-read' },
			{ text: 'useContractWrite', link: '/wagmi/use-contract-write' },
		],
	},
	{
		text: 'Other Usage',
		collapsed: true,
		items: [
			{
				text: 'Viem usage',
				link: '/viem/overview',
			},
			{
				text: 'Ethers V6 Usage',
				link: '/ethers/overview',
			},
			{
				text: 'Web3js usage',
				link: '/web3js/overview',
			},
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
