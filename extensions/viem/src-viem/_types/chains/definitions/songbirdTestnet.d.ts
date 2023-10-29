export declare const songbirdTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 16
		readonly name: 'Coston'
		readonly network: 'coston'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'costonflare'
			readonly symbol: 'CFLR'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://coston-api.flare.network/ext/C/rpc']
			}
			readonly public: {
				readonly http: readonly ['https://coston-api.flare.network/ext/C/rpc']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Coston Explorer'
				readonly url: 'https://coston-explorer.flare.network'
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=songbirdTestnet.d.ts.map
