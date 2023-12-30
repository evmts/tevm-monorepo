export declare const flare: import('../../types/utils.js').Assign<
	{
		readonly id: 14
		readonly name: 'Flare Mainnet'
		readonly network: 'flare-mainnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'flare'
			readonly symbol: 'FLR'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://flare-api.flare.network/ext/C/rpc']
			}
			readonly public: {
				readonly http: readonly ['https://flare-api.flare.network/ext/C/rpc']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Flare Explorer'
				readonly url: 'https://flare-explorer.flare.network'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=flare.d.ts.map
