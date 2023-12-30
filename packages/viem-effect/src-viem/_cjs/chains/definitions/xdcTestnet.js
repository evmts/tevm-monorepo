'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.xdcTestnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.xdcTestnet = (0, chain_js_1.defineChain)({
	id: 51,
	name: 'Apothem Network',
	network: 'xdc-testnet',
	nativeCurrency: {
		decimals: 18,
		name: 'TXDC',
		symbol: 'TXDC',
	},
	rpcUrls: {
		default: { http: ['https://erpc.apothem.network'] },
		public: { http: ['https://erpc.apothem.network'] },
	},
	blockExplorers: {
		xinfin: { name: 'XinFin', url: 'https://explorer.apothem.network' },
		default: { name: 'Blocksscan', url: 'https://apothem.blocksscan.io' },
	},
})
//# sourceMappingURL=xdcTestnet.js.map
