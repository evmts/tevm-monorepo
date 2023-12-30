'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.metis = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.metis = (0, chain_js_1.defineChain)({
	id: 1088,
	name: 'Metis',
	network: 'andromeda',
	nativeCurrency: {
		decimals: 18,
		name: 'Metis',
		symbol: 'METIS',
	},
	rpcUrls: {
		default: { http: ['https://andromeda.metis.io/?owner=1088'] },
		public: { http: ['https://andromeda.metis.io/?owner=1088'] },
	},
	blockExplorers: {
		default: {
			name: 'Andromeda Explorer',
			url: 'https://andromeda-explorer.metis.io',
		},
	},
	contracts: {
		multicall3: {
			address: '0xca11bde05977b3631167028862be2a173976ca11',
			blockCreated: 2338552,
		},
	},
})
//# sourceMappingURL=metis.js.map
