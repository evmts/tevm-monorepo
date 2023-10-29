'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.qMainnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.qMainnet = (0, chain_js_1.defineChain)({
	id: 35441,
	name: 'Q Mainnet',
	network: 'q-mainnet',
	nativeCurrency: {
		decimals: 18,
		name: 'Q',
		symbol: 'Q',
	},
	rpcUrls: {
		default: { http: ['https://rpc.q.org'] },
		public: { http: ['https://rpc.q.org'] },
	},
	blockExplorers: {
		default: {
			name: 'Q Mainnet Explorer',
			url: 'https://explorer.q.org',
		},
	},
})
//# sourceMappingURL=qMainnet.js.map
