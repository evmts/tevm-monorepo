'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.qTestnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.qTestnet = (0, chain_js_1.defineChain)({
	id: 35443,
	name: 'Q Testnet',
	network: 'q-testnet',
	nativeCurrency: {
		decimals: 18,
		name: 'Q',
		symbol: 'Q',
	},
	rpcUrls: {
		default: { http: ['https://rpc.qtestnet.org'] },
		public: { http: ['https://rpc.qtestnet.org'] },
	},
	blockExplorers: {
		default: {
			name: 'Q Testnet Explorer',
			url: 'https://explorer.qtestnet.org',
		},
	},
	testnet: true,
})
//# sourceMappingURL=qTestnet.js.map
