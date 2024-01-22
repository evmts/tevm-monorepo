'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.skaleCryptoColosseum = void 0
const chain_js_1 = require('../../../utils/chain.js')
exports.skaleCryptoColosseum = (0, chain_js_1.defineChain)({
	id: 2046399126,
	name: 'SKALE | Crypto Colosseum',
	network: 'skale-crypto-coloseeum',
	nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://mainnet.skalenodes.com/v1/haunting-devoted-deneb'],
			webSocket: ['wss://mainnet.skalenodes.com/v1/ws/haunting-devoted-deneb'],
		},
		public: {
			http: ['https://mainnet.skalenodes.com/v1/haunting-devoted-deneb'],
			webSocket: ['wss://mainnet.skalenodes.com/v1/ws/haunting-devoted-deneb'],
		},
	},
	blockExplorers: {
		blockscout: {
			name: 'SKALE Explorer',
			url: 'https://haunting-devoted-deneb.explorer.mainnet.skalenodes.com',
		},
		default: {
			name: 'SKALE Explorer',
			url: 'https://haunting-devoted-deneb.explorer.mainnet.skalenodes.com',
		},
	},
	contracts: {},
})
//# sourceMappingURL=cryptoColosseum.js.map
