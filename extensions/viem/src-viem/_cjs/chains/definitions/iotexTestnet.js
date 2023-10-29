'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.iotexTestnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.iotexTestnet = (0, chain_js_1.defineChain)({
	id: 4690,
	name: 'IoTeX Testnet',
	network: 'iotex-testnet',
	nativeCurrency: {
		decimals: 18,
		name: 'IoTeX',
		symbol: 'IOTX',
	},
	rpcUrls: {
		default: {
			http: ['https://babel-api.testnet.iotex.io'],
			webSocket: ['wss://babel-api.testnet.iotex.io'],
		},
		public: {
			http: ['https://babel-api.testnet.iotex.io'],
			webSocket: ['wss://babel-api.testnet.iotex.io'],
		},
	},
	blockExplorers: {
		default: { name: 'IoTeXScan', url: 'https://testnet.iotexscan.io' },
	},
})
//# sourceMappingURL=iotexTestnet.js.map
