export declare const iotex: import('../../types/utils.js').Assign<
	{
		readonly id: 4689
		readonly name: 'IoTeX'
		readonly network: 'iotex'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'IoTeX'
			readonly symbol: 'IOTX'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://babel-api.mainnet.iotex.io']
				readonly webSocket: readonly ['wss://babel-api.mainnet.iotex.io']
			}
			readonly public: {
				readonly http: readonly ['https://babel-api.mainnet.iotex.io']
				readonly webSocket: readonly ['wss://babel-api.mainnet.iotex.io']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'IoTeXScan'
				readonly url: 'https://iotexscan.io'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=iotex.d.ts.map
