export declare const fuseSparknet: import('../../types/utils.js').Assign<
	{
		readonly id: 123
		readonly name: 'Fuse Sparknet'
		readonly network: 'fuse'
		readonly nativeCurrency: {
			readonly name: 'Spark'
			readonly symbol: 'SPARK'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.fusespark.io']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.fusespark.io']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Sparkent Explorer'
				readonly url: 'https://explorer.fusespark.io'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=fuseSparknet.d.ts.map
