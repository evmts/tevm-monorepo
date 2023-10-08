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
				text: '🚧 Actions reference',
				collapsed: true,
				items: [
					{
						text: '🚧 Contract actions',
						collapsed: true,
						items: [
							{
								text: '🚧 Contract writes',
								link: '/reference/actions/state/snapshot'
							},
							{
								text: '🚧 Contract reads',
								link: '/reference/actions/state/snapshot'
							},
							{
								text: '🚧 Events',
								link: '/reference/actions/state/createfork'
							},
							{
								text: '🚧 Storage',
								link: '/reference/actions/state/selectfork'
							},
						]
					},
					{
						text: '🚧 JsonRpc Actions', items: [
							{
								text: '🚧 Gossip methods',
								items: [
									{
										text: '🚧 eth_blockNumber',
										link: '/reference/actions/jsonrpc/gossip/blocknumber'
									},
									{
										text: '🚧 eth_sendRawTransaction',
										link: '/reference/actions/jsonrpc/gossip/sendrawtransaction'
									}
								]
							},
							{
								text: '🚧 State methods',
								items: [
									{
										text: '🚧 eth_getBalance',
										link: '/reference/actions/jsonrpc/state/getbalance'
									},
									{
										text: '🚧 eth_getStorageAt',
										link: '/reference/actions/jsonrpc/state/getstorageat'
									},
									{
										text: '🚧 eth_getTransactionCount',
										link: '/reference/actions/jsonrpc/state/gettransactioncount'
									},
									{
										text: '🚧 eth_getCode',
										link: '/reference/actions/jsonrpc/state/getcode'
									},
									{
										text: '🚧 eth_call',
										link: '/reference/actions/jsonrpc/state/call'
									},
									{
										text: '🚧 eth_estimateGas',
										link: '/reference/actions/jsonrpc/state/estimategas'
									},
								]
							},
							{
								text: '🚧 History methods',
								items: [
									{
										text: '🚧 eth_getBlockTransactionCountByHash',
										link: '/reference/actions/jsonrpc/history/getblocktransactioncountbyhash'
									},
									{
										text: '🚧 eth_getBlockTransactionCountByNumber',
										link: '/reference/actions/jsonrpc/history/eth_getBlockTransactionCountByNumber'
									},
									{
										text: '🚧 eth_getUncleCountByBlockHash',
										link: '/reference/actions/jsonrpc/history/eth_getUncleCountByBlockHash'
									},
									{
										text: '🚧 eth_getUncleCountByBlockNumber',
										link: '/reference/actions/jsonrpc/history/eth_getUncleCountByBlockNumber'
									},
									{
										text: '🚧 eth_getBlockByHash',
										link: '/reference/actions/jsonrpc/history/eth_getBlockByHash'
									},
									{
										text: '🚧 eth_getBlockByNumber',
										link: '/reference/actions/jsonrpc/history/eth_getBlockByNumber'
									},
									{
										text: '🚧 eth_getTransactionByHash',
										link: '/reference/actions/jsonrpc/history/eth_getTransactionByHash'
									},
									{
										text: '🚧 eth_getTransactionByBlockHashAndIndex',
										link: '/reference/actions/jsonrpc/history/eth_getTransactionByBlockHashAndIndex'
									},
									{
										text: '🚧 eth_getTransactionByBlockNumberAndIndex',
										link: '/reference/actions/jsonrpc/history/eth_getTransactionByBlockNumberAndIndex'
									},
									{
										text: '🚧 eth_getTransactionReceipt',
										link: '/reference/actions/jsonrpc/history/eth_getTransactionReceipt'
									},
									{
										text: '🚧 eth_getUncleByBlockHashAndIndex',
										link: '/reference/actions/jsonrpc/history/eth_getUncleByBlockHashAndIndex'
									},
									{
										text: '🚧 eth_getUncleByBlockNumberAndIndex',
										link: '/reference/actions/jsonrpc/history/eth_getUncleByBlockNumberAndIndex'
									}
								]
							},
							{
								text: '🚧 Client API methods',
								items: [
									{
										text: '🚧 web3_clientVersion',
										link: '/reference/actions/jsonrpc/client/web3_clientVersion'
									},
									{
										text: '🚧 web3_sha3',
										link: '/reference/actions/jsonrpc/client/web3_sha3'
									},
									{
										text: '🚧 net_version',
										link: '/reference/actions/jsonrpc/client/net_version'
									},
									{
										text: '🚧 net_listening',
										link: '/reference/actions/jsonrpc/client/net_listening'
									},
									{
										text: '🚧 net_peerCount',
										link: '/reference/actions/jsonrpc/client/net_peerCount'
									},
									{
										text: '🚧 eth_protocolVersion',
										link: '/reference/actions/jsonrpc/client/eth_protocolVersion'
									},
									{
										text: '🚧 eth_syncing',
										link: '/reference/actions/jsonrpc/client/eth_syncing'
									},
									{
										text: '🚧 eth_coinbase',
										link: '/reference/actions/jsonrpc/client/eth_coinbase'
									},
									{
										text: '🚧 eth_chainId',
										link: '/reference/actions/jsonrpc/client/eth_chainId'
									},
									{
										text: '🚧 eth_mining',
										link: '/reference/actions/jsonrpc/client/eth_mining'
									},
									{
										text: '🚧 eth_hashrate',
										link: '/reference/actions/jsonrpc/client/eth_hashrate'
									},
									{
										text: '🚧 eth_gasPrice',
										link: '/reference/actions/jsonrpc/client/eth_gasPrice'
									},
									{
										text: '🚧 eth_accounts',
										link: '/reference/actions/jsonrpc/client/eth_accounts'
									},
								]
							},
							{
								text: '🚧 debug',
								items: [
									{
										text: '🚧 debug_getBadBlocks',
										link: '/reference/actions/jsonrpc/debug/debug_getBadBlocks'
									},
									{
										text: '🚧 debug_getRawBlocks',
										link: '/reference/actions/jsonrpc/debug/debug_getRawBlocks'
									},
									{
										text: '🚧 debug_getRawHeader',
										link: '/reference/actions/jsonrpc/debug/debug_getRawHeader'
									}
								]
							},
							{
								text: '🚧 eth_getBalance',
								link: '/reference/actions/jsonrpc/getbalance'
							},
						]
					},
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
					{
						text: '🚧 Scripting', items: [
							{
								text: '🚧 Snapshot',
								link: '/reference/actions/state/snapshot'
							},
							{
								text: '🚧 Create Fork',
								link: '/reference/actions/state/createfork'
							},
							{
								text: '🚧 Select Fork',
								link: '/reference/actions/state/selectfork'
							},
							{
								text: '🚧 Warp',
								link: '/reference/actions/vm/warp'
							},
							{
								text: '🚧 Roll',
								link: '/reference/actions/vm/roll'
							},
							{
								text: '🚧 Fee',
								link: '/reference/actions/vm/fee'
							},
							{
								text: '🚧 Difficulty',
								link: '/reference/actions/vm/difficulty'
							},
							{
								text: '🚧 Store',
								link: '/reference/actions/vm/store'
							},
							{
								text: '🚧 Deal',
								link: '/reference/actions/vm/deal'
							},
							{
								text: '🚧 Start prank',
								link: '/reference/actions/vm/startPrank'
							},
							{
								text: '🚧 Stop prank',
								link: '/reference/actions/vm/Stop prank'
							},
							{
								text: '🚧 Read callers',
								link: '/reference/actions/vm/readcallers'
							},
							{
								text: '🚧 Record',
								link: '/reference/actions/vm/record'
							},
							{
								text: '🚧 Accesses',
								link: '/reference/actions/vm/accesses'
							},
							{
								text: '🚧 Record logs',
								link: '/reference/actions/vm/recordlogs'
							},
							{
								text: '🚧 Set nonce',
								link: '/reference/actions/vm/setnonce'
							},
							{
								text: '🚧 Get nonce',
								link: '/reference/actions/vm/getnonce'
							},
							{
								text: '🚧 Mock call',
								link: '/reference/actions/vm/mockcall'
							},
							{
								text: '🚧 Mock call revert',
								link: '/reference/actions/vm/mockcallrevert'
							},
							{
								text: '🚧 Clear mocked calls',
								link: '/reference/actions/vm/clearmockedcalls'
							},
							{
								text: '🚧 Coinbase',
								link: '/reference/actions/vm/coinbase'
							},
							{
								text: '🚧 Start broadcast',
								link: '/reference/actions/vm/startbroadcast'
							},
							{
								text: '🚧 Stop broadcast',
								link: '/reference/actions/vm/stopbroadcast'
							},
							{
								text: '🚧 Pause gas metering',
								link: '/reference/actions/vm/pausegasmetering'
							},
							{
								text: '🚧 Resume gas metering',
								link: '/reference/actions/vm/resumegasmetering'
							},
							{
								text: '🚧 Tx gas price',
								link: '/reference/actions/vm/txgasprice'
							},
						]
					},
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
