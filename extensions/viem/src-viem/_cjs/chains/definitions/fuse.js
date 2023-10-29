'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.fuse = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.fuse = (0, chain_js_1.defineChain)({
	id: 122,
	name: 'Fuse',
	network: 'fuse',
	nativeCurrency: { name: 'Fuse', symbol: 'FUSE', decimals: 18 },
	rpcUrls: {
		default: { http: ['https://rpc.fuse.io'] },
		public: { http: ['https://fuse-mainnet.chainstacklabs.com'] },
	},
	blockExplorers: {
		default: { name: 'Fuse Explorer', url: 'https://explorer.fuse.io' },
	},
})
//# sourceMappingURL=fuse.js.map
