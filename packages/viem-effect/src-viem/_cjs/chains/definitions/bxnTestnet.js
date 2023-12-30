'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.bxnTestnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.bxnTestnet = (0, chain_js_1.defineChain)({
	id: 4777,
	name: 'BlackFort Exchange Network Testnet',
	network: 'bxnTestnet',
	nativeCurrency: {
		name: 'BlackFort Testnet Token',
		symbol: 'TBXN',
		decimals: 18,
	},
	rpcUrls: {
		default: {
			http: ['https://testnet.blackfort.network/rpc'],
		},
		public: {
			http: ['https://testnet.blackfort.network/rpc'],
		},
	},
	blockExplorers: {
		default: {
			name: 'Blockscout',
			url: 'https://testnet-explorer.blackfort.network',
		},
	},
})
//# sourceMappingURL=bxnTestnet.js.map
