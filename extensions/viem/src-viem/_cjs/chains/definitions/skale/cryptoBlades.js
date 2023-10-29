'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.skaleCryptoBlades = void 0
const chain_js_1 = require('../../../utils/chain.js')
exports.skaleCryptoBlades = (0, chain_js_1.defineChain)({
	id: 1026062157,
	name: 'SKALE | CryptoBlades',
	network: 'skale-cryptoblades',
	nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://mainnet.skalenodes.com/v1/affectionate-immediate-pollux'],
			webSocket: [
				'wss://mainnet.skalenodes.com/v1/ws/affectionate-immediate-pollux',
			],
		},
		public: {
			http: ['https://mainnet.skalenodes.com/v1/affectionate-immediate-pollux'],
			webSocket: [
				'wss://mainnet.skalenodes.com/v1/ws/affectionate-immediate-pollux',
			],
		},
	},
	blockExplorers: {
		blockscout: {
			name: 'SKALE Explorer',
			url: 'https://affectionate-immediate-pollux.explorer.mainnet.skalenodes.com',
		},
		default: {
			name: 'SKALE Explorer',
			url: 'https://affectionate-immediate-pollux.explorer.mainnet.skalenodes.com',
		},
	},
	contracts: {},
})
//# sourceMappingURL=cryptoBlades.js.map
