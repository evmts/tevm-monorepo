export declare const filecoinHyperspace: import('../../types/utils.js').Assign<
	{
		readonly id: 3141
		readonly name: 'Filecoin Hyperspace'
		readonly network: 'filecoin-hyperspace'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'testnet filecoin'
			readonly symbol: 'tFIL'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://api.hyperspace.node.glif.io/rpc/v1']
			}
			readonly public: {
				readonly http: readonly ['https://api.hyperspace.node.glif.io/rpc/v1']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Filfox'
				readonly url: 'https://hyperspace.filfox.info/en'
			}
			readonly filscan: {
				readonly name: 'Filscan'
				readonly url: 'https://hyperspace.filscan.io'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=filecoinHyperspace.d.ts.map
