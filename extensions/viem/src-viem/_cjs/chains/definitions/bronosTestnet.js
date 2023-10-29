'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.bronosTestnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.bronosTestnet = (0, chain_js_1.defineChain)({
	id: 1038,
	name: 'Bronos Testnet',
	network: 'bronos-testnet',
	nativeCurrency: {
		decimals: 18,
		name: 'Bronos Coin',
		symbol: 'tBRO',
	},
	rpcUrls: {
		default: { http: ['https://evm-testnet.bronos.org'] },
		public: { http: ['https://evm-testnet.bronos.org'] },
	},
	blockExplorers: {
		default: { name: 'BronoScan', url: 'https://tbroscan.bronos.org' },
	},
	testnet: true,
})
//# sourceMappingURL=bronosTestnet.js.map
