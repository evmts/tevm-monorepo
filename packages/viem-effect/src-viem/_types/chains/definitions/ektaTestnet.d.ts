export declare const ektaTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 1004
		readonly name: 'Ekta Testnet'
		readonly network: 'ekta-testnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'EKTA'
			readonly symbol: 'EKTA'
		}
		readonly rpcUrls: {
			readonly public: {
				readonly http: readonly ['https://test.ekta.io:8545']
			}
			readonly default: {
				readonly http: readonly ['https://test.ekta.io:8545']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Test Ektascan'
				readonly url: 'https://test.ektascan.io'
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=ektaTestnet.d.ts.map
