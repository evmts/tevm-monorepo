'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.optimism = void 0
const chain_js_1 = require('../../utils/chain.js')
const formatters_js_1 = require('../optimism/formatters.js')
exports.optimism = (0, chain_js_1.defineChain)(
	{
		id: 10,
		name: 'OP Mainnet',
		network: 'optimism',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrls: {
			alchemy: {
				http: ['https://opt-mainnet.g.alchemy.com/v2'],
				webSocket: ['wss://opt-mainnet.g.alchemy.com/v2'],
			},
			infura: {
				http: ['https://optimism-mainnet.infura.io/v3'],
				webSocket: ['wss://optimism-mainnet.infura.io/ws/v3'],
			},
			default: {
				http: ['https://mainnet.optimism.io'],
			},
			public: {
				http: ['https://mainnet.optimism.io'],
			},
		},
		blockExplorers: {
			etherscan: {
				name: 'Etherscan',
				url: 'https://optimistic.etherscan.io',
			},
			default: {
				name: 'Optimism Explorer',
				url: 'https://explorer.optimism.io',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 4286263,
			},
		},
	},
	{
		formatters: formatters_js_1.formattersOptimism,
	},
)
//# sourceMappingURL=optimism.js.map
