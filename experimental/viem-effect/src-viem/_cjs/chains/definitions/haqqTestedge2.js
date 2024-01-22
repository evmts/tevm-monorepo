'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.haqqTestedge2 = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.haqqTestedge2 = (0, chain_js_1.defineChain)({
	id: 54211,
	name: 'HAQQ Testedge 2',
	network: 'haqq-testedge-2',
	nativeCurrency: {
		decimals: 18,
		name: 'Islamic Coin',
		symbol: 'ISLMT',
	},
	rpcUrls: {
		default: {
			http: ['https://rpc.eth.testedge2.haqq.network'],
		},
		public: {
			http: ['https://rpc.eth.testedge2.haqq.network'],
		},
	},
	blockExplorers: {
		default: {
			name: 'HAQQ Explorer',
			url: 'https://explorer.testedge2.haqq.network',
		},
	},
})
//# sourceMappingURL=haqqTestedge2.js.map
