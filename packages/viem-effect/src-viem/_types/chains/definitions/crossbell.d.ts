export declare const crossbell: import('../../types/utils.js').Assign<
	{
		readonly id: 3737
		readonly network: 'crossbell'
		readonly name: 'Crossbell'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'CSB'
			readonly symbol: 'CSB'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.crossbell.io']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.crossbell.io']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'CrossScan'
				readonly url: 'https://scan.crossbell.io'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 38246031
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=crossbell.d.ts.map
