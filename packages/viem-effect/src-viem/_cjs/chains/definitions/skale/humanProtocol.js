'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.skaleHumanProtocol = void 0
const chain_js_1 = require('../../../utils/chain.js')
exports.skaleHumanProtocol = (0, chain_js_1.defineChain)({
	id: 1273227453,
	name: 'SKALE | Human Protocol',
	network: 'skale-human-protocol',
	nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://mainnet.skalenodes.com/v1/wan-red-ain'],
			webSocket: ['wss://mainnet.skalenodes.com/v1/ws/wan-red-ain'],
		},
		public: {
			http: ['https://mainnet.skalenodes.com/v1/wan-red-ain'],
			webSocket: ['wss://mainnet.skalenodes.com/v1/ws/wan-red-ain'],
		},
	},
	blockExplorers: {
		blockscout: {
			name: 'SKALE Explorer',
			url: 'https://wan-red-ain.explorer.mainnet.skalenodes.com',
		},
		default: {
			name: 'SKALE Explorer',
			url: 'https://wan-red-ain.explorer.mainnet.skalenodes.com',
		},
	},
	contracts: {},
})
//# sourceMappingURL=humanProtocol.js.map
