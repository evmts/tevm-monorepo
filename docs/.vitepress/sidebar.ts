import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Sidebar = [
	{ text: 'Home', link: '/' },
	{
		text: 'Getting Started',
		items: [
			{ text: 'Why Evmts', link: '/getting-started/why' },
			{ text: 'Introduction', link: '/getting-started/introduction' },
			{ text: 'Quick Start', link: '/getting-started/quick-start' },
		],
	},
	{
		text: 'Tutorial',
		items: [
			{ text: 'Overview', link: '/tutorial/overview' },
			{ text: 'Setup', link: '/tutorial/setup' },
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
			{ text: 'Overview', link: '/wagmi/overview' },
			{ text: 'useContractRead', link: '/wagmi/use-contract-read' },
			{ text: 'useContractWrite', link: '/wagmi/use-contract-write' },
		],
	},
	{
		text: 'Viem Usage',
		items: [
			{ text: 'Overview', link: '/viem/overview' },
			// 			{ text: 'call', link: '/viem/call' },
			// 			{ text: 'sendTransaction', link: '/viem/send-transaction' },
			// 			{ text: 'createEventFilter', link: '/viem/create-event-filter' },
		],
	},
	{
		text: 'Ethers.js Usage',
		items: [{ text: 'Overview', link: '/ethers/overview' }],
	},
	{
		text: 'web3.js Usage',
		items: [{ text: 'Overview', link: '/web3js/overview' }],
	},
	{
		text: 'Bundler Configuration',
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
				text: 'Bun',
				link: '/configuration/bun',
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
		text: 'TypeScript Configuration',
		items: [
			{
				text: 'TypeScript',
				link: '/guides/typescript',
			},
			{
				text: 'VSCode',
				link: '/guides/vscode',
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
