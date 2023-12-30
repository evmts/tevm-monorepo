'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.klaytn = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.klaytn = (0, chain_js_1.defineChain)({
	id: 8217,
	name: 'Klaytn',
	network: 'klaytn',
	nativeCurrency: {
		decimals: 18,
		name: 'Klaytn',
		symbol: 'KLAY',
	},
	rpcUrls: {
		default: { http: ['https://cypress.fautor.app/archive'] },
		public: { http: ['https://cypress.fautor.app/archive'] },
	},
	blockExplorers: {
		etherscan: { name: 'KlaytnScope', url: 'https://scope.klaytn.com' },
		default: { name: 'KlaytnScope', url: 'https://scope.klaytn.com' },
	},
})
//# sourceMappingURL=klaytn.js.map
