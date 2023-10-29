export declare const cronos: import('../../types/utils.js').Assign<
	{
		readonly id: 25
		readonly name: 'Cronos Mainnet'
		readonly network: 'cronos'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Cronos'
			readonly symbol: 'CRO'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://evm.cronos.org']
			}
			readonly public: {
				readonly http: readonly ['https://evm.cronos.org']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Cronoscan'
				readonly url: 'https://cronoscan.com'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 1963112
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=cronos.d.ts.map
