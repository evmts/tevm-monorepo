'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.bronos = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.bronos = (0, chain_js_1.defineChain)({
	id: 1039,
	name: 'Bronos',
	network: 'bronos',
	nativeCurrency: {
		decimals: 18,
		name: 'BRO',
		symbol: 'BRO',
	},
	rpcUrls: {
		default: { http: ['https://evm.bronos.org'] },
		public: { http: ['https://evm.bronos.org'] },
	},
	blockExplorers: {
		default: { name: 'BronoScan', url: 'https://broscan.bronos.org' },
	},
})
//# sourceMappingURL=bronos.js.map
