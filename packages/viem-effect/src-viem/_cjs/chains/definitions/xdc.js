'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.xdc = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.xdc = (0, chain_js_1.defineChain)({
	id: 50,
	name: 'XinFin Network',
	network: 'xdc',
	nativeCurrency: {
		decimals: 18,
		name: 'XDC',
		symbol: 'XDC',
	},
	rpcUrls: {
		default: { http: ['https://rpc.xinfin.network'] },
		public: { http: ['https://rpc.xinfin.network'] },
	},
	blockExplorers: {
		xinfin: { name: 'XinFin', url: 'https://explorer.xinfin.network' },
		default: { name: 'Blocksscan', url: 'https://xdc.blocksscan.io' },
	},
})
//# sourceMappingURL=xdc.js.map
