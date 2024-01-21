'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.taraxaTestnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.taraxaTestnet = (0, chain_js_1.defineChain)({
	id: 842,
	name: 'Taraxa Testnet',
	network: 'taraxa-testnet',
	nativeCurrency: { name: 'Tara', symbol: 'TARA', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://rpc.testnet.taraxa.io'],
		},
		public: {
			http: ['https://rpc.testnet.taraxa.io'],
		},
	},
	blockExplorers: {
		default: {
			name: 'Taraxa Explorer',
			url: 'https://explorer.testnet.taraxa.io',
		},
	},
	testnet: true,
})
//# sourceMappingURL=taraxaTestnet.js.map
