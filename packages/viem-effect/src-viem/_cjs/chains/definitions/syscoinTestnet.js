'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.syscoinTestnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.syscoinTestnet = (0, chain_js_1.defineChain)({
	id: 5700,
	name: 'Syscoin Tanenbaum Testnet',
	network: 'syscoin-testnet',
	nativeCurrency: {
		decimals: 18,
		name: 'Syscoin',
		symbol: 'SYS',
	},
	rpcUrls: {
		default: {
			http: ['https://rpc.tanenbaum.io'],
			webSocket: ['wss://rpc.tanenbaum.io/wss'],
		},
		public: {
			http: ['https://rpc.tanenbaum.io'],
			webSocket: ['wss://rpc.tanenbaum.io/wss'],
		},
	},
	blockExplorers: {
		default: { name: 'SyscoinTestnetExplorer', url: 'https://tanenbaum.io' },
	},
	contracts: {
		multicall3: {
			address: '0xcA11bde05977b3631167028862bE2a173976CA11',
			blockCreated: 271288,
		},
	},
})
//# sourceMappingURL=syscoinTestnet.js.map
