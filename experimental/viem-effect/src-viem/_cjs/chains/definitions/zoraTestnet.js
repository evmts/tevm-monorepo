'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.zoraTestnet = void 0
const chain_js_1 = require('../../utils/chain.js')
const formatters_js_1 = require('../optimism/formatters.js')
exports.zoraTestnet = (0, chain_js_1.defineChain)(
	{
		id: 999,
		name: 'Zora Goerli Testnet',
		network: 'zora-testnet',
		nativeCurrency: {
			decimals: 18,
			name: 'Zora Goerli',
			symbol: 'ETH',
		},
		rpcUrls: {
			default: {
				http: ['https://testnet.rpc.zora.energy'],
				webSocket: ['wss://testnet.rpc.zora.energy'],
			},
			public: {
				http: ['https://testnet.rpc.zora.energy'],
				webSocket: ['wss://testnet.rpc.zora.energy'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Explorer',
				url: 'https://testnet.explorer.zora.energy',
			},
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 189123,
			},
		},
		testnet: true,
	},
	{
		formatters: formatters_js_1.formattersOptimism,
	},
)
//# sourceMappingURL=zoraTestnet.js.map
