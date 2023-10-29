'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.zkSync = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.zkSync = (0, chain_js_1.defineChain)({
	id: 324,
	name: 'zkSync Era',
	network: 'zksync-era',
	nativeCurrency: {
		decimals: 18,
		name: 'Ether',
		symbol: 'ETH',
	},
	rpcUrls: {
		default: {
			http: ['https://mainnet.era.zksync.io'],
			webSocket: ['wss://mainnet.era.zksync.io/ws'],
		},
		public: {
			http: ['https://mainnet.era.zksync.io'],
			webSocket: ['wss://mainnet.era.zksync.io/ws'],
		},
	},
	blockExplorers: {
		default: {
			name: 'zkExplorer',
			url: 'https://explorer.zksync.io',
		},
	},
	contracts: {
		multicall3: {
			address: '0xF9cda624FBC7e059355ce98a31693d299FACd963',
		},
	},
})
//# sourceMappingURL=zkSync.js.map
