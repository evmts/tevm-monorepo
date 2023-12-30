export declare const bronosTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 1038
		readonly name: 'Bronos Testnet'
		readonly network: 'bronos-testnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Bronos Coin'
			readonly symbol: 'tBRO'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://evm-testnet.bronos.org']
			}
			readonly public: {
				readonly http: readonly ['https://evm-testnet.bronos.org']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'BronoScan'
				readonly url: 'https://tbroscan.bronos.org'
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=bronosTestnet.d.ts.map
