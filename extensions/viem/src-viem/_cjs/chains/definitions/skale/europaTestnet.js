'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.skaleEuropaTestnet = void 0
const chain_js_1 = require('../../../utils/chain.js')
exports.skaleEuropaTestnet = (0, chain_js_1.defineChain)({
	id: 476158412,
	name: 'SKALE | Europa Liquidity Hub Testnet',
	network: 'skale-europa-testnet',
	nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://staging-v3.skalenodes.com/v1/staging-legal-crazy-castor'],
			webSocket: [
				'wss://staging-v3.skalenodes.com/v1/ws/staging-legal-crazy-castor',
			],
		},
		public: {
			http: ['https://staging-v3.skalenodes.com/v1/staging-legal-crazy-castor'],
			webSocket: [
				'wss://staging-v3.skalenodes.com/v1/ws/staging-legal-crazy-castor',
			],
		},
	},
	blockExplorers: {
		blockscout: {
			name: 'SKALE Explorer',
			url: 'https://staging-legal-crazy-castor.explorer.staging-v3.skalenodes.com',
		},
		default: {
			name: 'SKALE Explorer',
			url: 'https://staging-legal-crazy-castor.explorer.staging-v3.skalenodes.com',
		},
	},
	contracts: {
		multicall3: {
			address: '0xcA11bde05977b3631167028862bE2a173976CA11',
			blockCreated: 2071911,
		},
	},
	testnet: true,
})
//# sourceMappingURL=europaTestnet.js.map
