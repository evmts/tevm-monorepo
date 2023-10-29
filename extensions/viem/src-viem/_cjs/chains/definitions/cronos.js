'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.cronos = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.cronos = (0, chain_js_1.defineChain)({
	id: 25,
	name: 'Cronos Mainnet',
	network: 'cronos',
	nativeCurrency: {
		decimals: 18,
		name: 'Cronos',
		symbol: 'CRO',
	},
	rpcUrls: {
		default: { http: ['https://evm.cronos.org'] },
		public: { http: ['https://evm.cronos.org'] },
	},
	blockExplorers: {
		default: { name: 'Cronoscan', url: 'https://cronoscan.com' },
	},
	contracts: {
		multicall3: {
			address: '0xcA11bde05977b3631167028862bE2a173976CA11',
			blockCreated: 1963112,
		},
	},
})
//# sourceMappingURL=cronos.js.map
