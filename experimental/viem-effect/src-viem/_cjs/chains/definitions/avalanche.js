'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.avalanche = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.avalanche = (0, chain_js_1.defineChain)({
	id: 43114,
	name: 'Avalanche',
	network: 'avalanche',
	nativeCurrency: {
		decimals: 18,
		name: 'Avalanche',
		symbol: 'AVAX',
	},
	rpcUrls: {
		default: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
		public: { http: ['https://api.avax.network/ext/bc/C/rpc'] },
	},
	blockExplorers: {
		etherscan: { name: 'SnowTrace', url: 'https://snowtrace.io' },
		default: { name: 'SnowTrace', url: 'https://snowtrace.io' },
	},
	contracts: {
		multicall3: {
			address: '0xca11bde05977b3631167028862be2a173976ca11',
			blockCreated: 11907934,
		},
	},
})
//# sourceMappingURL=avalanche.js.map
