'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.fantom = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.fantom = (0, chain_js_1.defineChain)({
	id: 250,
	name: 'Fantom',
	network: 'fantom',
	nativeCurrency: {
		decimals: 18,
		name: 'Fantom',
		symbol: 'FTM',
	},
	rpcUrls: {
		default: { http: ['https://rpc.ankr.com/fantom'] },
		public: { http: ['https://rpc.ankr.com/fantom'] },
	},
	blockExplorers: {
		etherscan: { name: 'FTMScan', url: 'https://ftmscan.com' },
		default: { name: 'FTMScan', url: 'https://ftmscan.com' },
	},
	contracts: {
		multicall3: {
			address: '0xca11bde05977b3631167028862be2a173976ca11',
			blockCreated: 33001987,
		},
	},
})
//# sourceMappingURL=fantom.js.map
