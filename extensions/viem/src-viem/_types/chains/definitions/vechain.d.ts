export declare const vechain: import('../../types/utils.js').Assign<
	{
		readonly id: 100009
		readonly name: 'Vechain'
		readonly network: 'vechain'
		readonly nativeCurrency: {
			readonly name: 'VeChain'
			readonly symbol: 'VET'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://mainnet.vechain.org']
			}
			readonly public: {
				readonly http: readonly ['https://mainnet.vechain.org']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Vechain Explorer'
				readonly url: 'https://explore.vechain.org'
			}
			readonly vechainStats: {
				readonly name: 'Vechain Stats'
				readonly url: 'https://vechainstats.com'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=vechain.d.ts.map
