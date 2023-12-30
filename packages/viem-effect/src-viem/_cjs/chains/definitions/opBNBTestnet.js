'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.opBNBTestnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.opBNBTestnet = (0, chain_js_1.defineChain)({
	id: 5611,
	name: 'opBNB Testnet',
	network: 'opBNB Testnet',
	nativeCurrency: {
		decimals: 18,
		name: 'tBNB',
		symbol: 'tBNB',
	},
	rpcUrls: {
		public: { http: ['https://opbnb-testnet-rpc.bnbchain.org'] },
		default: { http: ['https://opbnb-testnet-rpc.bnbchain.org'] },
	},
	blockExplorers: {
		default: { name: 'opbnbscan', url: 'https://opbnbscan.com' },
	},
	contracts: {
		multicall3: {
			address: '0xcA11bde05977b3631167028862bE2a173976CA11',
			blockCreated: 3705108,
		},
	},
	testnet: true,
})
//# sourceMappingURL=opBNBTestnet.js.map
