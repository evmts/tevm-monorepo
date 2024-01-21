'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.polygonZkEvm = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.polygonZkEvm = (0, chain_js_1.defineChain)({
	id: 1101,
	name: 'Polygon zkEVM',
	network: 'polygon-zkevm',
	nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://zkevm-rpc.com'],
		},
		public: {
			http: ['https://zkevm-rpc.com'],
		},
	},
	blockExplorers: {
		default: {
			name: 'PolygonScan',
			url: 'https://zkevm.polygonscan.com',
		},
	},
	contracts: {
		multicall3: {
			address: '0xca11bde05977b3631167028862be2a173976ca11',
			blockCreated: 57746,
		},
	},
})
//# sourceMappingURL=polygonZkEvm.js.map
