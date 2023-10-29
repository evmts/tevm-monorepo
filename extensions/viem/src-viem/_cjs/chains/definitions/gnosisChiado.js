'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.gnosisChiado = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.gnosisChiado = (0, chain_js_1.defineChain)({
	id: 10200,
	name: 'Gnosis Chiado',
	network: 'chiado',
	nativeCurrency: {
		decimals: 18,
		name: 'Gnosis',
		symbol: 'xDAI',
	},
	rpcUrls: {
		default: { http: ['https://rpc.chiadochain.net'] },
		public: { http: ['https://rpc.chiadochain.net'] },
	},
	blockExplorers: {
		default: {
			name: 'Blockscout',
			url: 'https://blockscout.chiadochain.net',
		},
	},
	testnet: true,
})
//# sourceMappingURL=gnosisChiado.js.map
