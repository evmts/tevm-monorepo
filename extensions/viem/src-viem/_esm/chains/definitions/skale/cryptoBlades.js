import { defineChain } from '../../../utils/chain.js'
export const skaleCryptoBlades = /*#__PURE__*/ defineChain({
	id: 1026062157,
	name: 'SKALE | CryptoBlades',
	network: 'skale-cryptoblades',
	nativeCurrency: { name: 'sFUEL', symbol: 'sFUEL', decimals: 18 },
	rpcUrls: {
		default: {
			http: ['https://mainnet.skalenodes.com/v1/affectionate-immediate-pollux'],
			webSocket: [
				'wss://mainnet.skalenodes.com/v1/ws/affectionate-immediate-pollux',
			],
		},
		public: {
			http: ['https://mainnet.skalenodes.com/v1/affectionate-immediate-pollux'],
			webSocket: [
				'wss://mainnet.skalenodes.com/v1/ws/affectionate-immediate-pollux',
			],
		},
	},
	blockExplorers: {
		blockscout: {
			name: 'SKALE Explorer',
			url: 'https://affectionate-immediate-pollux.explorer.mainnet.skalenodes.com',
		},
		default: {
			name: 'SKALE Explorer',
			url: 'https://affectionate-immediate-pollux.explorer.mainnet.skalenodes.com',
		},
	},
	contracts: {},
})
//# sourceMappingURL=cryptoBlades.js.map
