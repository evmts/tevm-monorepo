'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.bearNetworkChainTestnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.bearNetworkChainTestnet = (0, chain_js_1.defineChain)({
	id: 751230,
	name: 'Bear Network Chain Testnet',
	network: 'BearNetworkChainTestnet',
	nativeCurrency: {
		decimals: 18,
		name: 'tBRNKC',
		symbol: 'tBRNKC',
	},
	rpcUrls: {
		public: { http: ['https://brnkc-test.bearnetwork.net'] },
		default: { http: ['https://brnkc-test.bearnetwork.net'] },
	},
	blockExplorers: {
		default: {
			name: 'BrnkTestScan',
			url: 'https://brnktest-scan.bearnetwork.net',
		},
	},
	testnet: true,
})
//# sourceMappingURL=bearNetworkChainTestnet.js.map
