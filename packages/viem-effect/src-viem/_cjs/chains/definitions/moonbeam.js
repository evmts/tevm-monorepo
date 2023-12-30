'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.moonbeam = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.moonbeam = (0, chain_js_1.defineChain)({
	id: 1284,
	name: 'Moonbeam',
	network: 'moonbeam',
	nativeCurrency: {
		decimals: 18,
		name: 'GLMR',
		symbol: 'GLMR',
	},
	rpcUrls: {
		public: {
			http: ['https://moonbeam.public.blastapi.io'],
			webSocket: ['wss://moonbeam.public.blastapi.io'],
		},
		default: {
			http: ['https://moonbeam.public.blastapi.io'],
			webSocket: ['wss://moonbeam.public.blastapi.io'],
		},
	},
	blockExplorers: {
		default: {
			name: 'Moonscan',
			url: 'https://moonscan.io',
		},
		etherscan: {
			name: 'Moonscan',
			url: 'https://moonscan.io',
		},
	},
	contracts: {
		multicall3: {
			address: '0xcA11bde05977b3631167028862bE2a173976CA11',
			blockCreated: 609002,
		},
	},
	testnet: false,
})
//# sourceMappingURL=moonbeam.js.map
