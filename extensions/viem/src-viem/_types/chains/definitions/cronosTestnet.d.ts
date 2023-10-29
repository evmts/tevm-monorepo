export declare const cronosTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 338
		readonly name: 'Cronos Testnet'
		readonly network: 'cronos-testnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'CRO'
			readonly symbol: 'tCRO'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://evm-t3.cronos.org']
			}
			readonly public: {
				readonly http: readonly ['https://evm-t3.cronos.org']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Cronos Explorer'
				readonly url: 'https://cronos.org/explorer/testnet3'
			}
		}
		readonly contracts: {
			readonly multicall3: {
				readonly address: '0xcA11bde05977b3631167028862bE2a173976CA11'
				readonly blockCreated: 10191251
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=cronosTestnet.d.ts.map
