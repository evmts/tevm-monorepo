'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.skaleRazor = void 0
const chain_js_1 = require('../../../utils/chain.js')
exports.skaleRazor = (0, chain_js_1.defineChain)({
	id: 278611351,
	name: 'SKALE | Razor Network',
	network: 'skale-razor',
	nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://mainnet.skalenodes.com/v1/turbulent-unique-scheat'],
			webSocket: ['wss://mainnet.skalenodes.com/v1/ws/turbulent-unique-scheat'],
		},
		public: {
			http: ['https://mainnet.skalenodes.com/v1/turbulent-unique-scheat'],
			webSocket: ['wss://mainnet.skalenodes.com/v1/ws/turbulent-unique-scheat'],
		},
	},
	blockExplorers: {
		blockscout: {
			name: 'SKALE Explorer',
			url: 'https://turbulent-unique-scheat.explorer.mainnet.skalenodes.com',
		},
		default: {
			name: 'SKALE Explorer',
			url: 'https://turbulent-unique-scheat.explorer.mainnet.skalenodes.com',
		},
	},
	contracts: {},
})
//# sourceMappingURL=razor.js.map
