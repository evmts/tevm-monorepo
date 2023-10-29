'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.classic = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.classic = (0, chain_js_1.defineChain)({
	id: 61,
	name: 'Ethereum Classic',
	network: 'classic',
	nativeCurrency: {
		decimals: 18,
		name: 'ETC',
		symbol: 'ETC',
	},
	rpcUrls: {
		default: { http: ['https://etc.rivet.link'] },
		public: { http: ['https://etc.rivet.link'] },
	},
	blockExplorers: {
		default: {
			name: 'Blockscout',
			url: 'https://blockscout.com/etc/mainnet',
		},
	},
})
//# sourceMappingURL=classic.js.map
