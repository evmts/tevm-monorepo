export declare const classic: import('../../types/utils.js').Assign<
	{
		readonly id: 61
		readonly name: 'Ethereum Classic'
		readonly network: 'classic'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'ETC'
			readonly symbol: 'ETC'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://etc.rivet.link']
			}
			readonly public: {
				readonly http: readonly ['https://etc.rivet.link']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Blockscout'
				readonly url: 'https://blockscout.com/etc/mainnet'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=classic.d.ts.map
