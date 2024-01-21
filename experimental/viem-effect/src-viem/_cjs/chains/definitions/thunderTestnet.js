'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.thunderTestnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.thunderTestnet = (0, chain_js_1.defineChain)({
	id: 997,
	name: '5ireChain Thunder Testnet',
	network: '5ireChain',
	nativeCurrency: { name: '5ire Token', symbol: '5IRE', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://rpc-testnet.5ire.network'],
		},
		public: {
			http: ['https://rpc-testnet.5ire.network'],
		},
	},
	blockExplorers: {
		default: {
			name: '5ireChain Explorer',
			url: 'https://explorer.5ire.network',
		},
	},
	testnet: true,
})
//# sourceMappingURL=thunderTestnet.js.map
