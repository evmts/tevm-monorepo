'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.saigon = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.saigon = (0, chain_js_1.defineChain)({
	id: 2021,
	name: 'Saigon Testnet',
	network: 'saigon',
	nativeCurrency: { name: 'RON', symbol: 'RON', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://saigon-testnet.roninchain.com/rpc'],
		},
		public: {
			http: ['https://saigon-testnet.roninchain.com/rpc'],
		},
	},
	blockExplorers: {
		default: {
			name: 'Saigon Explorer',
			url: 'https://saigon-explorer.roninchain.com',
		},
	},
	contracts: {
		multicall3: {
			address: '0xca11bde05977b3631167028862be2a173976ca11',
			blockCreated: 18736871,
		},
	},
	testnet: true,
})
//# sourceMappingURL=saigon.js.map
