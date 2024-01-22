'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.skaleExorde = void 0
const chain_js_1 = require('../../../utils/chain.js')
exports.skaleExorde = (0, chain_js_1.defineChain)({
	id: 2139927552,
	name: 'SKALE | Exorde',
	network: 'skale-exorde',
	nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://mainnet.skalenodes.com/v1/light-vast-diphda'],
			webSocket: ['wss://mainnet.skalenodes.com/v1/ws/light-vast-diphda'],
		},
		public: {
			http: ['https://mainnet.skalenodes.com/v1/light-vast-diphda'],
			webSocket: ['wss://mainnet.skalenodes.com/v1/ws/light-vast-diphda'],
		},
	},
	blockExplorers: {
		blockscout: {
			name: 'SKALE Explorer',
			url: 'https://light-vast-diphda.explorer.mainnet.skalenodes.com',
		},
		default: {
			name: 'SKALE Explorer',
			url: 'https://light-vast-diphda.explorer.mainnet.skalenodes.com',
		},
	},
	contracts: {},
})
//# sourceMappingURL=exorde.js.map
