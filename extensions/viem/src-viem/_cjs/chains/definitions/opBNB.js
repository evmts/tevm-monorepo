'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.opBNB = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.opBNB = (0, chain_js_1.defineChain)({
	id: 204,
	name: 'opBNB',
	network: 'opBNB Mainnet',
	nativeCurrency: {
		name: 'BNB',
		symbol: 'BNB',
		decimals: 18,
	},
	rpcUrls: {
		public: { http: ['https://opbnb-mainnet-rpc.bnbchain.org'] },
		default: { http: ['https://opbnb-mainnet-rpc.bnbchain.org'] },
	},
	blockExplorers: {
		default: { name: 'opbnbscan', url: 'https://mainnet.opbnbscan.com' },
	},
	contracts: {
		multicall3: {
			address: '0xcA11bde05977b3631167028862bE2a173976CA11',
			blockCreated: 512881,
		},
	},
})
//# sourceMappingURL=opBNB.js.map
