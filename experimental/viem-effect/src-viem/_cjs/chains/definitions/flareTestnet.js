'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.flareTestnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.flareTestnet = (0, chain_js_1.defineChain)({
	id: 114,
	name: 'Coston2',
	network: 'coston2',
	nativeCurrency: {
		decimals: 18,
		name: 'coston2flare',
		symbol: 'C2FLR',
	},
	rpcUrls: {
		default: { http: ['https://coston2-api.flare.network/ext/C/rpc'] },
		public: { http: ['https://coston2-api.flare.network/ext/C/rpc'] },
	},
	blockExplorers: {
		default: {
			name: 'Coston2 Explorer',
			url: 'https://coston2-explorer.flare.network',
		},
	},
	testnet: true,
})
//# sourceMappingURL=flareTestnet.js.map
