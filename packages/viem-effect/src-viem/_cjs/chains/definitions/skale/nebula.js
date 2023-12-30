'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.skaleNebula = void 0
const chain_js_1 = require('../../../utils/chain.js')
exports.skaleNebula = (0, chain_js_1.defineChain)({
	id: 1482601649,
	name: 'SKALE | Nebula Gaming Hub',
	network: 'skale-nebula',
	nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://mainnet.skalenodes.com/v1/green-giddy-denebola'],
			webSocket: ['wss://mainnet.skalenodes.com/v1/ws/green-giddy-denebola'],
		},
		public: {
			http: ['https://mainnet.skalenodes.com/v1/green-giddy-denebola'],
			webSocket: ['wss://mainnet.skalenodes.com/v1/ws/green-giddy-denebola'],
		},
	},
	blockExplorers: {
		blockscout: {
			name: 'SKALE Explorer',
			url: 'https://green-giddy-denebola.explorer.mainnet.skalenodes.com',
		},
		default: {
			name: 'SKALE Explorer',
			url: 'https://green-giddy-denebola.explorer.mainnet.skalenodes.com',
		},
	},
	contracts: {
		multicall3: {
			address: '0xcA11bde05977b3631167028862bE2a173976CA11',
			blockCreated: 2372986,
		},
	},
})
//# sourceMappingURL=nebula.js.map
