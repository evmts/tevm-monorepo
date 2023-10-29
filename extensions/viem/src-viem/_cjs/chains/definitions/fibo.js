'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.fibo = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.fibo = (0, chain_js_1.defineChain)({
	id: 12306,
	name: 'Fibo Chain',
	network: 'fibochain',
	nativeCurrency: {
		decimals: 18,
		name: 'fibo',
		symbol: 'FIBO',
	},
	rpcUrls: {
		default: { http: ['https://network.hzroc.art'] },
		public: { http: ['https://network.hzroc.art'] },
	},
	blockExplorers: {
		default: { name: 'FiboScan', url: 'https://scan.fibochain.org' },
	},
})
//# sourceMappingURL=fibo.js.map
