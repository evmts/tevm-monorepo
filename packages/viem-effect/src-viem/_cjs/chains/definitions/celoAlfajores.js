'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.celoAlfajores = void 0
const chain_js_1 = require('../../utils/chain.js')
const formatters_js_1 = require('../celo/formatters.js')
const serializers_js_1 = require('../celo/serializers.js')
exports.celoAlfajores = (0, chain_js_1.defineChain)(
	{
		id: 44787,
		name: 'Alfajores',
		network: 'celo-alfajores',
		nativeCurrency: {
			decimals: 18,
			name: 'CELO',
			symbol: 'A-CELO',
		},
		rpcUrls: {
			default: {
				http: ['https://alfajores-forno.celo-testnet.org'],
			},
			infura: {
				http: ['https://celo-alfajores.infura.io/v3'],
			},
			public: {
				http: ['https://alfajores-forno.celo-testnet.org'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Celo Explorer',
				url: 'https://explorer.celo.org/alfajores',
			},
			etherscan: { name: 'CeloScan', url: 'https://alfajores.celoscan.io/' },
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 14569001,
			},
		},
		testnet: true,
	},
	{
		formatters: formatters_js_1.formattersCelo,
		serializers: serializers_js_1.serializersCelo,
	},
)
//# sourceMappingURL=celoAlfajores.js.map
