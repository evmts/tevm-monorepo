export declare const fuse: import('../../types/utils.js').Assign<
	{
		readonly id: 122
		readonly name: 'Fuse'
		readonly network: 'fuse'
		readonly nativeCurrency: {
			readonly name: 'Fuse'
			readonly symbol: 'FUSE'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.fuse.io']
			}
			readonly public: {
				readonly http: readonly ['https://fuse-mainnet.chainstacklabs.com']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Fuse Explorer'
				readonly url: 'https://explorer.fuse.io'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=fuse.d.ts.map
