'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.evmos = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.evmos = (0, chain_js_1.defineChain)({
	id: 9001,
	name: 'Evmos',
	network: 'evmos',
	nativeCurrency: {
		decimals: 18,
		name: 'Evmos',
		symbol: 'EVMOS',
	},
	rpcUrls: {
		default: { http: ['https://eth.bd.evmos.org:8545'] },
		public: { http: ['https://eth.bd.evmos.org:8545'] },
	},
	blockExplorers: {
		default: { name: 'Evmos Block Explorer', url: 'https://escan.live' },
	},
})
//# sourceMappingURL=evmos.js.map
