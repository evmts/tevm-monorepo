'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.skaleTitanTestnet = void 0
const chain_js_1 = require('../../../utils/chain.js')
exports.skaleTitanTestnet = (0, chain_js_1.defineChain)({
	id: 1517929550,
	name: 'SKALE | Titan Community Hub Testnet',
	network: 'skale-titan-testnet',
	nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
	rpcUrls: {
		default: {
			http: [
				'https://staging-v3.skalenodes.com/v1/staging-aware-chief-gianfar',
			],
			webSocket: [
				'wss://staging-v3.skalenodes.com/v1/ws/staging-aware-chief-gianfar',
			],
		},
		public: {
			http: [
				'https://staging-v3.skalenodes.com/v1/staging-aware-chief-gianfar',
			],
			webSocket: [
				'wss://staging-v3.skalenodes.com/v1/ws/staging-aware-chief-gianfar',
			],
		},
	},
	blockExplorers: {
		blockscout: {
			name: 'SKALE Explorer',
			url: 'https://staging-aware-chief-gianfar.explorer.staging-v3.skalenodes.com',
		},
		default: {
			name: 'SKALE Explorer',
			url: 'https://staging-aware-chief-gianfar.explorer.staging-v3.skalenodes.com',
		},
	},
	contracts: {
		multicall3: {
			address: '0xcA11bde05977b3631167028862bE2a173976CA11',
			blockCreated: 2085155,
		},
	},
	testnet: true,
})
//# sourceMappingURL=titanTestnet.js.map
