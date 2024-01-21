'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.modeTestnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.modeTestnet = (0, chain_js_1.defineChain)({
	id: 919,
	name: 'Mode Testnet',
	network: 'mode-testnet',
	nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://sepolia.mode.network'],
		},
		public: {
			http: ['https://sepolia.mode.network'],
		},
	},
	blockExplorers: {
		default: {
			name: 'Blockscout',
			url: 'https://sepolia.explorer.mode.network',
		},
	},
	testnet: true,
})
//# sourceMappingURL=modeTestnet.js.map
