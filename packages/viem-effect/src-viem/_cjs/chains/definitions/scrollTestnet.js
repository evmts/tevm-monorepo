'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.scrollTestnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.scrollTestnet = (0, chain_js_1.defineChain)({
	id: 534353,
	name: 'Scroll Testnet',
	network: 'scroll-testnet',
	nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://alpha-rpc.scroll.io/l2'],
			webSocket: ['wss://alpha-rpc.scroll.io/l2/ws'],
		},
		public: {
			http: ['https://alpha-rpc.scroll.io/l2'],
			webSocket: ['wss://alpha-rpc.scroll.io/l2/ws'],
		},
	},
	blockExplorers: {
		default: {
			name: 'Blockscout',
			url: 'https://blockscout.scroll.io',
		},
	},
	testnet: true,
})
//# sourceMappingURL=scrollTestnet.js.map
