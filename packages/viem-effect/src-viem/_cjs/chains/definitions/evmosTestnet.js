'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.evmosTestnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.evmosTestnet = (0, chain_js_1.defineChain)({
	id: 9000,
	name: 'Evmos Testnet',
	network: 'evmos-testnet',
	nativeCurrency: {
		decimals: 18,
		name: 'Evmos',
		symbol: 'EVMOS',
	},
	rpcUrls: {
		default: { http: ['https://eth.bd.evmos.dev:8545'] },
		public: { http: ['https://eth.bd.evmos.dev:8545'] },
	},
	blockExplorers: {
		default: {
			name: 'Evmos Testnet Block Explorer',
			url: 'https://evm.evmos.dev/',
		},
	},
})
//# sourceMappingURL=evmosTestnet.js.map
