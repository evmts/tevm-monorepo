import type { DefaultTheme } from 'vitepress'

export const sidebar: DefaultTheme.Sidebar = [
	{ text: 'Home', link: '/' },
	{
		text: '🚧 Learn EVMts',
		items: [
			{
				text: '🚧 Getting Started', items: [
					{ text: '🚧 Quick start', link: '/learn/gettingstarted/quickstart' },
					{ text: '🚧 Why EVMts', link: '/learn/gettingstarted/thinking' },
					{ text: '🚧 Tutorial: balanceOf', link: '/learn/gettingstarted/tutorial1' },
					{ text: '🚧 Tutorial: optimistic counter', link: '/learn/gettingstarted/tutorial2' },
				]
			},
			{
				text: '🚧 Installation', items: [
					{ text: '🚧 Start a new EVMts project', link: '/learn/installation/starting' },
					{ text: '🚧 Add EVMts to an existing project', link: '/learn/installation/existing' },
					{ text: '🚧 Editor setup', link: '/learn/installation/editor' },
					{ text: '🚧 Bundler setup', link: '/learn/installation/bundler' },
					{ text: '🚧 Developer tool', link: '/learn/installation/developer' },
				]
			},
			{
				text: '🚧 Everything is an Action', items: [
					{ text: '🚧 Actions', link: '/learn/installation/starting' },
					{ text: '🚧 ActionCreators', link: '/learn/installation/existing' },
					{ text: '🚧 ActionHandler', link: '/learn/installation/editor' },
					{ text: '🚧 ActionListener', link: '/learn/installation/bundler' },
				]
			},
			{
				text: '🚧 Working with EVMts', items: [
					{ text: '🚧 Working with Listeners', link: '/learn/installation/starting' },
					{ text: '🚧 Optimistic updates', link: '/learn/installation/starting' },
					{ text: '🚧 Solidity scripting', link: '/learn/installation/existing' },
					{ text: '🚧 Debugging', link: '/learn/installation/editor' },
					{ text: '🚧 Testing', link: '/learn/installation/bundler' },
				]
			},
		],
	},
	{
		text: '🚧 API Reference',
		items: [
			{
				text: '🚧 Core types', items: [
					{ text: '🚧 Action', link: '/learn/gettingstarted/quickstart' },
					{ text: '🚧 ActionCreator', link: '/learn/gettingstarted/thinking' },
					{ text: '🚧 ActionHandler', link: '/learn/gettingstarted/tutorial1' },
					{ text: '🚧 ActionListener', link: '/learn/gettingstarted/tutorial2' },
					{ text: '🚧 AddressBook', link: '/learn/gettingstarted/tutorial2' },
					{ text: '🚧 JsonRpc and JsonWs', link: '/learn/gettingstarted/tutorial2' },
					{ text: '🚧 Wallet', link: '/learn/gettingstarted/tutorial2' },
					{ text: '🚧 Vm', link: '/learn/gettingstarted/tutorial2' },
					{ text: '🚧 BlockExplorer', link: '/learn/gettingstarted/tutorial2' },
				]
			},
			{
				text: '🚧 Contract actions', items: [
					{ text: '🚧 VM Actions', link: '/learn/installation/starting' },
					{ text: '🚧 JsonRpc Actions', link: '/learn/installation/existing' },
					{ text: '🚧 WalletRpc Actions', link: '/learn/installation/editor' },
					{ text: '🚧 Encoding/Decoding Actions', link: '/learn/installation/bundler' },
					{ text: '🚧 Multicall3 Actions', link: '/learn/installation/developer' },
					{ text: '🚧 Batching Actions', link: '/learn/installation/developer' },
					{ text: '🚧 OP Stack Actions', link: '/learn/installation/developer' },
					{ text: '🚧 Smart-contract wallet Actions', link: '/learn/installation/developer' },
					{ text: '🚧 Ens Actions', link: '/learn/installation/developer' },
				]
			},
			{
				text: '🚧 Build reference', items: [
					{ text: '🚧 Config reference', link: '/learn/installation/starting' },
					{ text: '🚧 TypeScript Plugin', link: '/learn/installation/existing' },
					{
						text: '🚧 Bundlers',
						items: [
							{ text: '🚧 Webpack', link: '/learn/installation/starting' },
							{ text: '🚧 Vite', link: '/learn/installation/starting' },
							{ text: '🚧 Rollup', link: '/learn/installation/starting' },
							{ text: '🚧 ESBuild', link: '/learn/installation/starting' },
							{ text: '🚧 Babel', link: '/learn/installation/starting' },
							{ text: '🚧 Other build systems', link: '/learn/installation/starting' },
						]
					},
				]
			},
			{
				text: '🚧 CLI Reference', items: [
					{ text: '🚧 Create', link: '/learn/installation/starting' },
					{ text: '🚧 Initialize', link: '/learn/installation/starting' },
					{ text: '🚧 Generate', link: '/learn/installation/existing' },
				]
			},
			{
				text: '🚧 Usage with other Ethereum libraries', items: [
					{ text: '🚧 Ethers', link: '/learn/installation/starting' },
					{ text: '🚧 Viem', link: '/learn/installation/starting' },
					{ text: '🚧 Hardhat', link: '/learn/installation/starting' },
					{ text: '🚧 Foundry', link: '/learn/installation/starting' },
					{ text: '🚧 MUD', link: '/learn/installation/starting' },
				]
			},
			{
				text: '🚧 Advanced', items: [
					{ text: '🚧 Building your own custom Actions', link: '/learn/installation/starting' },
					{ text: '🚧 Contributing to EVMts', link: '/learn/installation/starting' },
				]
			},
		],
	},
]
