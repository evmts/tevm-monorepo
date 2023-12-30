'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.skaleNebulaTestnet = void 0
const chain_js_1 = require('../../../utils/chain.js')
exports.skaleNebulaTestnet = (0, chain_js_1.defineChain)({
	id: 503129905,
	name: 'SKALE | Nebula Gaming Hub Testnet',
	network: 'skale-nebula-testnet',
	nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://staging-v3.skalenodes.com/v1/staging-faint-slimy-achird'],
			webSocket: [
				'wss://staging-v3.skalenodes.com/v1/ws/staging-faint-slimy-achird',
			],
		},
		public: {
			http: ['https://staging-v3.skalenodes.com/v1/staging-faint-slimy-achird'],
			webSocket: [
				'wss://staging-v3.skalenodes.com/v1/ws/staging-faint-slimy-achird',
			],
		},
	},
	blockExplorers: {
		blockscout: {
			name: 'SKALE Explorer',
			url: 'https://staging-faint-slimy-achird.explorer.staging-v3.skalenodes.com',
		},
		default: {
			name: 'SKALE Explorer',
			url: 'https://staging-faint-slimy-achird.explorer.staging-v3.skalenodes.com',
		},
	},
	contracts: {
		multicall3: {
			address: '0xcA11bde05977b3631167028862bE2a173976CA11',
			blockCreated: 2205882,
		},
	},
	testnet: true,
})
//# sourceMappingURL=nebulaTestnet.js.map
