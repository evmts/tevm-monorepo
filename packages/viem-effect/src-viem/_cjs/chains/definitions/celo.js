'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.celo = void 0
const chain_js_1 = require('../../utils/chain.js')
const formatters_js_1 = require('../celo/formatters.js')
const serializers_js_1 = require('../celo/serializers.js')
exports.celo = (0, chain_js_1.defineChain)(
	{
		id: 42220,
		name: 'Celo',
		network: 'celo',
		nativeCurrency: {
			decimals: 18,
			name: 'CELO',
			symbol: 'CELO',
		},
		rpcUrls: {
			default: { http: ['https://forno.celo.org'] },
			infura: {
				http: ['https://celo-mainnet.infura.io/v3'],
			},
			public: {
				http: ['https://forno.celo.org'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Celo Explorer',
				url: 'https://explorer.celo.org/mainnet',
			},
			etherscan: { name: 'CeloScan', url: 'https://celoscan.io' },
		},
		contracts: {
			multicall3: {
				address: '0xcA11bde05977b3631167028862bE2a173976CA11',
				blockCreated: 13112599,
			},
		},
		testnet: false,
	},
	{
		formatters: formatters_js_1.formattersCelo,
		serializers: serializers_js_1.serializersCelo,
	},
)
//# sourceMappingURL=celo.js.map
