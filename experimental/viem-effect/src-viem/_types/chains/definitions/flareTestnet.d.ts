export declare const flareTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 114
		readonly name: 'Coston2'
		readonly network: 'coston2'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'coston2flare'
			readonly symbol: 'C2FLR'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://coston2-api.flare.network/ext/C/rpc']
			}
			readonly public: {
				readonly http: readonly ['https://coston2-api.flare.network/ext/C/rpc']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Coston2 Explorer'
				readonly url: 'https://coston2-explorer.flare.network'
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=flareTestnet.d.ts.map
