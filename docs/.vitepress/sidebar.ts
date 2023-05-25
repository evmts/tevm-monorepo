import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Sidebar = [
	{
		text: 'Introduction',
		link: '/introduction/intro',
		items: [
			{ text: 'Home', link: '/' },
			{ text: 'Why EVMts', link: '/introduction/intro' },
			{ text: 'Create EVMts app', link: '/introduction/create-evmts-app' },
			{ text: 'Quick start', link: '/introduction/quick-start' },
			{ text: 'Installation', link: '/introduction/installation' },
			{
				text: 'Plugin configuration',
				link: '/introduction/plugin-configuration',
			},
			{ text: 'Hello world', link: '/introduction/hello-world' },
		],
	},
	{
		text: 'EVMts Core',
		items: [
			{
				text: 'Clients and Transports',
				items: [
					{ text: 'PublicClient', link: '/reference/public-client' },
					{ text: 'WalletClient', link: '/reference/wallet-client' },
					{ text: 'HttpFork', link: '/reference/http-fork' },
				],
			},
			{
				text: 'Contracts and Scripts',
				items: [
					{
						text: 'Script',
						link: '/reference/script',
					},
					{ text: 'Contract', link: '/reference/contract' },
					{ text: 'HttpFork', link: '/reference/http-fork' },
				],
			},
		],
	},
	{
		text: 'EVMts Build Plugins',
		collapsed: true,
		items: [
			{ text: 'Typescript Plugin', link: '/plugin-reference/typescript' },
			{
				text: 'Rollup Plugin',
				link: '/plugin-reference/rollup',
				collapsed: true,
				items: [{ text: 'Forge', link: '/plugin-reference/forge' }],
			},
			{ text: 'Webpack', link: '/plugin-reference/webpack' },
		],
	},
	{
		text: 'Guides',
		collapsed: true,
		items: [
			{ text: 'Configuring configuring forge', link: '/guide/forge' },
			{ text: 'Writing solidity scripts', link: '/guide/scripting' },
			{ text: 'Testing scripts', link: '/guide/testing' },
		],
	},
]
