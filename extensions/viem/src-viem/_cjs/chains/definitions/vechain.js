'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.vechain = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.vechain = (0, chain_js_1.defineChain)({
	id: 100009,
	name: 'Vechain',
	network: 'vechain',
	nativeCurrency: { name: 'VeChain', symbol: 'VET', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://mainnet.vechain.org'],
		},
		public: {
			http: ['https://mainnet.vechain.org'],
		},
	},
	blockExplorers: {
		default: {
			name: 'Vechain Explorer',
			url: 'https://explore.vechain.org',
		},
		vechainStats: {
			name: 'Vechain Stats',
			url: 'https://vechainstats.com',
		},
	},
})
//# sourceMappingURL=vechain.js.map
