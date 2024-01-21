'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.lineaTestnet = void 0
const chain_js_1 = require('../../utils/chain.js')
exports.lineaTestnet = (0, chain_js_1.defineChain)({
	id: 59140,
	name: 'Linea Goerli Testnet',
	network: 'linea-testnet',
	nativeCurrency: { name: 'Linea Ether', symbol: 'ETH', decimals: 18 },
	rpcUrls: {
		infura: {
			http: ['https://linea-goerli.infura.io/v3'],
			webSocket: ['wss://linea-goerli.infura.io/ws/v3'],
		},
		default: {
			http: ['https://rpc.goerli.linea.build'],
			webSocket: ['wss://rpc.goerli.linea.build'],
		},
		public: {
			http: ['https://rpc.goerli.linea.build'],
			webSocket: ['wss://rpc.goerli.linea.build'],
		},
	},
	blockExplorers: {
		default: {
			name: 'Etherscan',
			url: 'https://goerli.lineascan.build',
		},
		etherscan: {
			name: 'Etherscan',
			url: 'https://goerli.lineascan.build',
		},
		blockscout: {
			name: 'Blockscout',
			url: 'https://explorer.goerli.linea.build',
		},
	},
	contracts: {
		multicall3: {
			address: '0xca11bde05977b3631167028862be2a173976ca11',
			blockCreated: 498623,
		},
	},
	testnet: true,
})
//# sourceMappingURL=lineaTestnet.js.map
