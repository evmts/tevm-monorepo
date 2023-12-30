export declare const songbird: import('../../types/utils.js').Assign<
	{
		readonly id: 19
		readonly name: 'Songbird Mainnet'
		readonly network: 'songbird-mainnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'songbird'
			readonly symbol: 'SGB'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://songbird-api.flare.network/ext/C/rpc']
			}
			readonly public: {
				readonly http: readonly ['https://songbird-api.flare.network/ext/C/rpc']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Songbird Explorer'
				readonly url: 'https://songbird-explorer.flare.network'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=songbird.d.ts.map
