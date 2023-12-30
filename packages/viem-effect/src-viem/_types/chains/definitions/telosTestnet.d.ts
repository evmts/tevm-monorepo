export declare const telosTestnet: import('../../types/utils.js').Assign<
	{
		readonly id: 41
		readonly name: 'Telos'
		readonly network: 'telosTestnet'
		readonly nativeCurrency: {
			readonly decimals: 18
			readonly name: 'Telos'
			readonly symbol: 'TLOS'
		}
		readonly rpcUrls: {
			readonly default: {
				readonly http: readonly ['https://testnet.telos.net/evm']
			}
			readonly public: {
				readonly http: readonly ['https://testnet.telos.net/evm']
			}
		}
		readonly blockExplorers: {
			readonly default: {
				readonly name: 'Teloscan (testnet)'
				readonly url: 'https://testnet.teloscan.io/'
			}
		}
		readonly testnet: true
	},
	import('../../types/chain.js').ChainConfig<
		import('../../index.js').ChainFormatters
	>
>
//# sourceMappingURL=telosTestnet.d.ts.map
