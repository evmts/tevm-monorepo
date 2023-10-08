import type { DefaultTheme } from 'vitepress'


const home = { text: 'Home', link: '/' }

const learnSidebar: DefaultTheme.Sidebar = [
	home,
	{
		text: '🚧 Learn EVMts',
		items: [
			{
				text: '🚧 Getting Started',
				items: [
					{ text: '🚧 Quick start', link: '/learn/gettingstarted/quickstart' },
					{ text: '🚧 Why EVMts', link: '/learn/gettingstarted/why' },
					{
						text: '🚧 Tutorial: balanceOf',
						link: '/learn/tutorials/balanceof',
					},
					{
						text: '🚧 Tutorial: optimistic counter',
						link: '/learn/tutorials/optimisticcounter',
					},
				],
			},
			{
				text: '🚧 Installation',
				items: [
					{
						text: '🚧 Start a new EVMts project',
						link: '/learn/installation/newproject',
					},
					{
						text: '🚧 Add EVMts to an existing project',
						link: '/learn/installation/existingproject',
					},
					{ text: '🚧 Editor setup', link: '/learn/installation/editor' },
					{ text: '🚧 Bundler setup', link: '/learn/installation/bundler' },
					{ text: '🚧 Developer tool', link: '/learn/installation/developertool' },
				],
			},
			{
				text: '🚧 Everything is an Action',
				collapsed: true,
				items: [
					{ text: '🚧 Actions', link: '/learn/conceptual/actions' },
					{ text: '🚧 ActionCreators', link: '/learn/conceptual/actioncreators' },
					{ text: '🚧 ActionHandlers', link: '/learn/conceptual/actionhandlers' },
					{ text: '🚧 ActionListeners', link: '/learn/conceptual/actionlisteners' },
				],
			},
			{
				text: '🚧 Working with EVMts',
				collapsed: true,
				items: [
					{
						text: '🚧 Working with Listeners',
						link: '/learn/guides/listeners',
					},
					{
						text: '🚧 Optimistic updates',
						link: '/learn/guides/optimisticupdates',
					},
					{
						text: '🚧 Solidity scripting',
						link: '/learn/guides/scripting',
					},
					{ text: '🚧 Debugging', link: '/learn/guides/debugging' },
					{ text: '🚧 Testing', link: '/learn/guides/testing' },
				],
			},
		],
	}
]

