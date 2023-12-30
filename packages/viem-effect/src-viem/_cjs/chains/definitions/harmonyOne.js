'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.harmonyOne = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.harmonyOne = (0, chain_js_1.defineChain)({
	id: 1666600000,
	name: 'Harmony One',
	network: 'harmony',
	nativeCurrency: {
		name: 'Harmony',
		symbol: 'ONE',
		decimals: 18,
	},
	rpcUrls: {
		public: { http: ['https://rpc.ankr.com/harmony'] },
		default: { http: ['https://rpc.ankr.com/harmony'] },
	},
	blockExplorers: {
		default: { name: 'Harmony Explorer', url: 'https://explorer.harmony.one' },
	},
	contracts: {
		multicall3: {
			address: '0xca11bde05977b3631167028862be2a173976ca11',
			blockCreated: 24185753,
		},
	},
})
//# sourceMappingURL=harmonyOne.js.map
