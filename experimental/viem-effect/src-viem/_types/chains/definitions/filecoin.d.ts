export declare const filecoin: import('../../types/utils.js').Assign<
	{
		readonly id: 314
		readonly name: 'Filecoin Mainnet'
		readonly network: 'filecoin-mainnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'filecoin'
			readonly symbol: 'FIL'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://api.node.glif.io/rpc/v1']
			}
			readonly public: {
				readonly http: readonly ['https://api.node.glif.io/rpc/v1']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Filfox'
				readonly url: 'https://filfox.info/en'
			}
			readonly filscan: {
				readonly name: 'Filscan'
				readonly url: 'https://filscan.io'
			}
			readonly filscout: {
				readonly name: 'Filscout'
				readonly url: 'https://filscout.io/en'
			}
			readonly glif: {
				readonly name: 'Glif'
				readonly url: 'https://explorer.glif.io'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=filecoin.d.ts.map
