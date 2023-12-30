'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.oasys = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.oasys = (0, chain_js_1.defineChain)({
	id: 248,
	name: 'Oasys',
	network: 'oasys',
	nativeCurrency: { name: 'Oasys', symbol: 'OAS', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://rpc.mainnet.oasys.games'],
		},
		public: {
			http: ['https://rpc.mainnet.oasys.games'],
		},
	},
	blockExplorers: {
		default: {
			name: 'OasysScan',
			url: 'https://scan.oasys.games',
		},
	},
})
//# sourceMappingURL=oasys.js.map
