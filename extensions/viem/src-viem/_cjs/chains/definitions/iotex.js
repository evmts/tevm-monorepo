'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.iotex = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.iotex = (0, chain_js_1.defineChain)({
	id: 4689,
	name: 'IoTeX',
	network: 'iotex',
	nativeCurrency: {
		decimals: 18,
		name: 'IoTeX',
		symbol: 'IOTX',
	},
	rpcUrls: {
		default: {
			http: ['https://babel-api.mainnet.iotex.io'],
			webSocket: ['wss://babel-api.mainnet.iotex.io'],
		},
		public: {
			http: ['https://babel-api.mainnet.iotex.io'],
			webSocket: ['wss://babel-api.mainnet.iotex.io'],
		},
	},
	blockExplorers: {
		default: { name: 'IoTeXScan', url: 'https://iotexscan.io' },
	},
})
//# sourceMappingURL=iotex.js.map
