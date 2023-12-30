'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.skaleEuropa = void 0
const chain_js_1 = require('../../../utils/chain.js')
exports.skaleEuropa = (0, chain_js_1.defineChain)({
	id: 2046399126,
	name: 'SKALE | Europa Liquidity Hub',
	network: 'skale-europa',
	nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://mainnet.skalenodes.com/v1/elated-tan-skat'],
			webSocket: ['wss://mainnet.skalenodes.com/v1/ws/elated-tan-skat'],
		},
		public: {
			http: ['https://mainnet.skalenodes.com/v1/elated-tan-skat'],
			webSocket: ['wss://mainnet.skalenodes.com/v1/ws/elated-tan-skat'],
		},
	},
	blockExplorers: {
		blockscout: {
			name: 'SKALE Explorer',
			url: 'https://elated-tan-skat.explorer.mainnet.skalenodes.com',
		},
		default: {
			name: 'SKALE Explorer',
			url: 'https://elated-tan-skat.explorer.mainnet.skalenodes.com',
		},
	},
	contracts: {
		multicall3: {
			address: '0xcA11bde05977b3631167028862bE2a173976CA11',
			blockCreated: 3113495,
		},
	},
})
//# sourceMappingURL=europa.js.map
