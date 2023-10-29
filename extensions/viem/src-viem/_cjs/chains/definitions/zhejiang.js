'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.zhejiang = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.zhejiang = (0, chain_js_1.defineChain)({
	id: 1337803,
	network: 'zhejiang',
	name: 'Zhejiang',
	nativeCurrency: { name: 'Zhejiang Ether', symbol: 'ZhejETH', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://rpc.zhejiang.ethpandaops.io'],
		},
		public: {
			http: ['https://rpc.zhejiang.ethpandaops.io'],
		},
	},
	blockExplorers: {
		beaconchain: {
			name: 'Etherscan',
			url: 'https://zhejiang.beaconcha.in',
		},
		blockscout: {
			name: 'Blockscout',
			url: 'https://blockscout.com/eth/zhejiang-testnet',
		},
		default: {
			name: 'Beaconchain',
			url: 'https://zhejiang.beaconcha.in',
		},
	},
	testnet: true,
})
//# sourceMappingURL=zhejiang.js.map
