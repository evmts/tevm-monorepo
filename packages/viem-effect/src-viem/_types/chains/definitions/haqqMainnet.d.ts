export declare const haqqMainnet: import('../../types/utils.js').Assign<
	{
		readonly id: 11235
		readonly name: 'HAQQ Mainnet'
		readonly network: 'haqq-mainnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Islamic Coin'
			readonly symbol: 'ISLM'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.eth.haqq.network']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.eth.haqq.network']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'HAQQ Explorer'
				readonly url: 'https://explorer.haqq.network'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=haqqMainnet.d.ts.map
