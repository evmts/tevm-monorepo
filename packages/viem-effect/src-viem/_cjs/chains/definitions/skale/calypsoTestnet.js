'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.skaleCalypsoTestnet = void 0
const chain_js_1 = require('../../../utils/chain.js')
exports.skaleCalypsoTestnet = (0, chain_js_1.defineChain)({
	id: 344106930,
	name: 'SKALE | Calypso NFT Hub Testnet',
	network: 'skale-calypso-testnet',
	nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
	rpcUrls: {
		default: {
			http: [
				'https://staging-v3.skalenodes.com/v1/staging-utter-unripe-menkar',
			],
			webSocket: [
				'wss://staging-v3.skalenodes.com/v1/ws/staging-utter-unripe-menkar',
			],
		},
		public: {
			http: [
				'https://staging-v3.skalenodes.com/v1/staging-utter-unripe-menkar',
			],
			webSocket: [
				'wss://staging-v3.skalenodes.com/v1/ws/staging-utter-unripe-menkar',
			],
		},
	},
	blockExplorers: {
		blockscout: {
			name: 'SKALE Explorer',
			url: 'https://staging-utter-unripe-menkar.explorer.staging-v3.skalenodes.com',
		},
		default: {
			name: 'SKALE Explorer',
			url: 'https://staging-utter-unripe-menkar.explorer.staging-v3.skalenodes.com',
		},
	},
	contracts: {
		multicall3: {
			address: '0xcA11bde05977b3631167028862bE2a173976CA11',
			blockCreated: 2131424,
		},
	},
	testnet: true,
})
//# sourceMappingURL=calypsoTestnet.js.map
