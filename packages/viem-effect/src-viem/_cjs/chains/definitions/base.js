'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.base = void 0
const chain_js_1 = require('../../utils/chain.js')
const formatters_js_1 = require('../optimism/formatters.js')
exports.base = (0, chain_js_1.defineChain)(
	{
		id: 8453,
		network: 'base',
		name: 'Base',
		nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
		rpcUrls: {
			alchemy: {
				http: ['https://base-mainnet.g.alchemy.com/v2'],
				webSocket: ['wss://base-mainnet.g.alchemy.com/v2'],
			},
			default: {
				http: ['https://mainnet.base.org'],
			},
			public: {
				http: ['https://mainnet.base.org'],
			},
		},
		blockExplorers: {
			blockscout: {
				name: 'Basescout',
				url: 'https://base.blockscout.com',
			},
			default: {
				name: 'Basescan',
				url: 'https://basescan.org',
			},
			etherscan: {
				name: 'Basescan',
				url: 'https://basescan.org',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 5022,
			},
		},
	},
	{
		formatters: formatters_js_1.formattersOptimism,
	},
)
//# sourceMappingURL=base.js.map
