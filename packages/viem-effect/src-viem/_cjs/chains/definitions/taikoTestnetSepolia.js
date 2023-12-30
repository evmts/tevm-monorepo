'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.taikoTestnetSepolia = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.taikoTestnetSepolia = (0, chain_js_1.defineChain)({
	id: 167005,
	name: 'Taiko (Alpha-3 Testnet)',
	network: 'taiko-sepolia',
	nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://rpc.test.taiko.xyz'],
		},
		public: {
			http: ['https://rpc.test.taiko.xyz'],
		},
	},
	blockExplorers: {
		default: {
			name: 'blockscout',
			url: 'https://explorer.test.taiko.xyz',
		},
	},
})
//# sourceMappingURL=taikoTestnetSepolia.js.map
