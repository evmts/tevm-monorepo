'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.skaleBlockBrawlers = void 0
const chain_js_1 = require('../../../utils/chain.js')
exports.skaleBlockBrawlers = (0, chain_js_1.defineChain)({
	id: 391845894,
	name: 'SKALE | Block Brawlers',
	network: 'skale-brawl',
	nativeCurrency: { name: 'BRAWL', symbol: 'BRAWL', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://mainnet.skalenodes.com/v1/frayed-decent-antares'],
			webSocket: ['wss://mainnet.skalenodes.com/v1/ws/frayed-decent-antares'],
		},
		public: {
			http: ['https://mainnet.skalenodes.com/v1/frayed-decent-antares'],
			webSocket: ['wss://mainnet.skalenodes.com/v1/ws/frayed-decent-antares'],
		},
	},
	blockExplorers: {
		blockscout: {
			name: 'SKALE Explorer',
			url: 'https://frayed-decent-antares.explorer.mainnet.skalenodes.com',
		},
		default: {
			name: 'SKALE Explorer',
			url: 'https://frayed-decent-antares.explorer.mainnet.skalenodes.com',
		},
	},
	contracts: {},
})
//# sourceMappingURL=brawl.js.map
