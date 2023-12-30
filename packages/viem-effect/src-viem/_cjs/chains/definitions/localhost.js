'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.localhost = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.localhost = (0, chain_js_1.defineChain)({
	id: 1337,
	name: 'Localhost',
	network: 'localhost',
	nativeCurrency: {
		decimals: 18,
		name: 'Ether',
		symbol: 'ETH',
	},
	rpcUrls: {
		default: { http: ['http://127.0.0.1:8545'] },
		public: { http: ['http://127.0.0.1:8545'] },
	},
})
//# sourceMappingURL=localhost.js.map
