'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.filecoin = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.filecoin = (0, chain_js_1.defineChain)({
	id: 314,
	name: 'Filecoin Mainnet',
	network: 'filecoin-mainnet',
	nativeCurrency: {
		decimals: 18,
		name: 'filecoin',
		symbol: 'FIL',
	},
	rpcUrls: {
		default: { http: ['https://api.node.glif.io/rpc/v1'] },
		public: { http: ['https://api.node.glif.io/rpc/v1'] },
	},
	blockExplorers: {
		default: { name: 'Filfox', url: 'https://filfox.info/en' },
		filscan: { name: 'Filscan', url: 'https://filscan.io' },
		filscout: { name: 'Filscout', url: 'https://filscout.io/en' },
		glif: { name: 'Glif', url: 'https://explorer.glif.io' },
	},
})
//# sourceMappingURL=filecoin.js.map
