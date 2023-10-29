'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.okc = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.okc = (0, chain_js_1.defineChain)({
	id: 66,
	name: 'OKC',
	network: 'okc',
	nativeCurrency: {
		decimals: 18,
		name: 'OKT',
		symbol: 'OKT',
	},
	rpcUrls: {
		default: { http: ['https://exchainrpc.okex.org'] },
		public: { http: ['https://exchainrpc.okex.org'] },
	},
	blockExplorers: {
		default: { name: 'oklink', url: 'https://www.oklink.com/okc' },
	},
	contracts: {
		multicall3: {
			address: '0xca11bde05977b3631167028862be2a173976ca11',
			blockCreated: 10364792,
		},
	},
})
//# sourceMappingURL=okc.js.map
