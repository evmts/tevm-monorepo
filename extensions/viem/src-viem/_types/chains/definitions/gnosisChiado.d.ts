export declare const gnosisChiado: import('../../types/utils.js').Assign<
	{
		readonly id: 10200
		readonly name: 'Gnosis Chiado'
		readonly network: 'chiado'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Gnosis'
			readonly symbol: 'xDAI'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.chiadochain.net']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.chiadochain.net']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Blockscout'
				readonly url: 'https://blockscout.chiadochain.net'
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=gnosisChiado.d.ts.map
