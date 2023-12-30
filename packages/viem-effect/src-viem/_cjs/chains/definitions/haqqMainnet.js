'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.haqqMainnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.haqqMainnet = (0, chain_js_1.defineChain)({
	id: 11235,
	name: 'HAQQ Mainnet',
	network: 'haqq-mainnet',
	nativeCurrency: {
		decimals: 18,
		name: 'Islamic Coin',
		symbol: 'ISLM',
	},
	rpcUrls: {
		default: {
			http: ['https://rpc.eth.haqq.network'],
		},
		public: {
			http: ['https://rpc.eth.haqq.network'],
		},
	},
	blockExplorers: {
		default: {
			name: 'HAQQ Explorer',
			url: 'https://explorer.haqq.network',
		},
	},
})
//# sourceMappingURL=haqqMainnet.js.map
