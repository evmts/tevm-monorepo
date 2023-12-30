'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.bearNetworkChainMainnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.bearNetworkChainMainnet = (0, chain_js_1.defineChain)({
	id: 641230,
	name: 'Bear Network Chain Mainnet',
	network: 'BearNetworkChainMainnet',
	nativeCurrency: {
		decimals: 18,
		name: 'BearNetworkChain',
		symbol: 'BRNKC',
	},
	rpcUrls: {
		public: { http: ['https://brnkc-mainnet.bearnetwork.net'] },
		default: { http: ['https://brnkc-mainnet.bearnetwork.net'] },
	},
	blockExplorers: {
		default: { name: 'BrnkScan', url: 'https://brnkscan.bearnetwork.net' },
	},
})
//# sourceMappingURL=bearNetworkChainMainnet.js.map
