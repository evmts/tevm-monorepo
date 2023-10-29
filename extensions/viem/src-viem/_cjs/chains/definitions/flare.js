'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.flare = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.flare = (0, chain_js_1.defineChain)({
	id: 14,
	name: 'Flare Mainnet',
	network: 'flare-mainnet',
	nativeCurrency: {
		decimals: 18,
		name: 'flare',
		symbol: 'FLR',
	},
	rpcUrls: {
		default: { http: ['https://flare-api.flare.network/ext/C/rpc'] },
		public: { http: ['https://flare-api.flare.network/ext/C/rpc'] },
	},
	blockExplorers: {
		default: {
			name: 'Flare Explorer',
			url: 'https://flare-explorer.flare.network',
		},
	},
})
//# sourceMappingURL=flare.js.map
