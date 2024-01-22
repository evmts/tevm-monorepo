'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.eon = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.eon = (0, chain_js_1.defineChain)({
	id: 7332,
	name: 'Horizen EON',
	network: 'eon',
	nativeCurrency: {
		decimals: 18,
		name: 'ZEN',
		symbol: 'ZEN',
	},
	rpcUrls: {
		public: { http: ['https://eon-rpc.horizenlabs.io/ethv1'] },
		default: { http: ['https://eon-rpc.horizenlabs.io/ethv1'] },
	},
	blockExplorers: {
		default: {
			name: 'EON Explorer',
			url: 'https://eon-explorer.horizenlabs.io',
		},
	},
	contracts: {},
})
//# sourceMappingURL=eon.js.map
