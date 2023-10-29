'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.linea = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.linea = (0, chain_js_1.defineChain)({
	id: 59144,
	name: 'Linea Mainnet',
	network: 'linea-mainnet',
	nativeCurrency: { name: 'Linea Ether', symbol: 'ETH', decimals: 18 },
	rpcUrls: {
		infura: {
			http: ['https://linea-mainnet.infura.io/v3'],
			webSocket: ['wss://linea-mainnet.infura.io/ws/v3'],
		},
		default: {
			http: ['https://rpc.linea.build'],
			webSocket: ['wss://rpc.linea.build'],
		},
		public: {
			http: ['https://rpc.linea.build'],
			webSocket: ['wss://rpc.linea.build'],
		},
	},
	blockExplorers: {
		default: {
			name: 'Etherscan',
			url: 'https://lineascan.build',
		},
		etherscan: {
			name: 'Etherscan',
			url: 'https://lineascan.build',
		},
		blockscout: {
			name: 'Blockscout',
			url: 'https://explorer.linea.build',
		},
	},
	contracts: {
		multicall3: {
			address: '0xcA11bde05977b3631167028862bE2a173976CA11',
			blockCreated: 42,
		},
	},
	testnet: false,
})
//# sourceMappingURL=linea.js.map
