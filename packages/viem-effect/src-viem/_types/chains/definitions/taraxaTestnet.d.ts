export declare const taraxaTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 842
		readonly name: 'Taraxa Testnet'
		readonly network: 'taraxa-testnet'
		readonly nativeCurrency: {
			readonly name: 'Tara'
			readonly symbol: 'TARA'
			readonly decimals: 18
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://rpc.testnet.taraxa.io']
			}
			readonly public: {
				readonly http: readonly ['https://rpc.testnet.taraxa.io']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Taraxa Explorer'
				readonly url: 'https://explorer.testnet.taraxa.io'
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=taraxaTestnet.d.ts.map
