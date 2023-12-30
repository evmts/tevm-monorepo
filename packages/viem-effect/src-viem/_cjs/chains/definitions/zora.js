'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.zora = void 0
const chain_js_1 = require('../../utils/chain.js')
const formatters_js_1 = require('../optimism/formatters.js')
exports.zora = (0, chain_js_1.defineChain)(
	{
		id: 7777777,
		name: 'Zora',
		network: 'zora',
		nativeCurrency: {
			decimals: 18,
			name: 'Ether',
			symbol: 'ETH',
		},
		rpcUrls: {
			default: {
				http: ['https://rpc.zora.energy'],
				webSocket: ['wss://rpc.zora.energy'],
			},
			public: {
				http: ['https://rpc.zora.energy'],
				webSocket: ['wss://rpc.zora.energy'],
			},
		},
		blockExplorers: {
			default: { name: 'Explorer', url: 'https://explorer.zora.energy' },
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 5882,
			},
		},
	},
	{
		formatters: formatters_js_1.formattersOptimism,
	},
)
//# sourceMappingURL=zora.js.map
