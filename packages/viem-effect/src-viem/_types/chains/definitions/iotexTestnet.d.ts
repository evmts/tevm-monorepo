export declare const iotexTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 4690
		readonly name: 'IoTeX Testnet'
		readonly network: 'iotex-testnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'IoTeX'
			readonly symbol: 'IOTX'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://babel-api.testnet.iotex.io']
				readonly webSocket: readonly ['wss://babel-api.testnet.iotex.io']
			}
			readonly public: {
				readonly http: readonly ['https://babel-api.testnet.iotex.io']
				readonly webSocket: readonly ['wss://babel-api.testnet.iotex.io']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'IoTeXScan'
				readonly url: 'https://testnet.iotexscan.io'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=iotexTestnet.d.ts.map
