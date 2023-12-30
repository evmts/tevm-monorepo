'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.syscoin = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.syscoin = (0, chain_js_1.defineChain)({
	id: 57,
	name: 'Syscoin Mainnet',
	network: 'syscoin',
	nativeCurrency: {
		decimals: 18,
		name: 'Syscoin',
		symbol: 'SYS',
	},
	rpcUrls: {
		default: {
			http: ['https://rpc.syscoin.org'],
			webSocket: ['wss://rpc.syscoin.org/wss'],
		},
		public: {
			http: ['https://rpc.syscoin.org'],
			webSocket: ['wss://rpc.syscoin.org/wss'],
		},
	},
	blockExplorers: {
		default: { name: 'SyscoinExplorer', url: 'https://explorer.syscoin.org' },
	},
	contracts: {
		multicall3: {
			address: '0xcA11bde05977b3631167028862bE2a173976CA11',
			blockCreated: 287139,
		},
	},
})
//# sourceMappingURL=syscoin.js.map
