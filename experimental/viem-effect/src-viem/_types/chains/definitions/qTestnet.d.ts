export declare const qTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 35443
		readonly name: 'Q Testnet'
		readonly network: 'q-testnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Q'
			readonly symbol: 'Q'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.qtestnet.org']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.qtestnet.org']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Q Testnet Explorer'
				readonly url: 'https://explorer.qtestnet.org'
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=qTestnet.d.ts.map
