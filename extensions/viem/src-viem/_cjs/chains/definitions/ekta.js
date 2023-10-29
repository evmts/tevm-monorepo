'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.ekta = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.ekta = (0, chain_js_1.defineChain)({
	id: 1994,
	name: 'Ekta',
	network: 'ekta',
	nativeCurrency: {
		decimals: 18,
		name: 'EKTA',
		symbol: 'EKTA',
	},
	rpcUrls: {
		public: { http: ['https://main.ekta.io'] },
		default: { http: ['https://main.ekta.io'] },
	},
	blockExplorers: {
		default: { name: 'Ektascan', url: 'https://ektascan.io' },
	},
})
//# sourceMappingURL=ekta.js.map
