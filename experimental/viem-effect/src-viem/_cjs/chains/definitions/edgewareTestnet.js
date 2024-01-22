'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.edgewareTestnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.edgewareTestnet = (0, chain_js_1.defineChain)({
	id: 2022,
	name: 'Beresheet BereEVM Testnet',
	network: 'edgewareTestnet',
	nativeCurrency: {
		decimals: 18,
		name: 'Testnet EDG',
		symbol: 'tEDG',
	},
	rpcUrls: {
		default: { http: ['https://beresheet-evm.jelliedowl.net'] },
		public: { http: ['https://beresheet-evm.jelliedowl.net'] },
	},
	blockExplorers: {
		etherscan: {
			name: 'Edgscan by Bharathcoorg',
			url: 'https://testnet.edgscan.live',
		},
		default: {
			name: 'Edgscan by Bharathcoorg',
			url: 'https://testnet.edgscan.live',
		},
	},
})
//# sourceMappingURL=edgewareTestnet.js.map
