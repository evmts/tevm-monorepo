'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
exports.celoCannoli = void 0
const chain_js_1 = require('../../utils/chain.js')
const formatters_js_1 = require('../celo/formatters.js')
const serializers_js_1 = require('../celo/serializers.js')
exports.celoCannoli = (0, chain_js_1.defineChain)(
	{
		id: 17323,
		name: 'Cannoli',
		network: 'celo-cannoli',
		nativeCurrency: {
			decimals: 18,
			name: 'CELO',
			symbol: 'C-CELO',
		},
		rpcUrls: {
			default: {
				http: ['https://forno.cannoli.celo-testnet.org'],
			},
			public: {
				http: ['https://forno.cannoli.celo-testnet.org'],
			},
		},
		blockExplorers: {
			default: {
				name: 'Celo Explorer',
				url: 'https://explorer.celo.org/cannoli',
			},
		},
		contracts: {
			multicall3: {
				address: '0x5Acb0aa8BF4E8Ff0d882Ee187140713C12BF9718',
				blockCreated: 87429,
			},
		},
		testnet: true,
	},
	{
		formatters: formatters_js_1.formattersCelo,
		serializers: serializers_js_1.serializersCelo,
	},
)
//# sourceMappingURL=celoCannoli.js.map
