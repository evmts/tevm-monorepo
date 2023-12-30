'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.ektaTestnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.ektaTestnet = (0, chain_js_1.defineChain)({
	id: 1004,
	name: 'Ekta Testnet',
	network: 'ekta-testnet',
	nativeCurrency: {
		decimals: 18,
		name: 'EKTA',
		symbol: 'EKTA',
	},
	rpcUrls: {
		public: { http: ['https://test.ekta.io:8545'] },
		default: { http: ['https://test.ekta.io:8545'] },
	},
	blockExplorers: {
		default: { name: 'Test Ektascan', url: 'https://test.ektascan.io' },
	},
	testnet: true,
})
//# sourceMappingURL=ektaTestnet.js.map
