'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.taraxa = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.taraxa = (0, chain_js_1.defineChain)({
	id: 841,
	name: 'Taraxa Mainnet',
	network: 'taraxa',
	nativeCurrency: { name: 'Tara', symbol: 'TARA', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://rpc.mainnet.taraxa.io'],
		},
		public: {
			http: ['https://rpc.mainnet.taraxa.io'],
		},
	},
	blockExplorers: {
		default: {
			name: 'Taraxa Explorer',
			url: 'https://explorer.mainnet.taraxa.io',
		},
	},
})
//# sourceMappingURL=taraxa.js.map
