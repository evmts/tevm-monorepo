export declare const evmosTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 9000
		readonly name: 'Evmos Testnet'
		readonly network: 'evmos-testnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Evmos'
			readonly symbol: 'EVMOS'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://eth.bd.evmos.dev:8545']
			}
			readonly public: {
				readonly http: readonly ['https://eth.bd.evmos.dev:8545']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Evmos Testnet Block Explorer'
				readonly url: 'https://evm.evmos.dev/'
			}
		}
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=evmosTestnet.d.ts.map
