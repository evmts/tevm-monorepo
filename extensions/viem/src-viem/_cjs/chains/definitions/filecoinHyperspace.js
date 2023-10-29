'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.filecoinHyperspace = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.filecoinHyperspace = (0, chain_js_1.defineChain)({
	id: 3141,
	name: 'Filecoin Hyperspace',
	network: 'filecoin-hyperspace',
	nativeCurrency: {
		decimals: 18,
		name: 'testnet filecoin',
		symbol: 'tFIL',
	},
	rpcUrls: {
		default: { http: ['https://api.hyperspace.node.glif.io/rpc/v1'] },
		public: { http: ['https://api.hyperspace.node.glif.io/rpc/v1'] },
	},
	blockExplorers: {
		default: { name: 'Filfox', url: 'https://hyperspace.filfox.info/en' },
		filscan: { name: 'Filscan', url: 'https://hyperspace.filscan.io' },
	},
})
//# sourceMappingURL=filecoinHyperspace.js.map