const apiReferenceSidebar: DefaultTheme.Sidebar = [
	home,
	{
		text: '🚧 API Reference',
		items: [
			{
				text: '🚧 Core types',
				collapsed: true,
				items: [
					{ text: '🚧 Action', link: '/reference/coretypes/action' },
					{ text: '🚧 ActionCreator', link: '/reference/coretypes/actioncreator' },
					{ text: '🚧 ActionHandler', link: '/reference/coretypes/actionhandler' },
					{
						text: '🚧 ActionListener',
						link: '/reference/coretypes/actionlistener',
					},
					{ text: '🚧 AddressBook', link: '/reference/coretypes/addressbook' },
					{ text: '🚧 Chains', link: '/reference/coretypes/chains' },
					{
						text: '🚧 JsonRpc and JsonWs',
						link: '/reference/coretypes/jsonrpc',
					},
					{ text: '🚧 Wallet', link: '/reference/coretypes/wallet' },
					{ text: '🚧 Vm', link: '/reference/coretypes/vm' },
					{ text: '🚧 BlockExplorer', link: '/reference/coretypes/blockexplorer' },
				],
			},
			{
				text: '🚧 Contract actions',
				collapsed: true,
				items: [
					{
						text: '🚧 State cheat codes', items: [
							{
								text: '🚧 Snapshot',
								link: '/reference/contractactions/state/snapshot'
							},
							{
								text: '🚧 Snapshot',
								link: '/reference/contractactions/state/snapshot'
							},
							{
								text: '🚧 Create Fork',
								link: '/reference/contractactions/state/createfork'
							},
							{
								text: '🚧 Select Fork',
								link: '/reference/contractactions/state/selectfork'
							},
						]
					},
					{
						text: '🚧 VM Actions', items: [
							{
								text: '🚧 Warp',
								link: '/reference/contractactions/vm/warp'
							},
							{
								text: '🚧 Roll',
								link: '/reference/contractactions/vm/roll'
							},
							{
								text: '🚧 Fee',
								link: '/reference/contractactions/vm/fee'
							},
							{
								text: '🚧 Difficulty',
								link: '/reference/contractactions/vm/difficulty'
							},
							{
								text: '🚧 Store',
								link: '/reference/contractactions/vm/store'
							},
							{
								text: '🚧 Deal',
								link: '/reference/contractactions/vm/deal'
							},
							{
								text: '🚧 Start prank',
								link: '/reference/contractactions/vm/startPrank'
							},
							{
								text: '🚧 Stop prank',
								link: '/reference/contractactions/vm/Stop prank'
							},
							{
								text: '🚧 Read callers',
								link: '/reference/contractactions/vm/readcallers'
							},
							{
								text: '🚧 Record',
								link: '/reference/contractactions/vm/record'
							},
							{
								text: '🚧 Accesses',
								link: '/reference/contractactions/vm/accesses'
							},
							{
								text: '🚧 Record logs',
								link: '/reference/contractactions/vm/recordlogs'
							},
							{
								text: '🚧 Set nonce',
								link: '/reference/contractactions/vm/setnonce'
							},
							{
								text: '🚧 Get nonce',
								link: '/reference/contractactions/vm/getnonce'
							},
							{
								text: '🚧 Mock call',
								link: '/reference/contractactions/vm/mockcall'
							},
							{
								text: '🚧 Mock call revert',
								link: '/reference/contractactions/vm/mockcallrevert'
							},
							{
								text: '🚧 Clear mocked calls',
								link: '/reference/contractactions/vm/clearmockedcalls'
							},
							{
								text: '🚧 Coinbase',
								link: '/reference/contractactions/vm/coinbase'
							},
							{
								text: '🚧 Start broadcast',
								link: '/reference/contractactions/vm/startbroadcast'
							},
							{
								text: '🚧 Stop broadcast',
								link: '/reference/contractactions/vm/stopbroadcast'
							},
							{
								text: '🚧 Pause gas metering',
								link: '/reference/contractactions/vm/pausegasmetering'
							},
							{
								text: '🚧 Resume gas metering',
								link: '/reference/contractactions/vm/resumegasmetering'
							},
							{
								text: '🚧 Tx gas price',
								link: '/reference/contractactions/vm/txgasprice'
							},
						]
					},
					{ text: '🚧 JsonRpc Actions', items: [] },
					{ text: '🚧 WalletRpc Actions', items: [] },
					{
						text: '🚧 Encoding/Decoding Actions',
						items: []
					},
					{
						text: '🚧 Multicall3 Actions',
						items: []
					},
					{
						text: '🚧 Batching Actions',
						items: []
					},
					{
						text: '🚧 OP Stack Actions',
						items: []
					},
					{
						text: '🚧 Smart-contract wallet Actions',
						items: []
					},
					{ text: '🚧 Ens Actions', items: [] },
				],
			},
			{
				text: '🚧 Build reference',
				collapsed: true,
				items: [
					{ text: '🚧 Config reference', link: '/reference/section/name' },
					{
						text: '🚧 TypeScript Plugin',
						link: '/reference/section/name',
					},
					{
						text: '🚧 Bundlers',
						items: [
							{ text: '🚧 Webpack', link: '/reference/section/name' },
							{ text: '🚧 Vite', link: '/reference/section/name' },
							{ text: '🚧 Rollup', link: '/reference/section/name' },
							{ text: '🚧 ESBuild', link: '/reference/section/name' },
							{ text: '🚧 Babel', link: '/reference/section/name' },
							{
								text: '🚧 Other build systems',
								link: '/reference/section/name',
							},
						],
					},
				],
			},
			{
				text: '🚧 CLI Reference',
				collapsed: true,
				items: [
					{ text: '🚧 Create', link: '/reference/section/name' },
					{ text: '🚧 Initialize', link: '/reference/section/name' },
					{ text: '🚧 Generate', link: '/reference/section/name' },
				],
			},
			{
				text: '🚧 Usage with other Ethereum libraries',
				collapsed: true,
				items: [
					{ text: '🚧 Ethers', link: '/reference/section/name' },
					{ text: '🚧 Viem', link: '/reference/section/name' },
					{ text: '🚧 Hardhat', link: '/reference/section/name' },
					{ text: '🚧 Foundry', link: '/reference/section/name' },
					{ text: '🚧 MUD', link: '/reference/section/name' },
				],
			},
			{
				text: '🚧 Advanced',
				collapsed: true,
				items: [
					{
						text: '🚧 Building your own custom Actions',
						link: '/reference/section/name',
					},
					{
						text: '🚧 Contributing to EVMts',
						link: '/reference/section/name',
					},
				],
			},
		],
	},
]

export const sidebar: DefaultTheme.Sidebar = {
	'/learn/': learnSidebar,
	'/api/': apiReferenceSidebar,
}
