'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.baseGoerli = void 0
const chain_js_1 = require('../../utils/chain.js')
const formatters_js_1 = require('../optimism/formatters.js')
exports.baseGoerli = (0, chain_js_1.defineChain)(
	{
		id: 84531,
		network: 'base-goerli',
		name: 'Base Goerli',
		nativeCurrency: { name: 'Goerli Ether', symbol: 'ETH', decimals: 18 },
		rpcUrls: {
			alchemy: {
				http: ['https://base-goerli.g.alchemy.com/v2'],
				webSocket: ['wss://base-goerli.g.alchemy.com/v2'],
			},
			default: {
				http: ['https://goerli.base.org'],
			},
			public: {
				http: ['https://goerli.base.org'],
			},
		},
		blockExplorers: {
			etherscan: {
				name: 'Basescan',
				url: 'https://goerli.basescan.org',
			},
			default: {
				name: 'Basescan',
				url: 'https://goerli.basescan.org',
			},
		},
		contracts: {
			multicall3: {
				address: '0xca11bde05977b3631167028862be2a173976ca11',
				blockCreated: 1376988,
			},
		},
		testnet: true,
		sourceId: 5,
	},
	{
		formatters: formatters_js_1.formattersOptimism,
	},
)
//# sourceMappingURL=baseGoerli.js.map
