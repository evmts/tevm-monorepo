'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.arbitrumNova = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.arbitrumNova = (0, chain_js_1.defineChain)({
	id: 42170,
	name: 'Arbitrum Nova',
	network: 'arbitrum-nova',
	nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
	rpcUrls: {
		blast: {
			http: ['https://arbitrum-nova.public.blastapi.io'],
			webSocket: ['wss://arbitrum-nova.public.blastapi.io'],
		},
		default: {
			http: ['https://nova.arbitrum.io/rpc'],
		},
		public: {
			http: ['https://nova.arbitrum.io/rpc'],
		},
	},
	blockExplorers: {
		etherscan: { name: 'Arbiscan', url: 'https://nova.arbiscan.io' },
		blockScout: {
			name: 'BlockScout',
			url: 'https://nova-explorer.arbitrum.io/',
		},
		default: { name: 'Arbiscan', url: 'https://nova.arbiscan.io' },
	},
	contracts: {
		multicall3: {
			address: '0xca11bde05977b3631167028862be2a173976ca11',
			blockCreated: 1746963,
		},
	},
})
//# sourceMappingURL=arbitrumNova.js.map
