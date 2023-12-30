export declare const evmos: import('../../types/utils.js').Assign<
	{
		readonly id: 9001
		readonly name: 'Evmos'
		readonly network: 'evmos'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Evmos'
			readonly symbol: 'EVMOS'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://eth.bd.evmos.org:8545']
			}
			readonly public: {
				readonly http: readonly ['https://eth.bd.evmos.org:8545']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Evmos Block Explorer'
				readonly url: 'https://escan.live'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=evmos.d.ts.map
