'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.bxn = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.bxn = (0, chain_js_1.defineChain)({
	id: 4999,
	name: 'BlackFort Exchange Network',
	network: 'bxn',
	nativeCurrency: { name: 'BlackFort Token', symbol: 'BXN', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://mainnet.blackfort.network/rpc'],
		},
		public: {
			http: ['https://mainnet.blackfort.network/rpc'],
		},
	},
	blockExplorers: {
		default: {
			name: 'Blockscout',
			url: 'https://explorer.blackfort.network',
		},
	},
})
//# sourceMappingURL=bxn.js.map
